import { URL_FLIGHT_ALTITUDE, URL_HUD_OPACITY, URL_SITE_LAT, URL_SITE_LON, URL_VIBE } from './urlParams.ts';

// Palette — same tactical language as the other pages (dark, cold cyan accent),
// pushed further into a cool "night overwatch" grade applied on top of the
// (daylight-captured) photorealistic tiles by NightGradingPass.
//
// The overall "vibe" (background/terrain/night-tint palette) is a named
// preset rather than loose standalone constants, so more can be added later
// without redefining every color individually. Selected via `?vibe=` (see
// urlParams.ts) — `moonlit` picks VIBE_PRESETS.moonlit, anything else
// (including no param at all) falls back to `cinematic`, the original look.
// Exported (along with resolveVibeName) so the path editor can also switch
// between presets live (Alt+1/2, see pathEditor.ts) instead of only at load.
export interface VibePreset {
	backgroundColor: number;
	terrainDimColor: number;
	nightTint: number;
	nightSaturation: number;
	nightVignette: number;
}

export const VIBE_PRESETS = {
	cinematic: {
		backgroundColor: 0x03060a,
		terrainDimColor: 0x6d7e89,
		nightTint: 0x1c3a4a,
		nightSaturation: 0.5,
		nightVignette: 0.7,
	},
	moonlit: {
		backgroundColor: 0x040711,
		terrainDimColor: 0x657798,
		nightTint: 0x1e305e, // blue moonlight tint, split between a straight blue push and a fully desaturated grey-blue
		nightSaturation: 0.58,
		nightVignette: 0.8, // heavier edge darkening — sells a moonlit spotlight-in-the-dark read more than cinematic's
	},
} satisfies Record<string, VibePreset>;

export type VibeName = keyof typeof VIBE_PRESETS;

export function resolveVibeName(raw: string | null): VibeName {
	return raw !== null && raw in VIBE_PRESETS ? (raw as VibeName) : 'cinematic';
}

export const VIBE_NAME = resolveVibeName(URL_VIBE);
const vibe: VibePreset = VIBE_PRESETS[VIBE_NAME];

export const BACKGROUND_COLOR = vibe.backgroundColor;

export const OPERATOR_COLOR = 0x35f0d0;

// The tiles' own texture is a full-brightness daylight photo. Multiplying it
// by this dark, cool tint (via the unlit material's color) dims it directly
// at the source, before bloom/grading ever see it, instead of only faking
// night in post — that's what was washing the whole scene out white.
// (Tune this + NIGHT_EXPOSURE together — they compound.)
export const TERRAIN_DIM_COLOR = vibe.terrainDimColor;

// Night grading — simulates night over imagery that was actually captured in daylight.
export const NIGHT_EXPOSURE = 1; // additional darkening applied on top of TERRAIN_DIM_COLOR
export const NIGHT_TINT = vibe.nightTint;
export const NIGHT_SATURATION = vibe.nightSaturation;
export const NIGHT_VIGNETTE = vibe.nightVignette;

// Bloom threshold is set high so only the glowing operators (and their
// halos), which are much brighter than the dimmed night terrain, pick up
// bloom — a low threshold here made the whole scene bloom into a white haze.
export const BLOOM_STRENGTH = 0.9;
export const BLOOM_RADIUS = 0.45;
export const BLOOM_THRESHOLD = 0.7;

// A subtle wireframe overlay traced directly over each tile's real mesh
// triangles (see tiles.ts's load-model handler), sitting on top of the
// texture rather than replacing it. Sells the "drone's low-res 3D
// reconstruction" read (photogrammetry/LIDAR mesh feel) instead of the scene
// looking like plain photographic/game footage. Kept faint (low opacity, no
// bloom contribution) since it's meant to be noticed on close inspection, not
// dominate the shot.
export const TERRAIN_WIREFRAME_COLOR = 0x35f0d0; // same cyan accent as the operators, ties it to the tactical HUD language
export const TERRAIN_WIREFRAME_OPACITY = 0; // 0 disables the wireframe entirely, which is a bit cleaner for cinematic mode

