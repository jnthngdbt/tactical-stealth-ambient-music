import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { NightGradingPass } from './NightGradingPass.ts';
import * as CONST from './constants.ts';

// Renders the overwatch feed: a camera drifting along a slow figure-eight
// flight path but always looking at the operators' centroid, with bloom for
// their glow and a night grading pass applied last so the (daylight-captured)
// imagery reads as a dark tactical night feed.
export class App {
	public scene = new THREE.Scene();
	public camera: THREE.PerspectiveCamera;
	public renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
	public controls: OrbitControls;
	public composer: EffectComposer;
	public labelRenderer = new CSS2DRenderer();
	private driftElapsed = 0;
	private lastAnchor = new THREE.Vector3();
	private anchorInitialized = false;
	private lookAtTarget = new THREE.Vector3(0, 1.5, 0); // eases toward the operators' centroid
	private resizeHandler = () => this.onResize();

	constructor() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		this.renderer.setClearColor(CONST.BACKGROUND_COLOR);
		document.body.appendChild(this.renderer.domElement);

		this.camera = new THREE.PerspectiveCamera(
			CONST.CAMERA_FOV,
			window.innerWidth / window.innerHeight,
			CONST.CAMERA_NEAR,
			CONST.CAMERA_FAR,
		);
		this.camera.position.set(110, 85, 110);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.08;
		this.controls.minDistance = 12;
		this.controls.maxDistance = 1200;
		this.controls.maxPolarAngle = Math.PI / 2 - 0.02; // keep the horizon in frame
		this.controls.target.set(0, 1.5, 0);

		// Bloom runs on the raw (pre-grade) render so the glowing operators keep
		// their punch; night grading then darkens/tints everything, bloom included.
		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(new RenderPass(this.scene, this.camera));
		this.composer.addPass(
			new UnrealBloomPass(
				new THREE.Vector2(window.innerWidth, window.innerHeight),
				CONST.BLOOM_STRENGTH,
				CONST.BLOOM_RADIUS,
				CONST.BLOOM_THRESHOLD,
			),
		);
		this.composer.addPass(
			new NightGradingPass({
				exposure: CONST.NIGHT_EXPOSURE,
				tint: CONST.NIGHT_TINT,
				saturation: CONST.NIGHT_SATURATION,
				vignette: CONST.NIGHT_VIGNETTE,
			}),
		);
		this.composer.addPass(new OutputPass());

		// Operator nameplates render through a separate CSS2D layer so their text
		// stays crisp and legible — unaffected by bloom or the night colour grade.
		this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
		this.labelRenderer.domElement.style.position = 'fixed';
		this.labelRenderer.domElement.style.top = '0';
		this.labelRenderer.domElement.style.left = '0';
		this.labelRenderer.domElement.style.pointerEvents = 'none';
		this.labelRenderer.domElement.style.zIndex = '1';
		document.body.appendChild(this.labelRenderer.domElement);

		window.addEventListener('resize', this.resizeHandler);
	}

	// Tears down the renderer/label-renderer DOM and listeners so another mode
	// (see main.ts's mode toggle) can take over the page cleanly.
	public dispose() {
		window.removeEventListener('resize', this.resizeHandler);
		this.renderer.domElement.remove();
		this.labelRenderer.domElement.remove();
		this.renderer.dispose();
	}

	private onResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.composer.setSize(window.innerWidth, window.innerHeight);
		this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
	}

	// Drifts the camera position along a slow figure-eight (Lissajous) path
	// centered on the operators' centroid (at a fixed hover altitude above
	// them), as if a helicopter were circling the group. The whole pattern is
	// shifted FLIGHT_DRIFT_SIDE_OFFSET to one side along z, so z never swings
	// back through the centroid — the drone always keeps a lateral distance
	// of at least FLIGHT_DRIFT_SIDE_OFFSET, and so never ends up looking
	// straight down from directly overhead, while still tracing the same
	// looping figure-eight shape. The orbit target is handled separately (see
	// updateLookAt) so the drone keeps flying this pattern while still always
	// facing the operators.
	private updateDrift(delta: number, centroid: THREE.Vector3, groundReady: boolean) {
		this.driftElapsed += delta;
		const t = this.driftElapsed * CONST.FLIGHT_DRIFT_SPEED;
		const anchor = new THREE.Vector3(
			centroid.x + Math.sin(t) * CONST.FLIGHT_DRIFT_RADIUS_X,
			centroid.y + CONST.CAMERA_DRIFT_ALTITUDE + Math.sin(t * 0.5) * CONST.FLIGHT_DRIFT_HEIGHT,
			// (1 + sin 2t) stays in [0, 2], so z - centroid.z never drops below
			// FLIGHT_DRIFT_SIDE_OFFSET, keeping the whole loop on one side
			centroid.z + CONST.FLIGHT_DRIFT_SIDE_OFFSET + CONST.FLIGHT_DRIFT_RADIUS_Z * (1 + Math.sin(t * 2)),
		);

		// until every operator's real ground altitude is known, the centroid's
		// height is still just a placeholder — keep re-syncing to it instead of
		// stepping the camera, so drift only starts once there's nothing left
		// to "catch up" to (avoids a multi-second camera chase once tiles load)
		if (!groundReady) {
			this.lastAnchor.copy(anchor);
			return;
		}

		// first ground-ready frame: snap straight to the anchor instead of
		// drifting from the hardcoded constructor position, so CAMERA_DRIFT_ALTITUDE
		// is the camera's actual hover height above the operators, not just its offset
		if (!this.anchorInitialized) {
			this.camera.position.copy(anchor);
			this.lastAnchor.copy(anchor);
			this.anchorInitialized = true;
			return;
		}

		const step = new THREE.Vector3().subVectors(anchor, this.lastAnchor);
		const stepLength = step.length();
		if (stepLength > CONST.CAMERA_DRIFT_MAX_STEP) step.multiplyScalar(CONST.CAMERA_DRIFT_MAX_STEP / stepLength);
		this.camera.position.add(step);
		// advance lastAnchor by only the (possibly clamped) applied step, not the
		// full unclamped anchor, so any leftover distance is caught up gradually
		// over the following frames instead of being silently dropped
		this.lastAnchor.add(step);
	}

	// Eases the orbit target toward the true centroid of the operators instead
	// of snapping to it, so the drone always keeps them framed no matter where
	// its own flight drift (or the user's manual orbit/zoom) takes it.
	private updateLookAt(delta: number, centroid: THREE.Vector3) {
		this.lookAtTarget.lerp(centroid, Math.min(1, CONST.CAMERA_LOOKAT_EASE * delta));
		this.controls.target.copy(this.lookAtTarget);
	}

	public render(delta: number, centroid: THREE.Vector3, groundReady: boolean) {
		this.updateDrift(delta, centroid, groundReady);
		this.updateLookAt(delta, centroid);
		this.controls.update();
		this.composer.render();
		this.labelRenderer.render(this.scene, this.camera);
	}
}
