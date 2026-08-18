import type { SpawnPoint } from './objects/operator.ts';

// Illustrative spawn points, expressed as metre offsets (east, north) from
// the SITE_LAT/SITE_LON origin in constants.ts. Not tied to any real
// street/building layout — once you pick real coordinates, orbit the scene
// (or use the double-click picker in main.ts) and adjust these to spawn
// operators on actual streets.
export const SPAWN_POINTS: SpawnPoint[] = [
	{ east: -18, north: 10 },
	{ east: 22, north: -20 },
	{ east: -30, north: -30 },
];

