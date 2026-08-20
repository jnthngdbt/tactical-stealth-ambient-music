import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { NightGradingPass } from './NightGradingPass.ts';
import { createTiles, sampleGroundHeight, localToEnu, enuToLocal } from './tiles.ts';
import type { Checkpoint } from './objects/operator.ts';
import { TRAJECTORIES, PATHS_READY, OPERATOR_NAMES, MAP_ROTATION_DEG } from './mission.ts';
import { buildMissionUrl } from './urlParams.ts';
import * as CONST from './constants.ts';

// Runs while any operator in mission.ts still has an incomplete path (see
// PATHS_READY), or whenever the HUD mode toggle switches into path-editing
// mode. Starts in a straight-down view (no camera drift, no operator
// movement) but supports full OrbitControls orbiting (Ctrl+left-drag) to
// look around the scene while editing — otherwise the same bloom +
// night-grading render pipeline as cinematic mode, so switching modes
// doesn't change how the scene looks. Click the ground to add a checkpoint
// for the selected operator; the "Save" button
// builds a mission URL (site + these paths, no token) and navigates there,
// which starts cinematic mode straight from the saved link once every
// operator has at least 1 checkpoint (a single checkpoint just stands
// there). "Cancel" instead discards any in-progress edits and calls
// onCancel (only shown when mission.ts's TRAJECTORIES were already valid,
// i.e. there's a cinematic view to go back to). Returns a dispose()
// function that tears this mode down so another mode can take over the page.
export function runPathEditor(onCancel: () => void): () => void {
	const renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setClearColor(CONST.BACKGROUND_COLOR);
	document.body.appendChild(renderer.domElement);

	const scene = new THREE.Scene();

	const centroid = new THREE.Vector3();
	// each operator's first checkpoint doubles as its spawn point; centre the
	// initial view on whichever ones already exist (none yet is fine too —
	// the camera just starts at the site origin until "Add" places one)
	const spawnPoints = TRAJECTORIES.map((path) => path[0]).filter((cp): cp is Checkpoint => !!cp);
	spawnPoints.forEach((sp) => centroid.add(enuToLocal(sp.east, sp.north, 0)));
	centroid.divideScalar(Math.max(1, spawnPoints.length));

	// Orthographic camera, starting in a straight-down view over the centroid.
	// Uses the standard Y-up OrbitControls convention (no more camera-up
	// hackery — see the orbit setup below) so real 3D orbiting works.
	const aspect = window.innerWidth / window.innerHeight;
	const camera = new THREE.OrthographicCamera(
		-CONST.EDIT_VIEW_HALF_SIZE * aspect,
		CONST.EDIT_VIEW_HALF_SIZE * aspect,
		CONST.EDIT_VIEW_HALF_SIZE,
		-CONST.EDIT_VIEW_HALF_SIZE,
		1,
		4000,
	);
	const orbitTarget = new THREE.Vector3(centroid.x, 0, centroid.z);
	camera.up.set(0, 1, 0);
	// A perfectly vertical offset is parallel to the up axis, which leaves
	// OrbitControls' internal azimuthal angle undefined — nudge it off the pole
	// by a tiny, visually-imperceptible amount so the bearing seeded from
	// mission.ts (a previously saved map bearing) is well-defined from frame 1.
	const initialBearing = (MAP_ROTATION_DEG * Math.PI) / 180;
	const initialOffset = new THREE.Vector3(0, 0, CONST.EDIT_CAMERA_HEIGHT * 0.01).applyAxisAngle(
		new THREE.Vector3(0, 1, 0),
		initialBearing,
	);
	initialOffset.y = CONST.EDIT_CAMERA_HEIGHT;
	camera.position.copy(orbitTarget).add(initialOffset);
	camera.lookAt(orbitTarget);

	const { tiles } = createTiles(camera, renderer);
	scene.add(tiles.group);

	// Ground-height sampling (checkpoint marker/line altitude, below) can hit
	// stale/placeholder geometry before the map's initial tiles finish
	// streaming in — wait for that before drawing any checkpoint, same pattern
	// cinematic mode uses to gate operator visibility (main.ts).
	let mapReady = false;
	function onTilesLoadEnd() {
		mapReady = true;
		tiles.removeEventListener('tiles-load-end', onTilesLoadEnd);
		// One-time correction of the orbit pivot's height (seeded at y=0, real
		// terrain height unknown until now) — done here, before the user has
		// touched anything, and never again: standard OrbitControls never
		// touches target.y on its own, and doing so ourselves mid-interaction
		// (tried and reverted) is exactly what made panning/orbiting feel off.
		controls.target.y = sampleGroundHeight(tiles, controls.target.x, controls.target.z, controls.target.y);
		paths.forEach((_, i) => rebuildOperatorVisual(i));
	}
	tiles.addEventListener('tiles-load-end', onTilesLoadEnd);

	// Same bloom + night-grading pipeline as cinematic mode (see app.ts).
	const composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));
	composer.addPass(
		new UnrealBloomPass(
			new THREE.Vector2(window.innerWidth, window.innerHeight),
			CONST.BLOOM_STRENGTH,
			CONST.BLOOM_RADIUS,
			CONST.BLOOM_THRESHOLD,
		),
	);
	composer.addPass(
		new NightGradingPass({
			exposure: CONST.NIGHT_EXPOSURE,
			tint: CONST.NIGHT_TINT,
			saturation: CONST.NIGHT_SATURATION,
			vignette: CONST.NIGHT_VIGNETTE,
		}),
	);
	composer.addPass(new OutputPass());

	// Checkpoint timestamp tags render through a separate CSS2D layer, same as
	// operator nameplates in cinematic mode, so the text stays crisp regardless
	// of zoom/bloom.
	const labelRenderer = new CSS2DRenderer();
	labelRenderer.setSize(window.innerWidth, window.innerHeight);
	labelRenderer.domElement.style.position = 'fixed';
	labelRenderer.domElement.style.top = '0';
	labelRenderer.domElement.style.left = '0';
	labelRenderer.domElement.style.pointerEvents = 'none';
	labelRenderer.domElement.style.zIndex = '1';
	document.body.appendChild(labelRenderer.domElement);

	// Left-drag pans by default; OrbitControls itself auto-switches a
	// PAN-mapped button to ROTATE while Ctrl/Meta/Shift is held, so Ctrl+drag
	// orbits with no extra wiring here. Right-click is left unmapped, so it
	// does nothing at all.
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.enableRotate = true;
	// false keeps pan strictly on the horizontal ground plane (perpendicular
	// to world up) regardless of camera tilt — true ("screen space") would
	// drag along the camera's own tilted up/down axis instead, which reads as
	// the map bobbing up and down in altitude whenever the view isn't top-down.
	controls.screenSpacePanning = false;
	controls.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY };
	controls.target.copy(orbitTarget);
	controls.minZoom = 0.2;
	controls.maxZoom = 8;
	controls.maxPolarAngle = CONST.EDIT_ORBIT_MAX_POLAR_ANGLE; // keep the horizon in frame, same as cinematic mode
	renderer.domElement.addEventListener('contextmenu', (e) => e.preventDefault());

	function onResize() {
		const newAspect = window.innerWidth / window.innerHeight;
		camera.left = -CONST.EDIT_VIEW_HALF_SIZE * newAspect;
		camera.right = CONST.EDIT_VIEW_HALF_SIZE * newAspect;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		composer.setSize(window.innerWidth, window.innerHeight);
		labelRenderer.setSize(window.innerWidth, window.innerHeight);
	}
	window.addEventListener('resize', onResize);

	// Working copy of each operator's path, seeded from mission.ts so a
	// partially-built config can be resumed and extended.
	const paths: Checkpoint[][] = TRAJECTORIES.map((path) => path.map((cp) => ({ ...cp })));
	// Editor-only callsigns, kept in sync with `paths` as operators are added/deleted.
	const names: string[] = [...OPERATOR_NAMES];
	let selected = 0;
	// Whether checkpoint markers/path lines depth-test against terrain/buildings
	// (occluded like normal scene geometry) or always draw on top; toggled by 'O'.
	let occludePaths = true;
	// Whether per-checkpoint ETA tags are shown; toggled by 'T'.
	let showTimestamps = true;

	function pickAvailableName(): string {
		const used = new Set(names);
		const candidates = CONST.OPERATOR_NAME_POOL.filter((n) => !used.has(n));
		const pool = candidates.length ? candidates : CONST.OPERATOR_NAME_POOL;
		return pool[Math.floor(Math.random() * pool.length)];
	}

	const operatorGroups: THREE.Group[] = paths.map(() => {
		const group = new THREE.Group();
		scene.add(group);
		return group;
	});
	// Checkpoint timestamp tags aren't part of `group` (CSS2DObject DOM nodes
	// aren't cleaned up by removing them from the scene graph, see disposeGroup),
	// so they're tracked per operator here and removed explicitly before a rebuild.
	const labelElements: HTMLDivElement[][] = paths.map(() => []);

	function disposeGroup(group: THREE.Group) {
		group.children.forEach((child) => {
			const mesh = child as THREE.Mesh | THREE.Line;
			mesh.geometry?.dispose();
			(mesh.material as THREE.Material)?.dispose?.();
		});
		group.clear();
	}

	const formatElapsed = (seconds: number) => {
		const s = Math.round(seconds);
		const mm = Math.floor(s / 60);
		const ss = String(s % 60).padStart(2, '0');
		return `${mm}:${ss}`;
	};

	// Redraws one operator's markers (a disc per checkpoint, the first
	// bigger), connecting line, and per-checkpoint estimated timestamp tags,
	// dimmed unless it's the selected operator. Timestamps assume the operator
	// walks the whole route at its constant OPERATOR_SPEED (per-operator speed
	// variance is randomized in cinematic mode, so it can't be predicted here) —
	// a best-effort ETA for planning routes, not a guaranteed arrival time.
	function rebuildOperatorVisual(index: number) {
		const group = operatorGroups[index];
		disposeGroup(group);
		labelElements[index].forEach((el) => el.remove());
		labelElements[index] = [];

		if (!mapReady) return; // ground samples would be wrong/placeholder before tiles stream in

		const path = paths[index];
		const color = CONST.OPERATOR_COLOR;
		const opacity = index === selected ? CONST.EDIT_PATH_OPACITY_ACTIVE : CONST.EDIT_PATH_OPACITY_INACTIVE;
		const hex = `#${new THREE.Color(color).getHexString()}`;

		// Line points sit a bit above ground (EDIT_LINE_HEIGHT_OFFSET, keeps the
		// line from z-fighting with flat terrain); markers stay flush with the ground.
		// Both depth-test against occludePaths, see the 'o' key toggle below.
		const linePoints: THREE.Vector3[] = [];
		let elapsed = 0;
		path.forEach((checkpoint, i) => {
			const local = enuToLocal(checkpoint.east, checkpoint.north, 0);
			const groundY = sampleGroundHeight(tiles, local.x, local.z, local.y);
			local.y = groundY + CONST.EDIT_MARKER_HEIGHT;
			linePoints.push(new THREE.Vector3(local.x, groundY + CONST.EDIT_LINE_HEIGHT_OFFSET, local.z));

			const radius = i === 0 ? CONST.EDIT_MARKER_START_RADIUS : CONST.EDIT_MARKER_RADIUS;
			const marker = new THREE.Mesh(
				new THREE.CircleGeometry(radius, 20),
				new THREE.MeshBasicMaterial({ color, transparent: true, opacity, toneMapped: false, depthTest: occludePaths }),
			);
			marker.rotation.x = -Math.PI / 2;
			marker.position.copy(local);
			marker.renderOrder = occludePaths ? 0 : 2;
			marker.userData.checkpointIndex = i; // picked up by the drag hit-test below
			group.add(marker);

			if (i > 0) {
				const prev = path[i - 1];
				const legDistance = Math.hypot(checkpoint.east - prev.east, checkpoint.north - prev.north);
				elapsed += legDistance / CONST.OPERATOR_SPEED;
			}

			if (showTimestamps) {
				const labelEl = document.createElement('div');
				labelEl.className = 'checkpoint-label';
				labelEl.textContent = formatElapsed(elapsed);
				labelEl.style.color = hex;
				labelEl.style.borderLeftColor = hex;
				labelEl.style.opacity = String(opacity);
				const label = new CSS2DObject(labelEl);
				label.position.copy(local);
				label.center.set(0.5, 1.4); // renders just above the marker, screen-space only
				group.add(label);
				labelElements[index].push(labelEl);
			}
		});

		if (linePoints.length >= 2) {
			const line = new THREE.Line(
				new THREE.BufferGeometry().setFromPoints(linePoints),
				new THREE.LineBasicMaterial({ color, transparent: true, opacity, toneMapped: false, depthTest: occludePaths }),
			);
			line.renderOrder = occludePaths ? 0 : 1;
			group.add(line);
		}
	}

	paths.forEach((_, i) => rebuildOperatorVisual(i));

	// --- HUD wiring -----------------------------------------------------

	document.body.classList.add('mode-edit');
	const recordBtn = document.getElementById('hudRec');
	if (recordBtn) recordBtn.style.display = 'none';
	// Also the cinematic/edit mode toggle (main.ts) — hidden entirely while
	// editing, since previewing in-progress edits in cinematic mode isn't
	// meaningful; "Save" (below) is the only way out, via a mission URL.
	const coordsPanel = document.querySelector<HTMLElement>('.hud-coords-panel');
	if (coordsPanel) coordsPanel.style.display = 'none';
	const telemetryEl = document.getElementById('hudTelemetry');
	if (telemetryEl) telemetryEl.style.display = 'none';
	const vitalsPanel = document.getElementById('hudVitalsPanel');
	if (vitalsPanel) vitalsPanel.style.display = 'none';
	const subtitleEl = document.querySelector('.hud-subtitle');
	const originalSubtitle = subtitleEl?.textContent ?? '';
	if (subtitleEl) subtitleEl.textContent = 'PATH EDITOR // TOP-DOWN';
	const editorPanel = document.getElementById('editorPanel');
	editorPanel?.removeAttribute('hidden');

	const editorOperatorEl = document.getElementById('editorOperator');
	const editorCountEl = document.getElementById('editorCount');
	const editorBearingEl = document.getElementById('editorBearing');
	const saveBtn = document.getElementById('editorSaveBtn');
	const addBtn = document.getElementById('editorAddBtn');
	const deleteBtn = document.getElementById('editorDeleteBtn');
	const cancelBtn = document.getElementById('editorCancelBtn');
	// Nothing to cancel back to if mission.ts didn't already have valid paths
	// (i.e. the editor started because PATHS_READY was false at load).
	if (cancelBtn) cancelBtn.style.display = PATHS_READY ? '' : 'none';

	function updateHud() {
		if (paths.length === 0) {
			if (editorOperatorEl) {
				editorOperatorEl.textContent = 'No operators';
				editorOperatorEl.style.color = '';
			}
			if (editorCountEl) editorCountEl.textContent = 'Click "Add" to create one';
			return;
		}

		const name = names[selected] ?? '';
		const hex = `#${new THREE.Color(CONST.OPERATOR_COLOR).getHexString()}`;
		if (editorOperatorEl) {
			editorOperatorEl.textContent = `${name} [${selected + 1}/${paths.length}]`;
			editorOperatorEl.style.color = hex;
		}
		if (editorCountEl) {
			const count = paths[selected].length;
			editorCountEl.textContent = `${count} checkpoint${count === 1 ? '' : 's'}${count === 0 ? ' (need 1+)' : ''}`;
		}
	}
	updateHud();

	function updateBearingHud() {
		if (!editorBearingEl) return;
		const deg = Math.round((((controls.getAzimuthalAngle() * 180) / Math.PI) % 360 + 360) % 360);
		editorBearingEl.textContent = `Map bearing: ${deg}\u00b0`;
	}
	updateBearingHud();

	function selectOperator(index: number) {
		if (index < 0 || index >= paths.length) return;
		selected = index;
		paths.forEach((_, i) => rebuildOperatorVisual(i));
		updateHud();
	}

	function onKeyDown(event: KeyboardEvent) {
		const num = Number.parseInt(event.key, 10);
		if (!Number.isNaN(num) && num >= 1 && num <= paths.length) {
			selectOperator(num - 1);
			return;
		}
		if ((event.key === 'Backspace' || event.key === 'Delete') && paths.length > 0) {
			paths[selected].pop();
			rebuildOperatorVisual(selected);
			updateHud();
		}
		if (event.key === 'o' || event.key === 'O') {
			occludePaths = !occludePaths;
			paths.forEach((_, i) => rebuildOperatorVisual(i));
		}
		if (event.key === 't' || event.key === 'T') {
			showTimestamps = !showTimestamps;
			paths.forEach((_, i) => rebuildOperatorVisual(i));
		}
	}
	window.addEventListener('keydown', onKeyDown);

	const round1 = (v: number) => Math.round(v * 10) / 10;

	// Where a newly-clicked point should be spliced into an existing path,
	// rather than always appending at the end. Scans every leg (i, i+1) and
	// scores it by the point's distance to that leg's segment; the leg with
	// the lowest score wins and the point is inserted between its two
	// checkpoints. The first and last legs are also scored against their
	// *unclamped* projection (t outside [0,1]) so a point that overshoots
	// past either end of the path is scored by its endpoint distance and
	// correctly prepended/appended instead of being forced "between" the
	// outermost two checkpoints.
	function findInsertIndex(path: Checkpoint[], point: Checkpoint): number {
		if (path.length < 2) return path.length; // nothing to be "between" yet
		let bestIndex = path.length;
		let bestDistSq = Infinity;
		for (let i = 0; i < path.length - 1; i++) {
			const a = path[i];
			const b = path[i + 1];
			const abEast = b.east - a.east;
			const abNorth = b.north - a.north;
			const apEast = point.east - a.east;
			const apNorth = point.north - a.north;
			const abLenSq = abEast * abEast + abNorth * abNorth;
			const t = abLenSq > 0 ? (apEast * abEast + apNorth * abNorth) / abLenSq : 0;
			const tc = Math.max(0, Math.min(1, t));
			const closestEast = a.east + tc * abEast;
			const closestNorth = a.north + tc * abNorth;
			const dEast = point.east - closestEast;
			const dNorth = point.north - closestNorth;
			const distSq = dEast * dEast + dNorth * dNorth;
			if (distSq >= bestDistSq) continue;
			bestDistSq = distSq;
			if (i === 0 && t < 0) bestIndex = 0; // before the first checkpoint
			else if (i === path.length - 2 && t > 1) bestIndex = path.length; // after the last checkpoint
			else bestIndex = i + 1; // between checkpoints i and i+1
		}
		return bestIndex;
	}

	function onSaveClick() {
		const rotationDeg = (controls.getAzimuthalAngle() * 180) / Math.PI;
		window.location.href = buildMissionUrl(CONST.SITE_LAT, CONST.SITE_LON, paths, rotationDeg, CONST.CAMERA_DRIFT_ALTITUDE, CONST.HUD_OPACITY);
	}
	function onAddClick() {
		paths.push([]);
		names.push(pickAvailableName());
		const group = new THREE.Group();
		scene.add(group);
		operatorGroups.push(group);
		labelElements.push([]);
		selected = paths.length - 1;
		paths.forEach((_, i) => rebuildOperatorVisual(i));
		updateHud();
	}
	function onDeleteClick() {
		if (paths.length <= 1) return; // always keep at least one operator

		disposeGroup(operatorGroups[selected]);
		scene.remove(operatorGroups[selected]);
		operatorGroups.splice(selected, 1);
		labelElements[selected].forEach((el) => el.remove());
		labelElements.splice(selected, 1);
		paths.splice(selected, 1);
		names.splice(selected, 1);

		selected = Math.min(selected, paths.length - 1);
		paths.forEach((_, i) => rebuildOperatorVisual(i));
		updateHud();
	}
	function onCancelClick() {
		onCancel();
	}
	saveBtn?.addEventListener('click', onSaveClick);
	addBtn?.addEventListener('click', onAddClick);
	deleteBtn?.addEventListener('click', onDeleteClick);
	cancelBtn?.addEventListener('click', onCancelClick);

	// --- Checkpoint placement --------------------------------------------
	// A pointerdown/pointerup pair with a movement threshold, so a pan-drag
	// (also the left mouse button, via controls.mouseButtons above) doesn't
	// also drop a checkpoint. Pointerdown on an existing marker instead starts
	// a drag that repositions that checkpoint, taking priority over placement.
	// Right-click is unmapped entirely (see controls.mouseButtons above) and
	// Ctrl+left-drag orbits via OrbitControls' own built-in modifier-key
	// handling — both bail out of this logic up front.
	const raycaster = new THREE.Raycaster();
	let downPos: { x: number; y: number } | null = null;
	let draggingIndex: number | null = null;

	function ndcFromEvent(event: PointerEvent) {
		const rect = renderer.domElement.getBoundingClientRect();
		return new THREE.Vector2(
			((event.clientX - rect.left) / rect.width) * 2 - 1,
			-((event.clientY - rect.top) / rect.height) * 2 + 1,
		);
	}

	renderer.domElement.addEventListener('pointerdown', (event) => {
		if (event.button !== 0 || event.ctrlKey) return; // right-click: nothing; Ctrl+left: orbit

		downPos = { x: event.clientX, y: event.clientY };
		if (paths.length === 0) return;

		raycaster.setFromCamera(ndcFromEvent(event), camera);
		const markerHit = raycaster.intersectObjects(operatorGroups[selected].children, false)
			.find((hit) => hit.object.userData.checkpointIndex !== undefined);
		if (markerHit) {
			draggingIndex = markerHit.object.userData.checkpointIndex as number;
			controls.enabled = false; // don't let OrbitControls pan while dragging a marker
			renderer.domElement.style.cursor = 'grabbing';
		}
	});

	renderer.domElement.addEventListener('pointermove', (event) => {
		if (draggingIndex === null) return;
		raycaster.setFromCamera(ndcFromEvent(event), camera);
		const hit = raycaster.intersectObject(tiles.group, true)[0];
		if (!hit) return;

		const { east, north } = localToEnu(hit.point.x, hit.point.z);
		paths[selected][draggingIndex] = { east: round1(east), north: round1(north) };
		rebuildOperatorVisual(selected);
	});

	renderer.domElement.addEventListener('pointerup', (event) => {
		if (draggingIndex !== null) {
			draggingIndex = null;
			controls.enabled = true;
			renderer.domElement.style.cursor = '';
			downPos = null;
			updateHud();
			return;
		}

		if (!downPos) return;
		const moved = Math.hypot(event.clientX - downPos.x, event.clientY - downPos.y);
		downPos = null;
		if (moved > CONST.EDIT_CLICK_DRAG_THRESHOLD_PX || paths.length === 0) return;

		raycaster.setFromCamera(ndcFromEvent(event), camera);
		const hit = raycaster.intersectObject(tiles.group, true)[0];
		if (!hit) return;

		const { east, north } = localToEnu(hit.point.x, hit.point.z);
		const checkpoint = { east: round1(east), north: round1(north) };
		paths[selected].splice(findInsertIndex(paths[selected], checkpoint), 0, checkpoint);
		rebuildOperatorVisual(selected);
		updateHud();
	});

	// --- Render loop (no drift/operator animation, but the camera can orbit) ---

	let rafId = 0;
	function animate() {
		rafId = requestAnimationFrame(animate);
		camera.updateMatrixWorld();
		tiles.setResolutionFromRenderer(camera, renderer);
		tiles.setCamera(camera);
		tiles.update();
		controls.update();
		updateBearingHud(); // bearing changes continuously while orbiting
		composer.render();
		labelRenderer.render(scene, camera);
	}

	animate();

	// Tears everything path-editor-specific down (including the listeners
	// above on persistent HUD elements/window) so cinematic mode (or a fresh
	// path editor run) can take over the page cleanly.
	return function dispose() {
		cancelAnimationFrame(rafId);
		window.removeEventListener('resize', onResize);
		window.removeEventListener('keydown', onKeyDown);
		saveBtn?.removeEventListener('click', onSaveClick);
		addBtn?.removeEventListener('click', onAddClick);
		deleteBtn?.removeEventListener('click', onDeleteClick);
		cancelBtn?.removeEventListener('click', onCancelClick);
		operatorGroups.forEach(disposeGroup);
		labelElements.forEach((els) => els.forEach((el) => el.remove()));
		tiles.removeEventListener('tiles-load-end', onTilesLoadEnd);
		tiles.dispose();
		controls.dispose();
		renderer.dispose();
		renderer.domElement.remove();
		labelRenderer.domElement.remove();

		document.body.classList.remove('mode-edit');
		if (recordBtn) recordBtn.style.display = '';
		if (coordsPanel) coordsPanel.style.display = '';
		if (telemetryEl) telemetryEl.style.display = '';
		if (vitalsPanel) vitalsPanel.style.display = '';
		if (subtitleEl) subtitleEl.textContent = originalSubtitle;
		editorPanel?.setAttribute('hidden', '');
	};
}
