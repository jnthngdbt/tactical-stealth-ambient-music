// Palette — same tactical language as the other pages (dark, cold cyan accent),
// pushed further into a cool "night overwatch" grade applied on top of the
// (daylight-captured) photorealistic tiles by NightGradingPass.
export const BACKGROUND_COLOR = 0x03060a;

export const OPERATOR_COLOR = 0x35f0d0;
export const OPERATOR_ALT_COLOR = 0x9be7ff; // used for every other operator, for visual variety

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
// model (heading is always a unit vector scaled by speed), so sway/avoidance
// steering never adds extra speed on top.
export const OPERATOR_CREEP_SPEED = 0.85; // m/s, slow deliberate walk
export const OPERATOR_DASH_SPEED = 1.4; // m/s, brisk walk
export const OPERATOR_SWAY = 0.05; // small steering nudge blended into heading while creeping, then renormalized

// All operators drift toward this same shared compass bearing (degrees,
// 0 = north/+Z, clockwise) so the whole patrol group reads as advancing
// together — obstacle avoidance is the only thing that ever pulls an
// operator off this heading, and it always eases back once clear.
export const PATROL_BEARING_DEG = 35;

// Past this distance from its spawn point, an operator's heading gradually
// blends toward heading back to spawn instead of a hard turnaround, so the
// shared-direction drift loops within the mapped area instead of the
// operator marching off into unstreamed tiles forever.
export const PATROL_LEASH_RADIUS = 35; // metres

// Movement is continuous drift rather than point-to-point waypoints, so
// brisk dash bursts happen on a randomized cadence instead of at specific
// waypoints. Operators never stop moving.
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

// The tiles mesh has no semantic road/building tags, so ground raycasts can
// occasionally land on a rooftop. Rather than snapping straight up onto it,
// operators probe well ahead along their current heading (plus a small fan
// to each side, so an edge that isn't exactly dead-ahead still gets caught)
// and, if it steps up/down too much, turn away from the shared drift
// direction by up to a wide angle — actually walking around the obstacle's
// silhouette (however large) rather than a small fixed sideways nudge —
// holding that turn until a short run of clear readings confirms it's safe
// to ease back onto the shared heading (avoids clipping back into a corner).
// The step threshold is set well above curb/car/tree-sized bumps so only
// real building-scale steps trigger a detour (fewer, steadier direction
// changes overall).
export const OBSTACLE_LOOKAHEAD_DISTANCE = 5; // metres ahead probed for a step, far enough to react before reaching it
export const OBSTACLE_FAN_ANGLE = 0.35; // radians left/right of heading also probed when checking if blocked
export const OBSTACLE_PROBE_ANGLE = 0.6; // radians left/right sampled to pick which side to turn toward
export const OBSTACLE_STEP_THRESHOLD = 1.4; // metres of height change considered an obstacle
export const OBSTACLE_TURN_SPEED = 2.2; // radians/sec the steering angle turns by
export const OBSTACLE_MAX_YAW = 2.7; // radians, max steering deviation from the direct heading
export const OBSTACLE_CLEAR_HOLD = 0.6; // seconds the path ahead must read clear before straightening back out

// Any remaining height change (e.g. a step the avoidance above didn't catch)
// is eased into at this rate instead of snapped, so it reads as a climb.
export const OPERATOR_VERTICAL_SPEED = 2.5; // m/s max climb/descend rate

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

// How quickly the orbit target eases toward the true centroid of the
// operators (rather than snapping straight to it every frame).
export const CAMERA_LOOKAT_EASE = 1.5;