// Site location — change these to point the scene at any real-world coordinates
// that have Photorealistic 3D Tiles coverage. Default is Battery Park, NYC,
// chosen for its dense mix of streets, trees and buildings. Overridable via
// `?coord=lat,lon` URL query param (see urlParams.ts).
export const SITE_LAT = URL_SITE_LAT ?? 40.7033;
export const SITE_LON = URL_SITE_LON ?? -74.017;

// Tiles data source. The Cesium Ion asset below is a copy of Google's
// Photorealistic 3D Tiles that Cesium exposes to every (free) Ion account by
// default, so it only needs a Cesium Ion access token to get started. Set
// VITE_GOOGLE_MAPS_API_KEY instead to stream tiles directly from Google Maps
// Platform (Map Tiles API) if you'd rather manage billing/quotas yourself.
// Always baked in at build time (.env.local locally, the `github-pages`
// environment secret in CI) — never carried in the URL, so it's never
// exposed by a shared mission link.
export const CESIUM_ION_TOKEN = import.meta.env.VITE_ION_KEY ?? '';
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
export const GOOGLE_PHOTOREALISTIC_ION_ASSET_ID = '2275207';

// 3d-tiles-renderer picks tile detail (screen-space error) from the actual
// renderer/window size — shrinking the browser window (e.g. to record a
// smaller video) makes it stream in visibly lower-detail tiles, which then
// look blurry/blocky when that recording is later watched full-screen. Tile
// resolution is floored to at least this size (see tiles.ts's
// updateTilesResolution) so detail never drops below a "looks good full-
// screen" baseline regardless of how small the window actually is; an
// already-bigger window still gets to use its real (higher) resolution.
// Set to a 4K floor since the user wants maximum quality regardless of the
// extra tile downloads/GPU memory that costs.
export const TILE_LOD_MIN_WIDTH = 3840;
export const TILE_LOD_MIN_HEIGHT = 2160;

// Lower = tiles refine until the geometric error projected on screen is
// smaller, i.e. more detail. GoogleCloudAuthPlugin's "recommended settings"
// otherwise force this up to 20 (tuned for efficiency, not quality) — createTiles
// overrides it unconditionally after registering plugins so both tile sources
// get the same, deliberately aggressive, max-quality target.
export const TILE_ERROR_TARGET = 4;

// Operator movement — a steady constant walking pace for every operator.
// Movement is a continuous steering model (heading is always a unit vector
// scaled by speed).
export const OPERATOR_SPEED = 1.0; // m/s, walking pace
export const OPERATOR_TURN_RATE = 0.5; // radians/s, how fast heading (and so both facing and walked path) eases into a new leg's direction

// The operator just walks its checkpoints in order, reversing direction
// once it reaches either end (a ping-pong loop). Operators never stop moving
// along their path.
export const PATH_ARRIVAL_RADIUS = 1.2; // metres from a checkpoint counted as "arrived"

// Ctrl+scroll in cinematic mode (main.ts) teleports every operator to the
// next/previous checkpoint instead of walking there. Standard mouse wheels
// report deltaY in chunks of ~100 per notch; trackpads emit many small
// continuous deltas — accumulating until this threshold is crossed makes
// both feel like one deliberate "step" per checkpoint instead of skipping
// several at once on a single scroll gesture.
export const CHECKPOINT_SCRUB_THRESHOLD = 80;

// Operator visual: a dark, matte silhouette ("there's really someone there")
// rather than a glowing dot, tagged with a bright tactical reticle so it still
// reads clearly against the night terrain.
export const OPERATOR_BODY_COLOR = 0x05070a; // near-black, stays dark regardless of the night grade

// Body + head are two overlapping, non-uniformly scaled spheres rather than
// one perfect sphere, so the silhouette reads as a crouching figure instead
// of a geometric blob.
export const OPERATOR_BODY_RADIUS = 0.34;
export const OPERATOR_BODY_WIDTH_SCALE = 0.5; // flattens the torso side-to-side
export const OPERATOR_BODY_HEIGHT_SCALE = 1.2; // stretches it taller than wide
export const OPERATOR_BODY_DEPTH_SCALE = 0.5; // flattens it front-to-back, like a hunched crouch
export const OPERATOR_HEAD_RADIUS = 0.17;

