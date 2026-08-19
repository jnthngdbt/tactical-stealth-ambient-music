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
import { TRAJECTORIES, OPERATOR_NAMES, MAP_ROTATION_DEG } from './mission.ts';
import { buildMissionUrl } from './urlParams.ts';
import * as CONST from './constants.ts';

// Runs while any operator in mission.ts still has an incomplete path (see
// PATHS_READY), or whenever the HUD mode toggle switches into path-editing
// mode. A static, straight-down view — no camera drift, no operator movement
// — but otherwise the same bloom + night-grading render pipeline as cinematic
// mode, so switching modes doesn't change how the scene looks. Click the
// ground to add a checkpoint for the selected operator; the "Save" button
// builds a mission URL (site + these paths, no token) and navigates there,
// which starts cinematic mode straight from the saved link once every
// operator has 2+ checkpoints. Returns a dispose() function that tears this
// mode down so another mode can take over the page.
export function runPathEditor(): () => void {
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

	// Straight-down orthographic camera: an "up" vector parallel to the view
	// direction is a classic OrbitControls gimbal-lock trap, so the camera
	// points along -Y while "up" points along -Z instead of the default +Y.
	const aspect = window.innerWidth / window.innerHeight;
	const camera = new THREE.OrthographicCamera(
		-CONST.EDIT_VIEW_HALF_SIZE * aspect,
		CONST.EDIT_VIEW_HALF_SIZE * aspect,
		CONST.EDIT_VIEW_HALF_SIZE,
		-CONST.EDIT_VIEW_HALF_SIZE,
		1,
		4000,
	);
	camera.position.set(centroid.x, CONST.EDIT_CAMERA_HEIGHT, centroid.z);

	// Map bearing (radians): Ctrl-drag anywhere on the view rotates it around
	// the vertical axis, like turning a paper map, while the camera stays
	// locked straight down at the same spot (see the pointer handlers below).
	// Seeded from mission.ts so a previously saved bearing resumes as-is.
	let mapRotation = (MAP_ROTATION_DEG * Math.PI) / 180;
	const Y_AXIS = new THREE.Vector3(0, 1, 0);
	function applyMapRotation() {
		camera.up.set(0, 0, -1).applyAxisAngle(Y_AXIS, mapRotation);
		camera.lookAt(centroid.x, 0, centroid.z);
	}
	applyMapRotation();

	const { tiles } = createTiles(camera, renderer);
	scene.add(tiles.group);

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

	// OrbitControls caches a quaternion derived from camera.up once at
	// construction time (used internally for pan direction) — recreated via
	// refreshControlsAfterRoll() below whenever a Ctrl-drag changes camera.up,
	// so panning still tracks the screen correctly after rotating the view.
	function createControls(target: THREE.Vector3): OrbitControls {
		const c = new OrbitControls(camera, renderer.domElement);
		c.enableRotate = false; // locked top-down, no angle/animation
		c.screenSpacePanning = true;
		c.mouseButtons = { LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
		c.target.copy(target);
		c.minZoom = 0.2;
		c.maxZoom = 8;
		return c;
	}
	let controls = createControls(new THREE.Vector3(centroid.x, 0, centroid.z));
	function refreshControlsAfterRoll() {
		const target = controls.target.clone();
		controls.dispose();
		controls = createControls(target);
	}
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
	// walks the whole route at its steady OPERATOR_CREEP_SPEED (dash bursts are
	// randomized in cinematic mode, so they can't be predicted here) — a
	// best-effort ETA for planning routes, not a guaranteed arrival time.
	function rebuildOperatorVisual(index: number) {
		const group = operatorGroups[index];
		disposeGroup(group);
		labelElements[index].forEach((el) => el.remove());
		labelElements[index] = [];

		const path = paths[index];
		const color = CONST.OPERATOR_COLOR;
		const opacity = index === selected ? CONST.EDIT_PATH_OPACITY_ACTIVE : CONST.EDIT_PATH_OPACITY_INACTIVE;
		const hex = `#${new THREE.Color(color).getHexString()}`;

		// Line points sit well above ground (EDIT_LINE_HEIGHT_OFFSET) so the path
		// stays visible over buildings/terrain instead of ducking behind the mesh
		// between two ground-hugging checkpoints; markers stay flush with the ground.
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
				// depthTest off (same as the path line) so markers sitting flush with
				// the ground aren't occluded by building meshes at that spot.
				new THREE.MeshBasicMaterial({ color, transparent: true, opacity, toneMapped: false, depthTest: false }),
			);
			marker.rotation.x = -Math.PI / 2;
			marker.position.copy(local);
			marker.renderOrder = 2;
			marker.userData.checkpointIndex = i; // picked up by the drag hit-test below
			group.add(marker);

			if (i > 0) {
				const prev = path[i - 1];
				const legDistance = Math.hypot(checkpoint.east - prev.east, checkpoint.north - prev.north);
				elapsed += legDistance / CONST.OPERATOR_CREEP_SPEED;
			}

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
		});

		if (linePoints.length >= 2) {
			const line = new THREE.Line(
				new THREE.BufferGeometry().setFromPoints(linePoints),
				new THREE.LineBasicMaterial({ color, transparent: true, opacity, toneMapped: false, depthTest: false }),
			);
			line.renderOrder = 1;
			group.add(line);
		}
	}

	paths.forEach((_, i) => rebuildOperatorVisual(i));

	// --- HUD wiring -----------------------------------------------------

	document.body.classList.add('mode-edit');
	const recordBtn = document.getElementById('hudRec');
	if (recordBtn) recordBtn.style.display = 'none';
	const coordsPanel = document.querySelector<HTMLElement>('.hud-coords-panel');
	if (coordsPanel) coordsPanel.style.display = 'none';
	const telemetryEl = document.getElementById('hudTelemetry');
	if (telemetryEl) telemetryEl.style.display = 'none';
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

	// Cinematic mode reads TRAJECTORIES straight from mission.ts, so previewing
	// in-progress edits there isn't meaningful — hidden entirely while editing;
	// "Save" (below) is the only way out, via a mission URL carrying the edits.
	const modeToggleBtn = document.getElementById('modeToggleBtn') as HTMLButtonElement | null;
	if (modeToggleBtn) modeToggleBtn.style.display = 'none';

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
			editorCountEl.textContent = `${count} checkpoint${count === 1 ? '' : 's'}${count < 2 ? ' (need 2+)' : ''}`;
		}
	}
	updateHud();

	function updateBearingHud() {
		if (!editorBearingEl) return;
		const deg = Math.round((((mapRotation * 180) / Math.PI) % 360 + 360) % 360);
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
	}
	window.addEventListener('keydown', onKeyDown);

	const round1 = (v: number) => Math.round(v * 10) / 10;

	function onSaveClick() {
		const rotationDeg = (mapRotation * 180) / Math.PI;
		window.location.href = buildMissionUrl(CONST.SITE_LAT, CONST.SITE_LON, paths, rotationDeg);
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
	saveBtn?.addEventListener('click', onSaveClick);
	addBtn?.addEventListener('click', onAddClick);
	deleteBtn?.addEventListener('click', onDeleteClick);

	// --- Checkpoint placement --------------------------------------------
	// A pointerdown/pointerup pair with a movement threshold, so a pan-drag
	// (also the left mouse button, via controls.mouseButtons above) doesn't
	// also drop a checkpoint. Pointerdown on an existing marker instead starts
	// a drag that repositions that checkpoint, taking priority over placement.
	const raycaster = new THREE.Raycaster();
	let downPos: { x: number; y: number } | null = null;
	let draggingIndex: number | null = null;

	// Ctrl-drag rotates the view (see applyMapRotation above) instead of
	// panning/placing a checkpoint — tracked separately from marker dragging.
	let rotating = false;
	let rotateStartAngle = 0;
	let rotateStartRotation = 0;

	function angleFromPointer(event: PointerEvent): number {
		const rect = renderer.domElement.getBoundingClientRect();
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		return Math.atan2(event.clientY - cy, event.clientX - cx);
	}

	function ndcFromEvent(event: PointerEvent) {
		const rect = renderer.domElement.getBoundingClientRect();
		return new THREE.Vector2(
			((event.clientX - rect.left) / rect.width) * 2 - 1,
			-((event.clientY - rect.top) / rect.height) * 2 + 1,
		);
	}

	renderer.domElement.addEventListener('pointerdown', (event) => {
		if (event.ctrlKey && event.button === 0) {
			rotating = true;
			rotateStartAngle = angleFromPointer(event);
			rotateStartRotation = mapRotation;
			controls.enabled = false; // rotating and panning don't mix
			renderer.domElement.style.cursor = 'grabbing';
			return;
		}

		downPos = { x: event.clientX, y: event.clientY };
		if (event.button !== 0 || paths.length === 0) return;

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
		if (rotating) {
			mapRotation = rotateStartRotation + (angleFromPointer(event) - rotateStartAngle);
			applyMapRotation();
			updateBearingHud();
			return;
		}

		if (draggingIndex === null) return;
		raycaster.setFromCamera(ndcFromEvent(event), camera);
		const hit = raycaster.intersectObject(tiles.group, true)[0];
		if (!hit) return;

		const { east, north } = localToEnu(hit.point.x, hit.point.z);
		paths[selected][draggingIndex] = { east: round1(east), north: round1(north) };
		rebuildOperatorVisual(selected);
	});

	renderer.domElement.addEventListener('pointerup', (event) => {
		if (rotating) {
			rotating = false;
			refreshControlsAfterRoll(); // camera.up changed, its cached pan quat needs refreshing
			renderer.domElement.style.cursor = '';
			return;
		}

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

		const rect = renderer.domElement.getBoundingClientRect();
		const ndc = new THREE.Vector2(
			((event.clientX - rect.left) / rect.width) * 2 - 1,
			-((event.clientY - rect.top) / rect.height) * 2 + 1,
		);
		raycaster.setFromCamera(ndc, camera);
		const hit = raycaster.intersectObject(tiles.group, true)[0];
		if (!hit) return;

		const { east, north } = localToEnu(hit.point.x, hit.point.z);
		if (event.button === 2) {
			paths[selected].pop(); // right-click: undo last checkpoint
		} else {
			paths[selected].push({ east: round1(east), north: round1(north) });
		}
		rebuildOperatorVisual(selected);
		updateHud();
	});

	// --- Render loop (static camera, no drift/animation) -----------------

	let rafId = 0;
	function animate() {
		rafId = requestAnimationFrame(animate);
		camera.updateMatrixWorld();
		tiles.setResolutionFromRenderer(camera, renderer);
		tiles.setCamera(camera);
		tiles.update();
		controls.update();
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
		operatorGroups.forEach(disposeGroup);
		labelElements.forEach((els) => els.forEach((el) => el.remove()));
		tiles.dispose();
		renderer.dispose();
		renderer.domElement.remove();
		labelRenderer.domElement.remove();

		document.body.classList.remove('mode-edit');
		if (recordBtn) recordBtn.style.display = '';
		if (coordsPanel) coordsPanel.style.display = '';
		if (telemetryEl) telemetryEl.style.display = '';
		if (subtitleEl) subtitleEl.textContent = originalSubtitle;
		if (modeToggleBtn) modeToggleBtn.style.display = '';
		editorPanel?.setAttribute('hidden', '');
	};
}
