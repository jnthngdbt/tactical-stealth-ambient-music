// Palette — same tactical language as the other pages (dark, cold cyan accent),
// pushed further into a cool "night overwatch" grade applied on top of the
// (daylight-captured) photorealistic tiles by NightGradingPass.
export const BACKGROUND_COLOR = 0x03060a;

export const OPERATOR_COLOR = 0x35f0d0;

// The tiles' own texture is a full-brightness daylight photo. Multiplying it
// by this dark, cool tint (via the unlit material's color) dims it directly
// at the source, before bloom/grading ever see it, instead of only faking
// night in post — that's what was washing the whole scene out white.
// (Tune this + NIGHT_EXPOSURE together — they compound.)
export const TERRAIN_DIM_COLOR = 0x5c6d78;

// Night grading — simulates night over imagery that was actually captured in daylight.
export const NIGHT_EXPOSURE = 0.85; // additional darkening applied on top of TERRAIN_DIM_COLOR
export const NIGHT_TINT = 0x1c3a4a; // cool moonlight tint pushed into the shadows
export const NIGHT_SATURATION = 0.5;
export const NIGHT_VIGNETTE = 0.6;

// Bloom threshold is set high so only the glowing operators (and their
// halos), which are much brighter than the dimmed night terrain, pick up
// bloom — a low threshold here made the whole scene bloom into a white haze.
export const BLOOM_STRENGTH = 0.9;
export const BLOOM_RADIUS = 0.45;
export const BLOOM_THRESHOLD = 0.7;

// Site location — change these to point the scene at any real-world coordinates
// that have Photorealistic 3D Tiles coverage. Default is Battery Park, NYC,
// chosen for its dense mix of streets, trees and buildings.
export const SITE_LAT = 40.7033;
export const SITE_LON = -74.017;

// Tiles data source. The Cesium Ion asset below is a copy of Google's
// Photorealistic 3D Tiles that Cesium exposes to every (free) Ion account by
// default, so it only needs a Cesium Ion access token to get started. Set
// VITE_GOOGLE_MAPS_API_KEY instead to stream tiles directly from Google Maps
// Platform (Map Tiles API) if you'd rather manage billing/quotas yourself.
export const CESIUM_ION_TOKEN = import.meta.env.VITE_ION_KEY ?? '';
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '';
export const GOOGLE_PHOTOREALISTIC_ION_ASSET_ID = '2275207';

// Operator movement — steady walking pace most of the time, with occasional
// brisker dash bursts for visual variety. Movement is a continuous steering
// model (heading is always a unit vector scaled by speed).
export const OPERATOR_CREEP_SPEED = 0.85; // m/s, slow deliberate walk
export const OPERATOR_DASH_SPEED = 1.4; // m/s, brisk walk

// The operator just walks its checkpoints in order, reversing direction
// once it reaches either end (a ping-pong loop).
export const PATH_ARRIVAL_RADIUS = 1.2; // metres from a checkpoint counted as "arrived"

// Dash bursts happen on a randomized cadence rather than at specific
// checkpoints. Operators never stop moving along their path.
export const OPERATOR_DASH_INTERVAL_MIN = 10; // seconds of creeping between dash bursts
export const OPERATOR_DASH_INTERVAL_MAX = 20;
export const OPERATOR_DASH_DURATION_MIN = 2; // seconds a dash burst lasts
export const OPERATOR_DASH_DURATION_MAX = 4;

// Operator visual: a dark, matte silhouette ("there's really someone there")
// rather than a glowing dot, tagged with a bright tactical reticle so it still
// reads clearly against the night terrain.
export const OPERATOR_BODY_COLOR = 0x05070a; // near-black, stays dark regardless of the night grade

// Body + head are two overlapping, non-uniformly scaled spheres rather than
// one perfect sphere, so the silhouette reads as a crouching figure instead
// of a geometric blob.
export const OPERATOR_BODY_RADIUS = 0.34;
export const OPERATOR_BODY_WIDTH_SCALE = 0.85; // flattens the torso side-to-side
export const OPERATOR_BODY_HEIGHT_SCALE = 1.2; // stretches it taller than wide
export const OPERATOR_BODY_DEPTH_SCALE = 0.7; // flattens it front-to-back, like a hunched crouch
export const OPERATOR_HEAD_RADIUS = 0.17;

// Kept semi-transparent (rather than fully opaque) to soften the silhouette's
// contrast against the terrain — a fixed opacity, no pulsing.
export const OPERATOR_BODY_OPACITY_BASE = 0.9;

// Soft billboard sprite behind the body/head that feathers their otherwise
// hard sphere edge (see getHaloTexture in operator.ts) — a cheap stand-in
// for a real blur pass.
export const OPERATOR_HALO_SIZE = 1.6; // metres, camera-facing sprite size
export const OPERATOR_HALO_OPACITY = 0.7;