// Two "leg" spheres (same idea as the head) sitting under the torso, sunk
// deep enough into it (OPERATOR_LEG_OVERLAP) to read as legs growing out of
// the body rather than floating balls, alternately stepping forward/back in
// sync with the current walk speed (see updateLegSwing).
export const OPERATOR_LEG_RADIUS = 0.12;
export const OPERATOR_LEG_OVERLAP = 0.6; // fraction of the two radii' sum buried inside the body
export const OPERATOR_LEG_SPREAD = 0.08; // metres, left/right stance offset from centre
export const OPERATOR_LEG_SWING_RATE = 9; // how fast the stride phase advances per metre walked
export const OPERATOR_LEG_SWING_DISTANCE = 0.16; // metres, forward/back stride amplitude along the heading

// A simple rifle silhouette, held so it always points toward the operator's
// current direction of travel (see Operator.updateRifleFacing) rather than a
// fixed heading, since operators otherwise never rotate to face their path.
export const OPERATOR_RIFLE_BARREL_LENGTH = 0.55; // metres
export const OPERATOR_RIFLE_BARREL_RADIUS = 0.035; // metres
export const OPERATOR_RIFLE_STOCK_LENGTH = 0.22; // metres
export const OPERATOR_RIFLE_STOCK_HEIGHT = 0.06; // metres
export const OPERATOR_RIFLE_STOCK_WIDTH = 0.08; // metres
export const OPERATOR_RIFLE_HEIGHT_SCALE = 0.9; // fraction of the body's top height where the rifle sits (chest)
export const OPERATOR_RIFLE_FORWARD_OFFSET = 0.18; // metres, shifts the whole rifle forward so it reads as held out front rather than centred in the chest

// Subtle idle bob/sway applied to the head every frame, independent of the
// leg swing, so the operator never reads as a frozen statue.
export const OPERATOR_IDLE_SWAY_SPEED = 1.6; // radians/sec
export const OPERATOR_IDLE_SWAY_AMOUNT = 0.035; // metres, peak offset

// Forward lean into the current heading, so the operator reads as a
// purposeful crouched jog rather than an upright glide. The head is a
// perfect sphere, so rotating it is visually a no-op — instead the BODY
// (a non-uniformly scaled ellipsoid, so its rotation IS visible) is tilted by
// this angle, and the head is translated forward/down to follow along, on
// top of the existing idle sway.
export const OPERATOR_HEAD_TILT_ANGLE = 0.35; // radians, body forward pitch
export const OPERATOR_HEAD_TILT_LEAN = 0.22; // metres, head shifts forward along the heading
export const OPERATOR_HEAD_TILT_DROP = 0.11; // metres, head dips down to match the lean

// Kept semi-transparent (rather than fully opaque) to soften the silhouette's
// contrast against the terrain — a fixed opacity, no pulsing.
export const OPERATOR_BODY_OPACITY_BASE = 0.9;

// Soft billboard sprite behind the body/head that feathers their otherwise
// hard sphere edge (see getHaloTexture in operator.ts) — a cheap stand-in
// for a real blur pass.
export const OPERATOR_HALO_SIZE = 1.0; // metres, camera-facing sprite size
export const OPERATOR_HALO_OPACITY = 0.7;

export const OPERATOR_SHADOW_RADIUS = 0.5; // soft dark ground decal that grounds the body visually
export const OPERATOR_RETICLE_SIZE = 1.05; // half-size of the square tactical bracket around the body
export const OPERATOR_RETICLE_CORNER = 0.5; // length of each bracket corner segment

