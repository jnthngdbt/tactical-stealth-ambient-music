import * as THREE from 'three';
import { App } from './app.ts';
import { Timeline } from './timeline.ts';
import { Hud } from './hud.ts';
import { Recorder } from './recorder.ts';
import { Terrain } from './objects/terrain.ts';
import { Building } from './objects/building.ts';
import { ObjectiveMarker, MarkerState } from './objects/marker.ts';
import { MissionPath } from './objects/path.ts';
import { RadarSweep } from './objects/radarSweep.ts';
import { BUILDINGS, OBJECTIVES, COMPOUND_RADIUS } from './mission.ts';

const app = new App();

app.scene.add(new Terrain());

const radar = new RadarSweep(COMPOUND_RADIUS);
app.scene.add(radar);

const buildings = BUILDINGS.map((def) => {
	const building = new Building(def);
	app.scene.add(building);
	return building;
});

const markers = OBJECTIVES.map((objective) => {
	const marker = new ObjectiveMarker({ position: objective.target });
	app.scene.add(marker);
	return marker;
});

const path = new MissionPath(OBJECTIVES.map((o) => o.target));
app.scene.add(path);

const timeline = new Timeline();
const hud = new Hud();
const recorder = new Recorder(app.renderer.domElement);

// Arm recording on click; the actual capture starts at the next loop
// boundary so the saved video is exactly one clean, seamless cycle.
const recordBtn = document.getElementById('recordBtn') as HTMLButtonElement;
let pendingRecordStart = false;
let recordStopTime: number | null = null;

recordBtn.addEventListener('click', () => {
	if (recorder.isRecording || pendingRecordStart) return;
	pendingRecordStart = true;
	recordBtn.classList.add('armed');
});

const clock = new THREE.Clock();

function animate() {
	requestAnimationFrame(animate);

	const delta = clock.getDelta();
	const raw = clock.elapsedTime;
	const loopT = raw % timeline.totalDuration;

	if (pendingRecordStart && loopT < 0.05) {
		recorder.start();
		pendingRecordStart = false;
		recordStopTime = raw + timeline.totalDuration;
		recordBtn.classList.remove('armed');
		recordBtn.classList.add('recording');
	}
	if (recordStopTime !== null && raw >= recordStopTime) {
		recorder.stop();
		recordStopTime = null;
		recordBtn.classList.remove('recording');
	}

	const state = timeline.evaluate(raw);

	app.camera.position.copy(state.camPos);
	app.camera.lookAt(state.camLookAt);

	buildings.forEach((building, i) => {
		const objectiveIndex = OBJECTIVES.findIndex((o) => o.buildingIndex === i);
		building.setActive(objectiveIndex >= 0 && state.activeObjective === objectiveIndex);
		building.tick(delta);
	});

	const pulse = 0.5 + 0.5 * Math.sin(raw * 3.2);
	markers.forEach((marker, i) => {
		const markerState: MarkerState = state.pathProgress >= i + 1 ? 'done' : state.activeObjective === i ? 'active' : 'pending';
		marker.update(markerState, pulse, delta);
	});

	path.setProgress(state.pathProgress);
	radar.update(raw);

	hud.update(state);

	app.render();
}

animate();
