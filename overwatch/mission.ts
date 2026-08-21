import type { Checkpoint } from './objects/operator.ts';
import * as CONST from './constants.ts';
import { URL_TRAJECTORIES, URL_OPERATOR_NAMES, URL_MAP_ROTATION_DEG } from './urlParams.ts';

// Per-operator patrol path, expressed as metre offsets (east, north) from the
// SITE_LAT/SITE_LON origin in constants.ts, walked in order and ping-ponged
// back and forth once the end is reached (a single-checkpoint path just
// stands there). There's exactly one operator per entry here (the first
// checkpoint doubles as its spawn point) — add entries in the path editor
// (see pathEditor.ts) rather than by hand: as long as any entry has no
// checkpoints at all, the app runs in path-editing mode instead of the
// normal cinematic view — a top-down, static, obstacle-friendly view for
// placing checkpoints. Its "Save" button builds a mission URL out of this
// data and navigates there instead of editing this array directly.
//
// No default sample mission is baked in here — with no `?paths=` URL param
// this is simply `[]` (zero operators), a fully supported state: cinematic
// mode then just shows the drone hovering over empty terrain under plain
// orbit control (see App.render's `hasOperators` gate in app.ts), no
// automatic flight drift/follow with nothing to center on.
//
// A `?paths=` URL query param (see urlParams.ts) overrides this whole array
// wholesale when present, letting a mission's routes be carried entirely by
// a shareable link instead of a code change.
export const TRAJECTORIES: Checkpoint[][] = URL_TRAJECTORIES ?? [];

// Cinematic mode requires every operator (if any) to have a real (1+
// checkpoint) path — vacuously true for zero operators, since there's then
// nothing left that could be "not ready".
export const PATHS_READY = TRAJECTORIES.every((path) => path.length >= 1);

// Map bearing (degrees, clockwise) set in the path editor by Ctrl-dragging the
// top-down view (see pathEditor.ts) — rotates the drone's cinematic flight
// (offset direction + figure-eight orientation, see App.updateDrift in
// app.ts) to match, without touching any operator/terrain world coordinates.
// Carried through the "Save" mission URL alongside TRAJECTORIES.
export const MAP_ROTATION_DEG = URL_MAP_ROTATION_DEG ?? 0;

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

// Pads `provided` (truncated to `count`, ignoring any superfluous names) up
// to `count` entries by drawing extras from CONST.OPERATOR_NAME_POOL, never
// picking a name already in use (by `provided` or by an already-picked
// extra) — falls back to a plain "OP-n" label if the pool runs out of unused
// names (only possible once operator count exceeds the pool size).
function fillMissingNames(provided: string[], count: number): string[] {
	const names = provided.slice(0, count);
	if (names.length >= count) return names;

	const used = new Set(names);
	const shuffled = CONST.OPERATOR_NAME_POOL.filter((name) => !used.has(name));
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}

	const missing = count - names.length;
	for (let i = 0; i < missing; i++) {
		names.push(shuffled[i] ?? `OP-${names.length + 1}`);
	}
	return names;
}

// A `?names=` URL query param (see urlParams.ts) overrides the random pick
// above with an explicit, comma-separated callsign list — assigned in
// TRAJECTORIES order. Superfluous names (more given than operators) are
// ignored; missing names (fewer given than operators) are filled from
// CONST.OPERATOR_NAME_POOL, never duplicating a name already in use.
export const OPERATOR_NAMES = URL_OPERATOR_NAMES
	? fillMissingNames(URL_OPERATOR_NAMES, TRAJECTORIES.length)
	: pickOperatorNames(TRAJECTORIES.length);

