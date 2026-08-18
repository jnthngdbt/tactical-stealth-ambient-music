import * as THREE from 'three';
import { App } from './app.ts';
import { createTiles, sampleGroundHeight, localToEnu } from './tiles.ts';
import { Operator } from './objects/operator.ts';
import { Recorder } from '../objectives/recorder.ts';
import { SPAWN_POINTS } from './mission.ts';
import * as CONST from './constants.ts';

const app = new App();

const { tiles } = createTiles(app.camera, app.renderer);
app.scene.add(tiles.group);

const OPERATOR_NAMES = ['Mitchell', 'Ramirez', 'Chavez', 'Clark'];

const operators = SPAWN_POINTS.map((spawnPoint, i) => {
	const color = i % 2 === 0 ? CONST.OPERATOR_COLOR : CONST.OPERATOR_ALT_COLOR;
	const operator = new Operator(spawnPoint, OPERATOR_NAMES[i % OPERATOR_NAMES.length], color);
	app.scene.add(operator);
	return operator;
});

const coordsEl = document.getElementById('hudCoords');
if (coordsEl) coordsEl.textContent = `${CONST.SITE_LAT.toFixed(5)}, ${CONST.SITE_LON.toFixed(5)}`;

const recorder = new Recorder(app.renderer.domElement);
const recordBtn = document.getElementById('recordBtn') as HTMLButtonElement;
recordBtn.addEventListener('click', () => {
	if (recorder.isRecording) recorder.stop();
	else recorder.start();
	recordBtn.classList.toggle('recording', recorder.isRecording);
});

const attributionEl = document.getElementById('hudAttribution');

// The raw tile mesh has no road/building semantics, so spawn points can't be
// placed automatically — double-click any point on the ground to log a
// ready-to-paste `{ east, north }` spawn point (also copied to the
// clipboard), so SPAWN_POINTS in mission.ts can be tuned to real streets.
const pickRaycaster = new THREE.Raycaster();
app.renderer.domElement.addEventListener('dblclick', (event) => {
	const rect = app.renderer.domElement.getBoundingClientRect();
	const ndc = new THREE.Vector2(
		((event.clientX - rect.left) / rect.width) * 2 - 1,
		-((event.clientY - rect.top) / rect.height) * 2 + 1,
	);
	pickRaycaster.setFromCamera(ndc, app.camera);
	const hit = pickRaycaster.intersectObject(tiles.group, true)[0];
	if (!hit) return;

	const { east, north } = localToEnu(hit.point.x, hit.point.z);
	const snippet = `{ east: ${east.toFixed(1)}, north: ${north.toFixed(1)} },`;
	console.log('[overwatch] spawn point at click:', snippet);
	navigator.clipboard?.writeText(snippet).catch(() => { });
});

const clock = new THREE.Clock();
let frame = 0;

function animate() {
	requestAnimationFrame(animate);
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

	app.render(delta);
}

animate();
