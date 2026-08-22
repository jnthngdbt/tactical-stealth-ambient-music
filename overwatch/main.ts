import * as THREE from 'three';
import { App } from './app.ts';
import { createTiles, isTilesLoaded, sampleGroundHeight, updateTilesResolution } from './tiles.ts';
import { Operator } from './objects/operator.ts';
import { Recorder } from '../objectives/recorder.ts';
import { TRAJECTORIES, PATHS_READY, OPERATOR_NAMES, MAP_ROTATION_DEG } from './mission.ts';
import { runPathEditor } from './pathEditor.ts';
import * as CONST from './constants.ts';

type Mode = 'cinematic' | 'edit';

// Cinematic mode is the default once every operator has a real path
// configured in mission.ts (TRAJECTORIES); otherwise the path editor starts
// first so those paths can be built by hand (see pathEditor.ts). E toggles
// between the two modes; pathEditor.ts hides the site coords readout
// entirely while active (its "Save" button generates a mission URL with the
// edited paths and navigates there instead).
let mode: Mode = PATHS_READY ? 'cinematic' : 'edit';
let stopCurrentMode: (() => void) | null = null;

const hudEl = document.getElementById('hud');
if (hudEl) hudEl.style.opacity = String(CONST.HUD_OPACITY);

// M toggles the HUD's readouts/panels off, leaving only the camera framing
// brackets (.hud-corner/.hud-target-corner) visible — see the
// `#hud.hud-minimal` rule in overlay.css. Also strips each operator's
// callsign label/leader line (a CSS2DObject + THREE.Line, not part of #hud's
// DOM subtree), so `activeOperators` is kept in sync by runCinematic below
// rather than reading a fixed array captured at module load.
let hudMinimal = false;
let activeOperators: Operator[] = [];

// H toggles the shortcuts cheat-sheet (#shortcutsPanel, index.html) — a plain
// top-level overlay, not a #hud child, so it stays visible even while
// hud-minimal is on.
let shortcutsVisible = false;
const shortcutsPanel = document.getElementById('shortcutsPanel');

window.addEventListener('keydown', (event) => {
	if (event.key === 'm' || event.key === 'M') {
		hudMinimal = !hudMinimal;
		hudEl?.classList.toggle('hud-minimal', hudMinimal);
		activeOperators.forEach((operator) => operator.setLabelVisible(!hudMinimal));
	} else if (event.key === 'h' || event.key === 'H') {
		shortcutsVisible = !shortcutsVisible;
		shortcutsPanel?.toggleAttribute('hidden', !shortcutsVisible);
	} else if (event.key === 'e' || event.key === 'E') {
		startMode(mode === 'cinematic' ? 'edit' : 'cinematic');
	}
});

function startMode(next: Mode) {
	stopCurrentMode?.();
	mode = next;
	stopCurrentMode = mode === 'cinematic' ? runCinematic() : runPathEditor(() => startMode('cinematic'));
}

startMode(mode);

