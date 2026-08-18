import type { Checkpoint } from './objects/operator.ts';
import * as CONST from './constants.ts';

// Per-operator patrol path, expressed as metre offsets (east, north) from the
// SITE_LAT/SITE_LON origin in constants.ts, walked in order and ping-ponged
// back and forth once the end is reached. There's exactly one operator per
// entry here (the first checkpoint doubles as its spawn point) — add entries
// in the path editor (see pathEditor.ts) rather than by hand: as long as any
// entry has fewer than 2 checkpoints, the app runs in path-editing mode
// instead of the normal cinematic view — a top-down, static, obstacle-
// friendly view for placing checkpoints. Its "copy" buttons produce
// ready-to-paste arrays for this file.
export const TRAJECTORIES: Checkpoint[][] = [
	[
		{ east: -48.3, north: 8.8 },
		{ east: -37.9, north: 15.4 },
		{ east: -36.1, north: 20.8 },
		{ east: -31.4, north: 21.9 },
		{ east: -21.9, north: 16.3 },
		{ east: -11.0, north: 7.7 },
		{ east: -3.7, north: -3.9 },
		{ east: 6.6, north: -10.4 },
		{ east: 18.3, north: -13.6 },
		{ east: 35.7, north: -9.7 },
		{ east: 49.0, north: 4.9 },
		{ east: 70.2, north: 3.8 },
		{ east: 83.1, north: 6.5 },
		{ east: 89.4, north: 23.5 },
		{ east: 84.2, north: 39.1 },
		{ east: 101.3, north: 51.2 },
		{ east: 107.8, north: 60.9 },
		{ east: 107.3, north: 77.0 },
		{ east: 119.0, north: 87.3 },
		{ east: 163.9, north: 97.6 },
		{ east: 205.7, north: 121.8 },
	],
	[
		{ east: -48.9, north: 15.1 },
		{ east: -34.1, north: 27.5 },
		{ east: -28.9, north: 32.3 },
		{ east: -11.5, north: 33.7 },
		{ east: -4.6, north: 41.4 },
		{ east: 5.4, north: 49.8 },
		{ east: 28.2, north: 51.2 },
		{ east: 55.9, north: 62.5 },
		{ east: 71.4, north: 61.8 },
		{ east: 93.3, north: 70.4 },
		{ east: 116.3, north: 87.9 },
		{ east: 166.5, north: 115.8 },
		{ east: 199.7, north: 120.1 },
	],
];

// At least one operator with a real (2+ checkpoint) path is required before
// cinematic mode can run — an empty TRAJECTORIES would otherwise vacuously
// pass `.every(...)` with zero operators to show.
export const PATHS_READY = TRAJECTORIES.length > 0 && TRAJECTORIES.every((path) => path.length >= 2);

// There's exactly one operator per TRAJECTORIES entry — trim/extend the
// array above to change how many operators appear. Each gets a random,
// unique-while-possible callsign from CONST.OPERATOR_NAME_POOL.
function pickOperatorNames(count: number): string[] {
	const shuffled = [...CONST.OPERATOR_NAME_POOL];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return Array.from({ length: count }, (_, i) => shuffled[i % shuffled.length]);
}

export const OPERATOR_NAMES = pickOperatorNames(TRAJECTORIES.length);