export const OPERATOR_SHADOW_RADIUS = 0.8; // soft dark ground decal that grounds the body visually
export const OPERATOR_RETICLE_SIZE = 1.05; // half-size of the square tactical bracket around the body
export const OPERATOR_RETICLE_CORNER = 0.5; // length of each bracket corner segment

// Drone-feed ID tag: a single diagonal leader line from the operator's head
// out to the floating callsign label, giving some breathing room between them.
export const LABEL_LINE_START_HEIGHT = 1.0; // metres, roughly the head's apex
export const LABEL_ANCHOR_HEIGHT = 6.3; // metres above ground
export const LABEL_ANCHOR_OFFSET = 4.4; // metres, horizontal reach of the diagonal

// Ground clamping — periodically raycasts down onto the streaming tiles so
// operators stay pinned to the (progressively loading) street/terrain surface.
export const GROUND_RAYCAST_HEIGHT = 400;
export const GROUND_SAMPLE_INTERVAL = 0.25; // seconds between probes, staggered per operator

// Any raycast hit outside this range (metres, relative to the site origin) is
// rejected as bogus rather than trusted — partially-loaded/placeholder tile
// geometry can occasionally return a wildly wrong hit (e.g. thousands of
// metres below ground), which would otherwise get baked in as a "real"
// ground sample and drag an operator (and the camera following it) miles away.
export const GROUND_SAMPLE_PLAUSIBLE_MIN = -100;
export const GROUND_SAMPLE_PLAUSIBLE_MAX = 400;

// Height changes between ground samples (terrain slopes, curbs, etc.) are
// eased into at this rate instead of snapped, so they read as a climb.
export const OPERATOR_VERTICAL_SPEED = 2.5; // m/s max climb/descend rate

// Added on top of the sampled/interpolated ground altitude so the operator's
// feet never clip into the mesh (e.g. a slightly stale sample on a slope).
export const OPERATOR_GROUND_OFFSET = 1.5; // metres above the ground surface

// Camera
export const CAMERA_FOV = 50;
export const CAMERA_NEAR = 0.5;
export const CAMERA_FAR = 8000;

// Slow autonomous "helicopter" drift: the camera position glides along a
// lazy figure-eight centered on the operators' group (at a fixed hover
// altitude above them), while the orbit target always tracks the operators
// directly (see CAMERA_LOOKAT_EASE below) and OrbitControls dragging/zooming
// still works on top of both.
export const FLIGHT_DRIFT_SPEED = 0.05; // radians/sec of the underlying Lissajous path
export const FLIGHT_DRIFT_RADIUS_X = 56; // metres
export const FLIGHT_DRIFT_RADIUS_Z = 38; // metres
export const FLIGHT_DRIFT_HEIGHT = 8; // metres of slow vertical bob
export const CAMERA_DRIFT_ALTITUDE = 85; // metres, fixed hover height above the operators' centroid

// Caps how far the camera is allowed to jump in a single frame while
// following the anchor above (e.g. if an operator's altitude snaps once
// tiles finish streaming in) — any excess is carried over and caught up on
// following frames instead of teleporting the camera off into empty space.
export const CAMERA_DRIFT_MAX_STEP = 1.5; // metres per frame

// How quickly the orbit target eases toward the true centroid of the
// operators (rather than snapping straight to it every frame).
export const CAMERA_LOOKAT_EASE = 1.5;

// Callsign pool one is randomly assigned from, per trajectory, in mission.ts
// (see OPERATOR_NAMES there) — shared by the cinematic view and path editor.
export const OPERATOR_NAME_POOL = ['Mitchell', 'Clark', 'Chavez', 'Ramirez', 'Johnston', 'Diaz', 'Price', 'Loiselle'];

// Path editor (pathEditor.ts) — active whenever mission.ts's TRAJECTORIES has
// any operator with fewer than 2 checkpoints. A static, straight-down,
// unlit/ungraded orthographic view (no drift, no bloom/night grade) so
// terrain, trees and rooftops read clearly for precise checkpoint placement.
export const EDIT_CAMERA_HEIGHT = 220; // metres, straight above the operators' centroid
export const EDIT_VIEW_HALF_SIZE = 70; // metres, half the visible height at zoom 1
export const EDIT_MARKER_RADIUS = 0.6; // metres, flat disc drawn at each checkpoint
export const EDIT_MARKER_START_RADIUS = 0.95; // metres, first checkpoint of a path drawn bigger
export const EDIT_MARKER_HEIGHT = 0.05; // metres above ground, avoids z-fighting with terrain
export const EDIT_PATH_OPACITY_ACTIVE = 0.95; // selected operator's path/markers
export const EDIT_PATH_OPACITY_INACTIVE = 0.35; // other operators' paths/markers, dimmed for reference
export const EDIT_CLICK_DRAG_THRESHOLD_PX = 6; // pointer movement above this counts as a pan, not a click
