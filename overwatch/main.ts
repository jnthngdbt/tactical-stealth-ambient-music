import * as THREE from 'three';
import { App } from './app.ts';
import { createTiles, sampleGroundHeight } from './tiles.ts';
import { Operator } from './objects/operator.ts';
import { Recorder } from '../objectives/recorder.ts';
import { TRAJECTORIES, PATHS_READY, OPERATOR_NAMES, MAP_ROTATION_DEG } from './mission.ts';
import { runPathEditor } from './pathEditor.ts';
import * as CONST from './constants.ts';

type Mode = 'cinematic' | 'edit';

// Cinematic mode is the default once every operator has a real path
// configured in mission.ts (TRAJECTORIES); otherwise the path editor starts
// first so those paths can be built by hand (see pathEditor.ts). The site
// coords readout doubles as the toggle into path-editing mode; pathEditor.ts
// hides it entirely while active (its "Save" button generates a mission URL
// with the edited paths and navigates there instead).
let mode: Mode = PATHS_READY ? 'cinematic' : 'edit';
let stopCurrentMode: (() => void) | null = null;

const hudEl = document.getElementById('hud');
if (hudEl) hudEl.style.opacity = String(CONST.HUD_OPACITY);

// H toggles the HUD's readouts/panels off, leaving only the camera framing
// brackets (.hud-corner/.hud-target-corner) visible — see the
// `#hud.hud-minimal` rule in overlay.css. Also strips each operator's
// callsign label/leader line (a CSS2DObject + THREE.Line, not part of #hud's
// DOM subtree), so `activeOperators` is kept in sync by runCinematic below
// rather than reading a fixed array captured at module load.
let hudMinimal = false;
let activeOperators: Operator[] = [];
window.addEventListener('keydown', (event) => {
	if (event.key !== 'h' && event.key !== 'H') return;
	hudMinimal = !hudMinimal;
	hudEl?.classList.toggle('hud-minimal', hudMinimal);
	activeOperators.forEach((operator) => operator.setLabelVisible(!hudMinimal));
});

const coordsPanelToggle = document.querySelector<HTMLElement>('.hud-coords-panel');

function updateModeToggleLabel() {
	if (!coordsPanelToggle) return;
	coordsPanelToggle.title = mode === 'cinematic' ? 'Switch to path editor' : 'Switch to cinematic view';
}

function startMode(next: Mode) {
	stopCurrentMode?.();
	mode = next;
	stopCurrentMode = mode === 'cinematic' ? runCinematic() : runPathEditor(() => startMode('cinematic'));
	updateModeToggleLabel();
}

coordsPanelToggle?.addEventListener('click', () => startMode(mode === 'cinematic' ? 'edit' : 'cinematic'));

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

	// nothing is ticked or shown until the tiles needed for the current view
	// have actually finished downloading/parsing — 3d-tiles-renderer fires this
	// once its load queues drain, which may still leave far-away, not-yet-
	// visited parts of a long patrol route unloaded (handled by Operator's own
	// per-leg ground-sample readiness once it walks there)
	let mapReady = false;
	function onTilesLoadEnd() {
		mapReady = true;
		operators.forEach((operator) => (operator.visible = true));
		tiles.removeEventListener('tiles-load-end', onTilesLoadEnd);
	}
	tiles.addEventListener('tiles-load-end', onTilesLoadEnd);

	const coordsEl = document.getElementById('hudCoords');
	if (coordsEl) coordsEl.textContent = `${CONST.SITE_LAT.toFixed(5)}, ${CONST.SITE_LON.toFixed(5)}`;

	const timecodeEl = document.getElementById('hudTimecode');
	const altEl = document.getElementById('hudAlt');
	const hdgEl = document.getElementById('hudHdg');
	const spdEl = document.getElementById('hudSpd');
	const batteryEl = document.getElementById('hudBattery');
	const lastCameraPos = app.camera.position.clone();

	const formatTimecode = (seconds: number) => {
		const s = Math.floor(seconds);
		const hh = String(Math.floor(s / 3600)).padStart(2, '0');
		const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
		const ss = String(s % 60).padStart(2, '0');
		return `${hh}:${mm}:${ss}`;
	};

	const recorder = new Recorder(app.renderer.domElement);
	const recordBtn = document.getElementById('hudRec') as HTMLButtonElement;
	let recordingElapsed = 0;
	// start() is async (it awaits the tab-capture permission prompt), so the
	// class toggle must wait for it too or isRecording still reads false.
	async function onRecordClick() {
		if (recorder.isRecording) {
			recorder.stop();
		} else {
			recordingElapsed = 0;
			await recorder.start();
		}
		recordBtn.classList.toggle('recording', recorder.isRecording);
	}
	recordBtn.addEventListener('click', onRecordClick);

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

			const hr = 68 + Math.random() * 8;
			vitals.push({ hr, hrTarget: hr, hrTargetTimer: Math.random() * 5, hrEl, o2El, pulseEl });
		});
	}

	const clock = new THREE.Clock();
	const operatorsCentroid = new THREE.Vector3();
	let frame = 0;
	let rafId = 0;
	let elapsed = 0;

	function animate() {
		rafId = requestAnimationFrame(animate);
		frame++;

		// clamp delta so a backgrounded tab doesn't make operators jump on return
		const delta = Math.min(clock.getDelta(), 0.1);
		elapsed += delta;
		if (recorder.isRecording) recordingElapsed += delta;

		app.camera.updateMatrixWorld();
		tiles.setResolutionFromRenderer(app.camera, app.renderer);
		tiles.setCamera(app.camera);
		tiles.update();

		// Simulated biometrics — bpm wanders on its own randomized timer rather
		// than tracking the operator's actual movement, and only repaints every
		// few seconds, so it reads as a slow-drifting vital sign, not a live wire.
		vitals.forEach((v, i) => {
			v.hrTargetTimer -= delta;
			if (v.hrTargetTimer <= 0) {
				v.hrTarget = 65 + Math.random() * 45;
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

		let groundReady = false;
		if (mapReady) {
			// NaN (not 0) marks "tiles haven't streamed in here yet", so operators
			// never treat an unloaded spot as sea-level ground.
			const groundSample = (x: number, z: number) => sampleGroundHeight(tiles, x, z, NaN);
			operators.forEach((operator) => operator.tick(delta, groundSample, app.camera));

			// the drone always looks at (and flies its figure-eight centered on) the
			// operators' true center, wherever they wander
			operatorsCentroid.set(0, 0, 0);
			operators.forEach((operator) => operatorsCentroid.add(operator.position));
			operatorsCentroid.divideScalar(operators.length);

			// held off until every operator has a real ground sample, so the camera
			// doesn't start drifting/following before it knows their true altitude
			groundReady = operators.every((operator) => operator.isGroundReady());
		}

		app.render(delta, operatorsCentroid, groundReady);

		// Faux flight telemetry, driven by the camera's actual motion so it
		// reads as a live drone feed rather than static decoration.
		if (timecodeEl) timecodeEl.textContent = formatTimecode(recordingElapsed);
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
		if (recorder.isRecording) recorder.stop();
		recordBtn.classList.remove('recording');
		if (timecodeEl) timecodeEl.textContent = formatTimecode(0);
		operators.forEach((operator) => operator.dispose());
		activeOperators = [];
		tiles.dispose();
		app.dispose();
	};
}

