import * as THREE from 'three';
import { TilesRenderer } from '3d-tiles-renderer';
import {
	CesiumIonAuthPlugin,
	GoogleCloudAuthPlugin,
	GLTFExtensionsPlugin,
	TileCompressionPlugin,
	TilesFadePlugin,
	ReorientationPlugin,
} from '3d-tiles-renderer/plugins';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as CONST from './constants.ts';

const raycaster = new THREE.Raycaster();
// @ts-expect-error — 3d-tiles-renderer patches Raycaster to support early-exit on tile meshes.
raycaster.firstHitOnly = true;
const rayOrigin = new THREE.Vector3();
const rayDirection = new THREE.Vector3(0, -1, 0);

// Shared by every tile's wireframe overlay (see load-model below) — only the
// geometry differs per mesh, so one material instance is reused for all of
// them instead of allocating one per tile.
const wireframeMaterial = new THREE.LineBasicMaterial({
	color: CONST.TERRAIN_WIREFRAME_COLOR,
	transparent: true,
	opacity: CONST.TERRAIN_WIREFRAME_OPACITY,
	depthWrite: false,
	// pulls the lines slightly toward the camera in depth so they don't
	// z-fight with the solid triangles they're tracing exactly on top of
	polygonOffset: true,
	polygonOffsetFactor: -1,
	polygonOffsetUnits: -1,
});

// Reused across every createTiles() call (see below) so switching between
// cinematic mode and the path editor doesn't throw away already-downloaded
// tile data — see the comment inside createTiles for why this matters.
let sharedTiles: { tiles: TilesRenderer; reorient: ReorientationPlugin } | null = null;

// Sets up the photorealistic 3D Tiles renderer, re-orients it so the given
// site coordinates sit at the world origin (+Y up), and swaps loaded tile
// materials to unlit so the night grading pass has full control over lighting.
// Both cinematic mode and the path editor use the default dimmed look so the
// two modes render identically; pass `dim: false` only if a full-brightness
// daylight view is ever needed again.
//
// Only builds a real TilesRenderer once for the page's whole lifetime — main.ts
// and pathEditor.ts both call this on every mode switch, and a fresh
// TilesRenderer re-authenticates with Cesium Ion and redownloads every tile
// from scratch, which was the main driver of Ion quota usage since toggling
// modes happens often while building/testing patrol paths. On later calls
// this just repoints the existing instance at the new camera/renderer and
// returns it; the caller still does `scene.add(tiles.group)`, which
// auto-detaches the group from whichever scene it was previously in, so
// already-downloaded/parsed tiles stay resident (in the shared LRUCache) and
// simply get re-uploaded to the new WebGLRenderer's GPU context instead of
// being re-fetched over the network.
export function createTiles(camera: THREE.Camera, renderer: THREE.WebGLRenderer, options: { dim?: boolean } = {}) {
	if (sharedTiles) {
		sharedTiles.tiles.setCamera(camera);
		updateTilesResolution(sharedTiles.tiles, camera, renderer);
		return sharedTiles;
	}

	const dim = options.dim ?? true;
	const tiles = new TilesRenderer();

	if (CONST.GOOGLE_MAPS_API_KEY) {
		tiles.registerPlugin(new GoogleCloudAuthPlugin({ apiToken: CONST.GOOGLE_MAPS_API_KEY }));
	} else {
		tiles.registerPlugin(
			new CesiumIonAuthPlugin({
				apiToken: CONST.CESIUM_ION_TOKEN,
				assetId: CONST.GOOGLE_PHOTOREALISTIC_ION_ASSET_ID,
				autoRefreshToken: true,
			}),
		);
	}

	tiles.registerPlugin(new TileCompressionPlugin());
	tiles.registerPlugin(new TilesFadePlugin());

	// Applied after the auth plugins above so it overrides GoogleCloudAuthPlugin's
	// own errorTarget=20 (its "recommended settings" favour efficiency, not quality).
	tiles.errorTarget = CONST.TILE_ERROR_TARGET;

	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath('https://unpkg.com/three@0.169.0/examples/jsm/libs/draco/');
	tiles.registerPlugin(new GLTFExtensionsPlugin({ dracoLoader }));

	const reorient = new ReorientationPlugin({
		lat: CONST.SITE_LAT * THREE.MathUtils.DEG2RAD,
		lon: CONST.SITE_LON * THREE.MathUtils.DEG2RAD,
	});
	tiles.registerPlugin(reorient);

	const wireframeEnabled = CONST.TERRAIN_WIREFRAME_OPACITY > 0;

	// The captured imagery already bakes in daylight; render it unlit (and, in
	// cinematic mode, tinted dark so the NightGradingPass fully controls how
	// the scene reads) instead of three.js re-lighting an already-lit photo.
	tiles.addEventListener('load-model', ({ scene }: any) => {
		scene.traverse((child: THREE.Object3D) => {
			const mesh = child as THREE.Mesh;
			if (!mesh.isMesh) return;
			const prev = mesh.material as THREE.MeshStandardMaterial;
			mesh.material = new THREE.MeshBasicMaterial({
				map: prev.map ?? null,
				color: prev.map ? (dim ? CONST.TERRAIN_DIM_COLOR : 0xffffff) : prev.color,
			});
			prev.dispose();

			if (!wireframeEnabled) return;

			// Traces the mesh's own triangle edges on top of its texture, faking
			// the look of the drone's low-res 3D reconstruction rather than a
			// plain photographic surface (see TERRAIN_WIREFRAME_* in constants.ts).
			const wireframe = new THREE.LineSegments(new THREE.WireframeGeometry(mesh.geometry), wireframeMaterial);
			mesh.add(wireframe);
		});
	});

	// The wireframe overlay's geometry is created by us above, so unlike the
	// tile's own mesh/texture data it isn't tracked by 3d-tiles-renderer's own
	// disposal bookkeeping — dispose it ourselves or it leaks GPU buffers
	// every time a tile streams out (the shared wireframeMaterial itself is
	// never disposed, since it's reused across every tile for the app's
	// lifetime). Skipped entirely alongside creation above when disabled.
	if (wireframeEnabled) {
		tiles.addEventListener('dispose-model', ({ scene }: any) => {
			scene.traverse((child: THREE.Object3D) => {
				if ((child as THREE.LineSegments).isLineSegments) {
					(child as THREE.LineSegments).geometry.dispose();
				}
			});
		});
	}

	tiles.setCamera(camera);
	updateTilesResolution(tiles, camera, renderer);

	sharedTiles = { tiles, reorient };
	return sharedTiles;
}

