// Ctrl+V (Cmd+V on macOS) with a Google Maps link on the clipboard jumps the
// drone view to that location: the link's latitude/longitude become the
// `coord` URL param (see urlParams.ts) and the page reloads there. Installed
// by entry.ts, so it works on the gallery page as well as in the 3D scene.
//
// Uses the `paste` event rather than navigator.clipboard.readText(), so the
// browser never shows a clipboard-permission prompt.

export interface LatLon {
	lat: number;
	lon: number;
}

function toLatLon(latRaw: string, lonRaw: string): LatLon | null {
	const lat = Number(latRaw);
	const lon = Number(lonRaw);
	if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
	if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
	return { lat, lon };
}

const NUM = '(-?\\d+(?:\\.\\d+)?)';
// Exact pin of a selected place, inside the `data=` blob: `!3d<lat>!4d<lon>`.
const PIN_RE = new RegExp(`!3d${NUM}!4d${NUM}`);
// Viewport centre in the path: `/@<lat>,<lon>,<zoom|altitude>...`.
const AT_RE = new RegExp(`@${NUM},${NUM}`);
// A bare `lat,lon` pair, e.g. a `?q=` value or what Google Maps copies on
// right-click ("36.15206, -5.44324").
const PAIR_RE = new RegExp(`^\\s*${NUM}\\s*,\\s*${NUM}\\s*$`);

// Extracts coordinates from a Google Maps URL, or from plain `lat, lon` text.
// Returns null for anything else, including short links
// (maps.app.goo.gl/...), which only resolve server-side.
export function parseGoogleMapsCoords(text: string): LatLon | null {
	const trimmed = text.trim();

	const pair = trimmed.match(PAIR_RE);
	if (pair) return toLatLon(pair[1], pair[2]);

	let url: URL;
	try {
		url = new URL(trimmed);
	} catch {
		return null;
	}
	if (!/(^|\.)google\.[a-z.]+$/.test(url.hostname) && url.hostname !== 'maps.google.com') return null;

	let decoded: string;
	try {
		decoded = decodeURIComponent(url.pathname + url.hash);
	} catch {
		decoded = url.pathname + url.hash;
	}

	// Prefer the place's own pin over the viewport centre when both exist.
	const pin = decoded.match(PIN_RE);
	if (pin) {
		const coords = toLatLon(pin[1], pin[2]);
		if (coords) return coords;
	}

	const at = decoded.match(AT_RE);
	if (at) {
		const coords = toLatLon(at[1], at[2]);
		if (coords) return coords;
	}

	// Query-string forms: ?q=, ?ll=, and the Maps URLs API's ?query=, ?center=.
	for (const key of ['q', 'query', 'll', 'center', 'destination']) {
		const value = url.searchParams.get(key);
		const match = value?.match(PAIR_RE);
		if (match) {
			const coords = toLatLon(match[1], match[2]);
			if (coords) return coords;
		}
	}

	// Coordinates as a path segment, e.g. /maps/search/36.15,+-5.44 or /maps/place/36.15,-5.44.
	for (const segment of decoded.split('/')) {
		const match = segment.replace(/\+/g, ' ').match(PAIR_RE);
		if (match) {
			const coords = toLatLon(match[1], match[2]);
			if (coords) return coords;
		}
	}

	return null;
}

// Moving to a new site keeps the look (vibe, HUD opacity, altitude, callsigns)
// but drops everything tied to the old site: operator paths and the map
// bearing are in metres/degrees relative to the old origin, and groundY is
// the old site's elevation. With no paths, main.ts opens the path editor.
export function buildRelocatedUrl(coords: LatLon): string {
	const url = new URL(window.location.href);
	const query = new URLSearchParams(url.search);
	for (const key of ['paths', 'rotation', 'groundY']) query.delete(key);
	query.set('coord', `${coords.lat},${coords.lon}`);
	url.search = query.toString();
	return url.toString();
}

function showToast(message: string) {
	const toast = document.createElement('div');
	toast.className = 'geo-paste-toast';
	toast.textContent = message;
	document.body.appendChild(toast);
	setTimeout(() => toast.remove(), 3000);
}

export function installGeoPaste() {
	window.addEventListener('paste', (event) => {
		const target = event.target as HTMLElement | null;
		if (target?.closest('input, textarea, [contenteditable=""], [contenteditable="true"]')) return;

		const text = event.clipboardData?.getData('text/plain') ?? '';
		const coords = parseGoogleMapsCoords(text);
		if (!coords) {
			showToast('Clipboard has no Google Maps coordinates');
			return;
		}
		event.preventDefault();
		window.location.assign(buildRelocatedUrl(coords));
	});
}
