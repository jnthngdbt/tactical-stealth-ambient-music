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

		window.addEventListener('resize', () => this.onResize());
	}

	private onResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.composer.setSize(window.innerWidth, window.innerHeight);
		this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
	}

	// Drifts the camera position along a slow figure-eight centered on the
	// operators' centroid (at a fixed hover altitude above them), as if a
	// helicopter were circling the group. The orbit target is handled
	// separately (see updateLookAt) so the drone keeps flying this pattern
	// while still always facing the operators.
	private updateDrift(delta: number, centroid: THREE.Vector3) {
		this.driftElapsed += delta;
		const t = this.driftElapsed * CONST.FLIGHT_DRIFT_SPEED;
		const anchor = new THREE.Vector3(
			centroid.x + Math.sin(t) * CONST.FLIGHT_DRIFT_RADIUS_X,
			centroid.y + CONST.CAMERA_DRIFT_ALTITUDE + Math.sin(t * 0.5) * CONST.FLIGHT_DRIFT_HEIGHT,
			centroid.z + Math.sin(t * 2) * CONST.FLIGHT_DRIFT_RADIUS_Z,
		);

		// the first frame just synchronizes to the anchor instead of stepping
		// toward it, so the camera doesn't jump on load
		if (!this.anchorInitialized) {
			this.lastAnchor.copy(anchor);
			this.anchorInitialized = true;
			return;
		}

		const step = new THREE.Vector3().subVectors(anchor, this.lastAnchor);
		this.camera.position.add(step);
		this.lastAnchor.copy(anchor);
	}

	// Eases the orbit target toward the true centroid of the operators instead
	// of snapping to it, so the drone always keeps them framed no matter where
	// its own flight drift (or the user's manual orbit/zoom) takes it.
	private updateLookAt(delta: number, centroid: THREE.Vector3) {
		this.lookAtTarget.lerp(centroid, Math.min(1, CONST.CAMERA_LOOKAT_EASE * delta));
		this.controls.target.copy(this.lookAtTarget);
	}

	public render(delta: number, centroid: THREE.Vector3) {
		this.updateDrift(delta, centroid);
		this.updateLookAt(delta, centroid);
		this.controls.update();
		this.composer.render();
		this.labelRenderer.render(this.scene, this.camera);
	}
}
