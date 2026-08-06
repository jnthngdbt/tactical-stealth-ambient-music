import * as THREE from 'three';

// Mission data: the compound layout and the sequence of objectives the
// camera flies through. This is the single source of truth for the whole
// briefing — the scene, the timeline and the HUD are all derived from it.

export interface BuildingDef {
	label: string;
	position: [number, number]; // ground [x, z]
	size: [number, number, number]; // [width, height, depth]
}

export interface ObjectiveDef {
	code: string;
	title: string;
	description: string;
	buildingIndex: number; // index into BUILDINGS this objective targets
	target: THREE.Vector3; // point the camera looks at while on this objective
	camPos: THREE.Vector3; // camera position for the close-up shot
}

export const BUILDINGS: BuildingDef[] = [
	{ label: 'Gatehouse', position: [-55, -50], size: [9, 7, 9] },
	{ label: 'Barracks', position: [-25, -55], size: [26, 9, 14] },
	{ label: 'Comms Tower', position: [40, -30], size: [9, 26, 9] },
	{ label: 'Command', position: [0, 0], size: [34, 12, 24] },
	{ label: 'Armory', position: [-45, 25], size: [15, 8, 12] },
	{ label: 'LZ Pad', position: [50, 45], size: [18, 0.6, 18] },
];

function target(buildingIndex: number, height: number): THREE.Vector3 {
	const [x, z] = BUILDINGS[buildingIndex].position;
	return new THREE.Vector3(x, height, z);
}

export const OBJECTIVES: ObjectiveDef[] = [
	{
		code: 'OBJ-01',
		title: 'BREACH PERIMETER',
		description: 'Slip past the gatehouse sensors and breach the outer perimeter undetected.',
		buildingIndex: 0,
		target: target(0, 4),
		camPos: new THREE.Vector3(-78, 24, -18),
	},
	{
		code: 'OBJ-02',
		title: 'CUT COMMUNICATIONS',
		description: "Silence the relay tower to blind the garrison's response.",
		buildingIndex: 2,
		target: target(2, 14),
		camPos: new THREE.Vector3(66, 34, -56),
	},
	{
		code: 'OBJ-03',
		title: 'EXTRACT INTEL',
		description: "Infiltrate command and copy the mainframe's classified archive.",
		buildingIndex: 3,
		target: target(3, 6),
		camPos: new THREE.Vector3(30, 20, 40),
	},
	{
		code: 'OBJ-04',
		title: 'RIG DEMOLITIONS',
		description: 'Plant charges in the armory ahead of departure.',
		buildingIndex: 4,
		target: target(4, 4),
		camPos: new THREE.Vector3(-70, 18, 52),
	},
	{
		code: 'OBJ-05',
		title: 'EXFILTRATE',
		description: 'Break contact and reach the extraction point before the QRF arrives.',
		buildingIndex: 5,
		target: target(5, 1),
		camPos: new THREE.Vector3(78, 26, 72),
	},
];

// Wide establishing shot used for the intro/outro of the loop.
export const OVERVIEW = {
	pos: new THREE.Vector3(0, 100, 125),
	lookAt: new THREE.Vector3(0, 0, -5),
};

export const TIMING = {
	intro: 6,
	approach: 2.6,
	hold: 4.2,
	outro: 5,
	introOrbitAmplitude: 0.16, // radians
	holdOrbitAmplitude: 0.12, // radians
};

export const COMPOUND_CENTER = new THREE.Vector2(0, 0);
export const COMPOUND_RADIUS = 150;