// Whether the shared TilesRenderer has nothing left queued/downloading/parsing
// right now. Used to detect the case where createTiles() above returns an
// already-fully-loaded instance (e.g. switching back into a mode after the
// tiles finished loading in a previous one) — 'tiles-load-end' only fires on
// a busy-to-idle transition, so it never re-fires if there was nothing new to
// load, and callers need this synchronous check to avoid waiting forever.
export function isTilesLoaded(tiles: TilesRenderer): boolean {
	// @ts-expect-error — `stats` exists on the runtime TilesRendererBase class but isn't in its .d.ts.
	const { queued, downloading, parsing } = tiles.stats;
	return queued === 0 && downloading === 0 && parsing === 0;
}

const rendererSize = new THREE.Vector2();

// Same as tiles.setResolutionFromRenderer(camera, renderer), except the
// resolution is floored to CONST.TILE_LOD_MIN_WIDTH/HEIGHT — prevents a small
// (e.g. deliberately shrunk-for-recording) window from making the tileset
// stream in lower-detail geometry/textures than the "always render full
// quality" baseline we want, while a genuinely larger window still benefits
// from its own higher resolution.
export function updateTilesResolution(tiles: TilesRenderer, camera: THREE.Camera, renderer: THREE.WebGLRenderer) {
	renderer.getSize(rendererSize);
	tiles.setResolution(
		camera,
		Math.max(rendererSize.x, CONST.TILE_LOD_MIN_WIDTH),
		Math.max(rendererSize.y, CONST.TILE_LOD_MIN_HEIGHT),
	);
}

// Converts an East/North/Up offset in metres from the site origin into the
// tiles' local frame, where ReorientationPlugin places +X facing west and +Z
// facing north.
export function enuToLocal(east: number, north: number, up: number, target = new THREE.Vector3()): THREE.Vector3 {
	return target.set(-east, up, north);
}

// Inverse of enuToLocal: turns a local tile-frame X/Z back into East/North
// metre offsets from the site origin, used by the path editor's checkpoint picker.
export function localToEnu(x: number, z: number): { east: number; north: number } {
	return { east: -x, north: z };
}

// Raycasts straight down onto the (progressively streaming) tiles to find the
// street/terrain surface height at a given local X/Z. Falls back to the
// provided height when nothing has loaded there yet, or when the hit falls
// outside the plausible range (partially-loaded/placeholder tile geometry can
// occasionally produce a wildly wrong hit).
export function sampleGroundHeight(tiles: TilesRenderer, x: number, z: number, fallback: number): number {
	rayOrigin.set(x, CONST.GROUND_RAYCAST_HEIGHT, z);
	raycaster.set(rayOrigin, rayDirection);
	const hits = raycaster.intersectObject(tiles.group, true);
	if (!hits.length) return fallback;
	const y = hits[0].point.y;
	if (y < CONST.GROUND_SAMPLE_PLAUSIBLE_MIN || y > CONST.GROUND_SAMPLE_PLAUSIBLE_MAX) return fallback;
	return y;
}