function runCinematic(): () => void {
	const app = new App((MAP_ROTATION_DEG * Math.PI) / 180);

	const { tiles } = createTiles(app.camera, app.renderer);
	app.scene.add(tiles.group);

	// exactly one operator per TRAJECTORIES entry (see mission.ts) — hidden
	// until the tileset below reports its initial load complete, so nobody is
	// ever shown floating over a map that hasn't streamed in yet
	const operators = TRAJECTORIES.map((trajectory, i) => {
		const operator = new Operator(trajectory, OPERATOR_NAMES[i], CONST.OPERATOR_COLOR);
		operator.visible = false;
		operator.setLabelVisible(!hudMinimal); // honor an H toggle from a previous cinematic run
		app.scene.add(operator);
		return operator;
	});
	activeOperators = operators;

	// nothing is ticked until the tiles needed for the current view have
	// actually finished downloading/parsing — 3d-tiles-renderer fires this
	// once its load queues drain. This is only a proxy for "this operator's
	// own spawn point is loaded" though: the global queue can be empty while
	// a particular operator's patrol sits somewhere the camera hasn't looked
	// at yet (e.g. tiles already fully loaded from a previous mode run
	// elsewhere on the map), so each operator only becomes visible once ITS
	// OWN ground sample has actually landed (see the tick loop below,
	// isGroundReady()) rather than all at once here.
	let mapReady = false;
	function onTilesLoadEnd() {
		mapReady = true;
		tiles.removeEventListener('tiles-load-end', onTilesLoadEnd);
	}
	tiles.addEventListener('tiles-load-end', onTilesLoadEnd);
	// Tiles are shared across mode switches (see tiles.ts's createTiles) — if
	// they already finished loading in a previous mode run, there's nothing
	// left to trigger a fresh 'tiles-load-end' event, so check synchronously
	// too or this would wait forever.
	if (isTilesLoaded(tiles)) onTilesLoadEnd();

	const coordsEl = document.getElementById('hudCoords');
	if (coordsEl) coordsEl.textContent = `${CONST.SITE_LAT.toFixed(5)}, ${CONST.SITE_LON.toFixed(5)}`;

	const altEl = document.getElementById('hudAlt');
	const hdgEl = document.getElementById('hudHdg');
	const spdEl = document.getElementById('hudSpd');
	const batteryEl = document.getElementById('hudBattery');
	const lastCameraPos = app.camera.position.clone();

	const recorder = new Recorder(app.renderer.domElement);
	const recordBtn = document.getElementById('hudRec') as HTMLButtonElement;
	// start() is async (it awaits the tab-capture permission prompt), so the
	// class toggle must wait for it too or isRecording still reads false.
	async function onRecordClick() {
		if (recorder.isRecording) {
			recorder.stop();
		} else {
			await recorder.start();
		}
		recordBtn.classList.toggle('recording', recorder.isRecording);
	}
	recordBtn.addEventListener('click', onRecordClick);

	// R is a keyboard shortcut for the same start/stop action as clicking hudRec.
	function onKeyDown(event: KeyboardEvent) {
		if (event.key === 'r' || event.key === 'R') onRecordClick();
	}
	window.addEventListener('keydown', onKeyDown);

	// NaN (not 0) marks "tiles haven't streamed in here yet" — shared by the
	// per-frame tick() sampling below and the Ctrl+scroll checkpoint jump.
	const groundSample = (x: number, z: number) => sampleGroundHeight(tiles, x, z, NaN);

	// Ctrl/Cmd+scroll teleports every operator to the next (scroll up) or
	// previous (scroll down) checkpoint on its patrol path, instead of
	// smoothly walking there — the drone camera keeps its own fixed-distance
	// framing on the operators' centroid (see app.ts's updateDrift/updateLookAt),
	// so it swoops to catch up on its own, no special-casing needed here.
	// Standard wheel notches and continuous trackpad deltas are both folded
	// through CHECKPOINT_SCRUB_THRESHOLD so one scroll gesture reads as one
	// deliberate step, not several skipped checkpoints. Listener is on
	// `window` (not the canvas, where OrbitControls' own wheel listener
	// lives) with `capture:true` so it always runs first regardless of
	// registration order, and only preempts OrbitControls' zoom while
	// Ctrl/Meta is actually held.
	let wheelAccum = 0;
	function onWheel(event: WheelEvent) {
		if (!(event.ctrlKey || event.metaKey)) return;
		event.preventDefault();
		event.stopPropagation();
		if (!mapReady) return;

		wheelAccum += event.deltaY;
		while (Math.abs(wheelAccum) >= CONST.CHECKPOINT_SCRUB_THRESHOLD) {
			const dir = wheelAccum < 0 ? 1 : -1; // scroll up (negative deltaY) -> next checkpoint
			operators.forEach((operator) => operator.jumpCheckpoint(dir, groundSample));
			wheelAccum -= Math.sign(wheelAccum) * CONST.CHECKPOINT_SCRUB_THRESHOLD;
		}
	}
	window.addEventListener('wheel', onWheel, { capture: true, passive: false });

	// Per-operator name + simulated biometrics (bpm, blood-oxygen), replacing
	// the map's own attribution text (removed) with something relevant to the
	// mission instead. Rows are built dynamically since operator count varies
	// (see mission.ts's TRAJECTORIES) rather than hardcoded in index.html.
	interface OperatorVitals {
		hr: number; // beats per minute, eased toward hrTarget each frame
		hrTarget: number; // wanders on its own timer, independent of the operator's actual movement
		hrTargetTimer: number; // seconds until hrTarget is re-rolled
		hrEl: HTMLElement;
		o2El: HTMLElement;
		pulseEl: HTMLElement;
	}
	const vitalsPanelEl = document.getElementById('hudOperators');
	const vitals: OperatorVitals[] = [];
	if (vitalsPanelEl) {
		vitalsPanelEl.innerHTML = '';
		operators.forEach((_, i) => {
			const row = document.createElement('div');
			row.className = 'hud-operator-row';

			const nameEl = document.createElement('span');
			nameEl.className = 'hud-operator-name';
			nameEl.textContent = OPERATOR_NAMES[i] ?? `OP-${i + 1}`;

			const vitalsEl = document.createElement('span');
			vitalsEl.className = 'hud-operator-vitals';

			const pulseEl = document.createElement('i');
			pulseEl.className = 'hud-operator-pulse';

			const hrEl = document.createElement('span');
			hrEl.className = 'hud-operator-hr';
			hrEl.textContent = '--';

			const hrUnitEl = document.createElement('span');
			hrUnitEl.className = 'hud-operator-hr-unit';
			hrUnitEl.textContent = 'BPM';

			const o2El = document.createElement('span');
			o2El.className = 'hud-operator-o2';
			o2El.textContent = '--%';

			vitalsEl.append(pulseEl, hrEl, hrUnitEl, o2El);
			row.append(nameEl, vitalsEl);
			vitalsPanelEl.appendChild(row);

			const hr = 60 + Math.random() * 4;
			vitals.push({ hr, hrTarget: hr, hrTargetTimer: Math.random() * 5, hrEl, o2El, pulseEl });
		});
	}

	const clock = new THREE.Clock();
	const operatorsCentroid = new THREE.Vector3();
	let frame = 0;
	let rafId = 0;
	let elapsed = 0;

	// One-time correction of the camera's startup framing (assumed
	// near-sea-level) to the real ground altitude at the site origin —
	// otherwise a high-elevation site (e.g. ~600m ASL) leaves the camera stuck
	// underground forever whenever there are no operators around to otherwise
	// correct it via updateDrift's ground-aware centroid snap. Retried every
	// frame (not just once at tiles-load-end) since the origin's tile may not
	// have a hit-able mesh loaded yet on the very first ready frame. If no
	// sample succeeds for a while, the camera itself is the problem (a badly
	// wrong startup elevation guess means its own view frustum never reaches
	// the real ground, so nothing ever streams in there to sample) — walk the
	// guess up through CAMERA_ELEVATION_GUESSES until one finally breaks that
	// deadlock (see the constant's comment in constants.ts for the full story).
	let siteGroundPlaced = false;
	let elevationGuessIndex = 0;
	let elevationGuessDeadline = 0; // set once mapReady flips (see animate below)

	function animate() {
		rafId = requestAnimationFrame(animate);
		frame++;

		// clamp delta so a backgrounded tab doesn't make operators jump on return
		const delta = Math.min(clock.getDelta(), 0.1);
		elapsed += delta;

		app.camera.updateMatrixWorld();
		updateTilesResolution(tiles, app.camera, app.renderer);
		tiles.setCamera(app.camera);
		tiles.update();

		if (mapReady && !siteGroundPlaced) {
			if (elevationGuessDeadline === 0) {
				elevationGuessDeadline = performance.now() + CONST.CAMERA_ELEVATION_GUESS_RETRY_SECONDS * 1000;
			}
			const siteGroundY = sampleGroundHeight(tiles, 0, 0, NaN);
			if (!Number.isNaN(siteGroundY)) {
				app.placeCamera(siteGroundY);
				siteGroundPlaced = true;
			} else if (
				performance.now() >= elevationGuessDeadline &&
				elevationGuessIndex < CONST.CAMERA_ELEVATION_GUESSES.length - 1
			) {
				elevationGuessIndex++;
				elevationGuessDeadline = performance.now() + CONST.CAMERA_ELEVATION_GUESS_RETRY_SECONDS * 1000;
				app.placeCamera(CONST.CAMERA_ELEVATION_GUESSES[elevationGuessIndex]);
			}
		}

		// Simulated biometrics — bpm wanders on its own randomized timer rather
		// than tracking the operator's actual movement, and only repaints every
		// few seconds, so it reads as a slow-drifting vital sign, not a live wire.
		// The wander is centered on a baseline that starts around 60 BPM and
		// climbs ~8 BPM per minute (rising exertion over the mission), with
		// fluctuations layered on top of that climbing baseline.
		const hrBaseline = 60 + (elapsed / 60) * 8;
		vitals.forEach((v, i) => {
			v.hrTargetTimer -= delta;
			if (v.hrTargetTimer <= 0) {
				v.hrTarget = hrBaseline + (Math.random() * 16 - 8);
				v.hrTargetTimer = 12 + Math.random() * 10;
			}
			v.hr += (v.hrTarget - v.hr) * Math.min(1, delta * 0.15);
			if (frame % 45 === 0) {
				v.hrEl.textContent = Math.round(v.hr).toString();
				v.pulseEl.style.animationDuration = `${(60 / v.hr).toFixed(2)}s`;
				const o2 = 97 + Math.sin(elapsed * 0.25 + i * 1.7) * 1.3;
				v.o2El.textContent = `O2 ${Math.round(o2)}%`;
			}
		});

		// With zero operators (see mission.ts's TRAJECTORIES) there's no centroid
		// to fly around or look at — app.render leaves the camera under plain
		// orbit control with no automatic movement in that case.
		const hasOperators = operators.length > 0;
		let groundReady = false;
		if (mapReady && hasOperators) {
			operators.forEach((operator) => {
				operator.tick(delta, groundSample, app.camera);
				// reveal only once this specific operator has snapped to its own
				// real ground height, not just when the global tile queue is
				// empty — otherwise an operator whose spawn point wasn't in the
				// camera's initial view can flash at its coordinate-space y=0
				// default (often far above or below real terrain) before its
				// first sample lands
				if (!operator.visible && operator.isGroundReady()) operator.visible = true;
			});

			// the drone always looks at (and flies its figure-eight centered on) the
			// operators' true center, wherever they wander
			operatorsCentroid.set(0, 0, 0);
			operators.forEach((operator) => operatorsCentroid.add(operator.position));
			operatorsCentroid.divideScalar(operators.length);

			// held off until every operator has a real ground sample, so the camera
			// doesn't start drifting/following before it knows their true altitude
			groundReady = operators.every((operator) => operator.isGroundReady());
		}

		app.render(delta, operatorsCentroid, groundReady, hasOperators);

		// Faux flight telemetry, driven by the camera's actual motion so it
		// reads as a live drone feed rather than static decoration.
		if (groundReady) {
			if (altEl) altEl.textContent = Math.round(app.camera.position.y - operatorsCentroid.y).toString();

			const dx = app.controls.target.x - app.camera.position.x;
			const dz = app.controls.target.z - app.camera.position.z;
			// site is reoriented so +X = west, +Z = north (see tiles.ts/ReorientationPlugin),
			// i.e. east = -X — bearing is measured clockwise from north.
			const bearing = (Math.atan2(-dx, dz) * (180 / Math.PI) + 360) % 360;
			if (hdgEl) hdgEl.textContent = Math.round(bearing).toString().padStart(3, '0');

			const speed = app.camera.position.distanceTo(lastCameraPos) / delta;
			if (spdEl) spdEl.textContent = speed.toFixed(1);
		}
		lastCameraPos.copy(app.camera.position);

		// Slow, steady drain for a believable in-flight battery readout.
		if (batteryEl) batteryEl.textContent = `${Math.max(61, Math.round(98 - elapsed * 0.015))}%`;
	}

	animate();

	// Tears everything cinematic-mode-specific down so the path editor (or a
	// fresh cinematic run) can take over the page cleanly.
	return function dispose() {
		cancelAnimationFrame(rafId);
		tiles.removeEventListener('tiles-load-end', onTilesLoadEnd);
		recordBtn.removeEventListener('click', onRecordClick);
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('wheel', onWheel, { capture: true });
		if (recorder.isRecording) recorder.stop();
		recordBtn.classList.remove('recording');
		operators.forEach((operator) => operator.dispose());
		activeOperators = [];
		// tiles itself is intentionally NOT disposed here — it's shared across
		// mode switches (see tiles.ts's createTiles) so already-downloaded tile
		// data survives toggling back and forth instead of being refetched.
		app.dispose();
	};
}