// Drone-feed ID tag: a diagonal leader line from the operator's head out to
// the floating callsign label, both pinned to the head apex with fixed
// screen-space pixel offsets so the tag always keeps the same length/angle
// on screen no matter how the camera is oriented. The label is plain DOM
// (CSS2DObject); the line is a real WebGL THREE.Line whose endpoints are
// re-projected onto these same fixed pixels every frame (see
// Operator.updateLeaderLine) rather than a static 3D segment, which would
// otherwise swing with the view — this keeps its crisp, bloom-lit look.
export const LABEL_ANCHOR_HEIGHT = 1.0; // metres, roughly the head's apex
export const LABEL_LINE_LENGTH_PX = 46; // px, fixed screen-space distance from operator to label
export const LABEL_LINE_ANGLE_DEG = 40; // degrees above horizontal, fixed screen-space angle
export const LABEL_LINE_GAP_START_PX = 6; // px, gap left between the operator and the line
export const LABEL_LINE_GAP_END_PX = 6; // px, gap left between the line and the label

// Ground clamping — periodically raycasts down onto the streaming tiles so
// operators stay pinned to the (progressively loading) street/terrain surface.
// Raycast origin must sit above the real terrain height (measured above the
// WGS84 ellipsoid post-ReorientationPlugin) for any site, not just low-lying
// ones — a high-elevation site (e.g. ~600-1000m ASL) would otherwise start
// the downward ray below the actual ground and never hit it at all.
export const GROUND_RAYCAST_HEIGHT = 9500;
export const GROUND_SAMPLE_INTERVAL = 0.25; // seconds between probes, staggered per operator

// Any raycast hit outside this range (metres, relative to the site origin) is
// rejected as bogus rather than trusted — partially-loaded/placeholder tile
// geometry can occasionally return a wildly wrong hit (e.g. thousands of
// metres below ground), which would otherwise get baked in as a "real"
// ground sample and drag an operator (and the camera following it) miles away.
// Bounds are set to cover real-world terrain elevation extremes (Dead Sea
// shore ~-430m to Everest ~8849m) rather than assuming a near-sea-level site,
// while still comfortably rejecting the thousands-of-metres-off garbage hits
// this check exists to catch.
export const GROUND_SAMPLE_PLAUSIBLE_MIN = -500;
export const GROUND_SAMPLE_PLAUSIBLE_MAX = 9000;

// Height changes between ground samples (terrain slopes, curbs, etc.) are
// eased into at this rate instead of snapped, so they read as a climb.
export const OPERATOR_VERTICAL_SPEED = 2.5; // m/s max climb/descend rate

// A ground-sample gap bigger than this (metres) is treated as a bad coarse/
// partially-refined tile reading self-correcting, not real terrain, and is
// snapped instantly instead of eased at OPERATOR_VERTICAL_SPEED — otherwise a
// multi-thousand-metre initial misread (see GROUND_SAMPLE_PLAUSIBLE_MIN/MAX's
// wide Earth-covering bounds) would crawl toward the truth for real minutes.
export const OPERATOR_ALTITUDE_SNAP_THRESHOLD = 20;

// Added on top of the sampled/interpolated ground altitude so the operator's
// feet never clip into the mesh (e.g. a slightly stale sample on a slope).
export const OPERATOR_GROUND_OFFSET = 1.5; // metres above the ground surface

// Camera
export const CAMERA_FOV = 50;
export const CAMERA_NEAR = 0.5;
export const CAMERA_FAR = 8000;
export const CAMERA_MAX_DISTANCE = 1200; // metres, OrbitControls zoom-out limit

// Ground-height discovery at startup (see main.ts's siteGroundPlaced retry
// loop): the camera's fixed startup framing assumes ground is near y=0 (i.e.
// near sea level). That's true for most sites and converges in well under a
// second, but at a real-world elevation far from 0 (e.g. Las Vegas, ~600m
// ASL) the camera starts out literally embedded in/below the terrain, tilted
// to look level-or-down — its view frustum then never actually reaches the
// real ground sitting hundreds of metres above it, so no tiles ever stream
// in there and the ground height can never be sampled (a deadlock). If no
// sample succeeds after CAMERA_ELEVATION_GUESS_RETRY_SECONDS, the camera is
// walked up through these guessed baseline elevations (added to its normal
// framing, same shape/angle each time) until one guess finally sits above
// the real ground and breaks the deadlock. Kept at 0 first so the common
// near-sea-level case is unaffected/still fast.
export const CAMERA_ELEVATION_GUESSES = [0, 800, 2000, 5000, 9000];
export const CAMERA_ELEVATION_GUESS_RETRY_SECONDS = 3;

