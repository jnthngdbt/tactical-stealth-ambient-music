import * as THREE from 'three';
import { App } from './app.ts';
import { createTiles, sampleGroundHeight } from './tiles.ts';
import { Operator } from './objects/operator.ts';
import { Recorder } from '../objectives/recorder.ts';
import { TRAJECTORIES, PATHS_READY, OPERATOR_NAMES } from './mission.ts';
import { runPathEditor } from './pathEditor.ts';
import * as CONST from './constants.ts';

type Mode = 'cinematic' | 'edit';

// Cinematic mode is the default once every operator has a real path
// configured in mission.ts (TRAJECTORIES); otherwise the path editor starts
// first so those paths can be built by hand (see pathEditor.ts). The HUD
// toggle button below switches modes, except pathEditor.ts disables it while
// there are unsaved edits (use its "Copy all" button first).
let mode: Mode = PATHS_READY ? 'cinematic' : 'edit';
let stopCurrentMode: (() => void) | null = null;

const modeToggleBtn = document.getElementById('modeToggleBtn') as HTMLButtonElement | null;

function updateModeToggleLabel() {
	if (!modeToggleBtn) return;
	modeToggleBtn.textContent = mode === 'cinematic' ? 'Edit paths' : 'Play';
	modeToggleBtn.title = mode === 'cinematic' ? 'Switch to path editor' : 'Switch to cinematic view';
}

function startMode(next: Mode) {
	stopCurrentMode?.();
	mode = next;
	stopCurrentMode = mode === 'cinematic' ? runCinematic() : runPathEditor();
	updateModeToggleLabel();
}

modeToggleBtn?.addEventListener('click', () => startMode(mode === 'cinematic' ? 'edit' : 'cinematic'));

startMode(mode);

function runCinematic(): () => void {
	const app = new App();

	const { tiles } = createTiles(app.camera, app.renderer);
	app.scene.add(tiles.group);

	// exactly one operator per TRAJECTORIES entry (see mission.ts)
	const operators = TRAJECTORIES.map((trajectory, i) => {
		const operator = new Operator(trajectory, OPERATOR_NAMES[i], CONST.OPERATOR_COLOR);
		app.scene.add(operator);
		return operator;
	});

	const coordsEl = document.getElementById('hudCoords');
	if (coordsEl) coordsEl.textContent = `${CONST.SITE_LAT.toFixed(5)}, ${CONST.SITE_LON.toFixed(5)}`;

	const recorder = new Recorder(app.renderer.domElement);
	const recordBtn = document.getElementById('recordBtn') as HTMLButtonElement;
	function onRecordClick() {
		if (recorder.isRecording) recorder.stop();
		else recorder.start();
		recordBtn.classList.toggle('recording', recorder.isRecording);
	}
	recordBtn.addEventListener('click', onRecordClick);

	const attributionEl = document.getElementById('hudAttribution');

	const clock = new THREE.Clock();
	const operatorsCentroid = new THREE.Vector3();
	let frame = 0;
	let rafId = 0;

	function animate() {
		rafId = requestAnimationFrame(animate);
		frame++;

		// clamp delta so a backgrounded tab doesn't make operators jump on return
		const delta = Math.min(clock.getDelta(), 0.1);

		app.camera.updateMatrixWorld();
		tiles.setResolutionFromRenderer(app.camera, app.renderer);
		tiles.setCamera(app.camera);
		tiles.update();

		// Google/Cesium's terms require crediting the data source when it's on screen.
		if (attributionEl && frame % 30 === 0) {
			attributionEl.textContent = tiles
				.getAttributions()
				.map((a) => a.value)
				.filter(Boolean)
				.join(' · ');
		}

		const groundSample = (x: number, z: number) => sampleGroundHeight(tiles, x, z, 0);
		operators.forEach((operator) => operator.tick(delta, groundSample));

		// the drone always looks at (and flies its figure-eight centered on) the
		// operators' true center, wherever they wander
		operatorsCentroid.set(0, 0, 0);
		operators.forEach((operator) => operatorsCentroid.add(operator.position));
		operatorsCentroid.divideScalar(operators.length);

		app.render(delta, operatorsCentroid);
	}

	animate();

	// Tears everything cinematic-mode-specific down so the path editor (or a
	// fresh cinematic run) can take over the page cleanly.
	return function dispose() {
		cancelAnimationFrame(rafId);
		recordBtn.removeEventListener('click', onRecordClick);
		if (recorder.isRecording) recorder.stop();
		recordBtn.classList.remove('recording');
		operators.forEach((operator) => operator.dispose());
		tiles.dispose();
		app.dispose();
	};
}

