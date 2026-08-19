import type { Checkpoint } from './objects/operator.ts';

// Optional URL query-string overrides so a whole mission (Ion token, site
// location, operator paths) can be described entirely by a shareable link
// instead of editing constants.ts/mission.ts and rebuilding — handy since
// this is a static site (no server to keep a secret in) where the same
// build already ships with whatever key/site/paths were baked in at build
// time. Consumed once here, then imported by constants.ts/mission.ts so
// nothing else needs to know these can come from the URL.
//
// Supported params: `token` (Cesium Ion token), `lat`/`lon` (site origin),
// `paths` (operator trajectories, see parseTrajectories below). All are
// optional — anything not present in the URL falls back to the existing
// constants.ts/mission.ts defaults. If/when a single encrypted `data` param
// replaces these, only this file needs to change.
const params = new URLSearchParams(window.location.search);

function parseNumber(raw: string | null): number | null {
	if (raw === null) return null;
	const value = Number(raw);
	return Number.isFinite(value) ? value : null;
}

// Compact encoding: an array of paths, each an array of [east, north] pairs
// — e.g. `[[[-48.9,15.1],[-43.6,25.4]],[...]]` — considerably shorter in a
// URL than the equivalent array of `{east, north}` objects.
function parseTrajectories(raw: string | null): Checkpoint[][] | null {
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return null;
		return parsed.map((path: unknown) => {
			if (!Array.isArray(path)) return [];
			return path
				.filter((point): point is [number, number] => Array.isArray(point) && point.length === 2)
				.map(([east, north]) => ({ east: Number(east), north: Number(north) }));
		});
	} catch {
		return null;
	}
}

export const URL_CESIUM_ION_TOKEN = params.get('token');
export const URL_SITE_LAT = parseNumber(params.get('lat'));
export const URL_SITE_LON = parseNumber(params.get('lon'));
export const URL_TRAJECTORIES = parseTrajectories(params.get('paths'));

// Inverse of parseTrajectories, used by the path editor's "Save" button to
// build a shareable mission link out of the token/site/paths currently in
// effect.
export function buildMissionUrl(token: string, lat: number, lon: number, trajectories: Checkpoint[][]): string {
	const url = new URL(window.location.href);
	const query = new URLSearchParams();
	if (token) query.set('token', token);
	query.set('lat', String(lat));
	query.set('lon', String(lon));
	query.set('paths', JSON.stringify(trajectories.map((path) => path.map((cp) => [cp.east, cp.north]))));
	url.search = query.toString();
	return url.toString();
}
