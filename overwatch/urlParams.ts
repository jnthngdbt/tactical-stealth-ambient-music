import type { Checkpoint } from './objects/operator.ts';

// Optional URL query-string overrides so a mission (site location, operator
// paths) can be described entirely by a shareable link instead of editing
// constants.ts/mission.ts and rebuilding. The Cesium Ion token itself is NOT
// carried here — it's baked in at build time (VITE_ION_KEY, see
// constants.ts) instead, so it never appears in a shared link. Consumed once
// here, then imported by constants.ts/mission.ts so nothing else needs to
// know these can come from the URL.
//
// Supported params: `coord` (site origin, as `lat,lon`), `paths` (operator
// trajectories, see parseTrajectories below), `rotation` (map bearing in
// degrees, set via Ctrl-drag in the path editor), `alt` (drone hover altitude
// in metres, see CAMERA_DRIFT_ALTITUDE in constants.ts), `hud` (0-1,
// see HUD_OPACITY in constants.ts). All are optional — anything not present
// in the URL falls back to the existing constants.ts/mission.ts defaults.
const params = new URLSearchParams(window.location.search);

function parseNumber(raw: string | null): number | null {
	if (raw === null) return null;
	const value = Number(raw);
	return Number.isFinite(value) ? value : null;
}

function parseCoord(raw: string | null): { lat: number; lon: number } | null {
	if (!raw) return null;
	const [latRaw, lonRaw] = raw.split(',');
	const lat = parseNumber(latRaw ?? null);
	const lon = parseNumber(lonRaw ?? null);
	if (lat === null || lon === null) return null;
	return { lat, lon };
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

const URL_COORD = parseCoord(params.get('coord'));
export const URL_SITE_LAT = URL_COORD?.lat ?? null;
export const URL_SITE_LON = URL_COORD?.lon ?? null;
export const URL_TRAJECTORIES = parseTrajectories(params.get('paths'));
export const URL_MAP_ROTATION_DEG = parseNumber(params.get('rotation'));
export const URL_FLIGHT_ALTITUDE = parseNumber(params.get('alt'));
export const URL_HUD_OPACITY = parseNumber(params.get('hud'));

// Inverse of parseTrajectories, used by the path editor's "Save" button to
// build a shareable mission link out of the site/paths/map bearing/altitude
// currently in effect.
export function buildMissionUrl(
	lat: number,
	lon: number,
	trajectories: Checkpoint[][],
	rotationDeg: number,
	altitude: number,
	hudOpacity: number,
): string {
	const url = new URL(window.location.href);
	const query = new URLSearchParams();
	query.set('coord', `${lat},${lon}`);
	query.set('rotation', String(rotationDeg));
	query.set('alt', String(altitude));
	query.set('hud', String(hudOpacity));
	query.set('paths', JSON.stringify(trajectories.map((path) => path.map((cp) => [cp.east, cp.north]))));
	url.search = query.toString();
	return url.toString();
}
