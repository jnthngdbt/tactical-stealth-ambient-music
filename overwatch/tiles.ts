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

// Sets up the photorealistic 3D Tiles renderer, re-orients it so the given
// site coordinates sit at the world origin (+Y up), and swaps loaded tile
// materials to unlit so the night grading pass has full control over lighting.
// Pass `dim: false` (the path editor does) to keep the raw daylight imagery
// at full brightness instead, since spotting obstacles for checkpoint
// placement matters more there than matching the night-feed look.
export function createTiles(camera: THREE.Camera, renderer: THREE.WebGLRenderer, options: { dim?: boolean } = {}) {
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

	const dracoLoader = new DRACOLoader();
	dracoLoader.setDecoderPath('https://unpkg.com/three@0.169.0/examples/jsm/libs/draco/');
	tiles.registerPlugin(new GLTFExtensionsPlugin({ dracoLoader }));

	const reorient = new ReorientationPlugin({
		lat: CONST.SITE_LAT * THREE.MathUtils.DEG2RAD,
		lon: CONST.SITE_LON * THREE.MathUtils.DEG2RAD,
	});
	tiles.registerPlugin(reorient);

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
		});
	});

	tiles.setCamera(camera);
	tiles.setResolutionFromRenderer(camera, renderer);

	return { tiles, reorient };
}

// Converts an East/North/Up offset in metres from the site origin into the
// tiles' local frame, where ReorientationPlugin places +X facing west and +Z
// facing north.
export function enuToLocal(east: number, north: number, up: number, target = new THREE.Vector3()): THREE.Vector3 {
	return target.set(-east, up, north);
}

// Inverse of enuToLocal: turns a local tile-frame X/Z back into East/North
// metre offsets from the site origin, used by the waypoint-picking tool.
export function localToEnu(x: number, z: number): { east: number; north: number } {
	return { east: -x, north: z };
}

// Raycasts straight down onto the (progressively streaming) tiles to find the
// street/terrain surface height at a given local X/Z. Falls back to the
// provided height when nothing has loaded there yet.
export function sampleGroundHeight(tiles: TilesRenderer, x: number, z: number, fallback: number): number {
	rayOrigin.set(x, CONST.GROUND_RAYCAST_HEIGHT, z);
	raycaster.set(rayOrigin, rayDirection);
	const hits = raycaster.intersectObject(tiles.group, true);
	return hits.length ? hits[0].point.y : fallback;
}