// Slow autonomous "helicopter" drift: the camera position glides along a
// lazy figure-eight centered on the operators' group (at a fixed hover
// altitude above them), while the orbit target always tracks the operators
// directly (see CAMERA_LOOKAT_EASE below) and OrbitControls dragging/zooming
// still works on top of both. The whole figure-eight is shifted sideways by
// FLIGHT_DRIFT_SIDE_OFFSET (see updateDrift) so it never swings back through
// the centroid — the drone always views the operators at an angle, never
// straight down from directly overhead.
export const FLIGHT_DRIFT_SPEED = 0.05; // radians/sec of the underlying Lissajous path
export const FLIGHT_DRIFT_RADIUS_X = 20; // metres
export const FLIGHT_DRIFT_RADIUS_Z = 20; // metres
export const FLIGHT_DRIFT_SIDE_OFFSET = 50; // metres, minimum lateral distance kept from the centroid
export const FLIGHT_DRIFT_HEIGHT = 8; // metres of slow vertical bob
// Overridable via `?alt=<metres>` URL query param (see urlParams.ts).
export const CAMERA_DRIFT_ALTITUDE = URL_FLIGHT_ALTITUDE ?? 60; // metres, fixed hover height above the operators' centroid

// Caps how far the camera is allowed to jump in a single frame while
// following the anchor above (e.g. if an operator's altitude snaps once
// tiles finish streaming in) — any excess is carried over and caught up on
// following frames instead of teleporting the camera off into empty space.
export const CAMERA_DRIFT_MAX_STEP = 1.5; // metres per frame

// How quickly the orbit target eases toward the true centroid of the
// operators (rather than snapping straight to it every frame).
export const CAMERA_LOOKAT_EASE = 1.5;

// Overall opacity of the entire HUD overlay (#hud in index.html — vignette,
// scanlines, corners, header, telemetry, everything), applied once at
// startup in main.ts. 1 = fully opaque, 0 = fully invisible.
// Overridable via `?hud=<0-1>` URL query param (see urlParams.ts).
export const HUD_OPACITY = URL_HUD_OPACITY ?? 0.5;

// Callsign pool one is randomly assigned from, per trajectory, in mission.ts
// (see OPERATOR_NAMES there) — shared by the cinematic view and path editor.
export const OPERATOR_NAME_POOL = ['Mitchell', 'Clark', 'Chavez', 'Ramirez', 'Johnston', 'Diaz', 'Price', 'Loiselle'];

// Path editor (pathEditor.ts) — active whenever mission.ts's TRAJECTORIES has
// any operator with no checkpoints at all. Starts in a straight-down
// orthographic view (no drift, no operator movement) with the same
// bloom/night-grade render pipeline as cinematic mode; Ctrl+left-drag orbits
// freely from there (see the EDIT_ORBIT_* tuning below).
export const EDIT_CAMERA_HEIGHT = 220; // metres, straight above the operators' centroid
export const EDIT_VIEW_HALF_SIZE = 70; // metres, half the visible height at zoom 1
export const EDIT_MARKER_RADIUS = 0.6; // metres, flat disc drawn at each checkpoint
export const EDIT_MARKER_START_RADIUS = 0.95; // metres, first checkpoint of a path drawn bigger
export const EDIT_MARKER_HEIGHT = 0.05; // metres above ground, avoids z-fighting with terrain
export const EDIT_LINE_HEIGHT_OFFSET = 2; // metres above ground, keeps the path line drawn above buildings/terrain
export const EDIT_PATH_OPACITY_ACTIVE = 0.95; // selected operator's path/markers
export const EDIT_PATH_OPACITY_INACTIVE = 0.35; // other operators' paths/markers, dimmed for reference
export const EDIT_CLICK_DRAG_THRESHOLD_PX = 6; // pointer movement above this counts as a pan, not a click
export const EDIT_ORBIT_MAX_POLAR_ANGLE = Math.PI / 2 - 0.02; // Ctrl-drag orbit limit, keeps the horizon in frame like cinematic mode
