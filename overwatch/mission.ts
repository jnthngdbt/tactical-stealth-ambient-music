import type { Checkpoint } from './objects/operator.ts';
import * as CONST from './constants.ts';

// Per-operator patrol path, expressed as metre offsets (east, north) from the
// SITE_LAT/SITE_LON origin in constants.ts, walked in order and ping-ponged
// back and forth once the end is reached. There's exactly one operator per
// entry here (the first checkpoint doubles as its spawn point) — add entries
// in the path editor (see pathEditor.ts) rather than by hand: as long as any
// entry has fewer than 2 checkpoints, the app runs in path-editing mode
// instead of the normal cinematic view — a top-down, static, obstacle-
// friendly view for placing checkpoints. Its "Copy paths" button copies the
// contents of this array (one `[...]` per operator) ready to paste between
// the brackets below.
export const TRAJECTORIES: Checkpoint[][] = [
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
	[
		{ east: -47.4, north: 10.7 },
		{ east: -39.9, north: 16.9 },
		{ east: -26.7, north: 17.1 },
		{ east: -16.5, north: 17.0 },
		{ east: -12.4, north: 33.7 },
		{ east: -1.5, north: 45.6 },
		{ east: 4.6, north: 51.5 },
		{ east: 17.5, north: 53.6 },
		{ east: 30.0, north: 61.5 },
		{ east: 36.8, north: 71.7 },
		{ east: 51.1, north: 70.3 },
		{ east: 104.8, north: 71.6 },
		{ east: 133.1, north: 85.8 },
		{ east: 159.8, north: 96.6 },
		{ east: 190.3, north: 113.7 },
		{ east: 204.4, north: 121.0 },
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

