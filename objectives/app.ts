import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import * as CONST from './constants.ts';

// Renders the scene standalone (no orbit/interaction controls): the camera
// is fully driven by the Timeline, and bloom gives the hologram/HUD glow.
export class App {
	public scene = new THREE.Scene();
	public camera: THREE.PerspectiveCamera;
	public renderer = new THREE.WebGLRenderer({ antialias: true });
	public composer: EffectComposer;

	constructor() {
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		document.body.appendChild(this.renderer.domElement);

		this.scene.background = new THREE.Color(CONST.BACKGROUND_COLOR);
		this.scene.fog = new THREE.Fog(CONST.BACKGROUND_COLOR, CONST.FOG_NEAR, CONST.FOG_FAR);

		this.camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 1000);

		this.composer = new EffectComposer(this.renderer);
		this.composer.addPass(new RenderPass(this.scene, this.camera));
		this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.55, 0.5, 0.35));
		this.composer.addPass(new OutputPass());

		window.addEventListener('resize', () => this.onResize());
	}

	private onResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.composer.setSize(window.innerWidth, window.innerHeight);
	}

	public render() {
		this.composer.render();
	}
}
