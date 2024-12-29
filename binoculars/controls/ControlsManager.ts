import * as THREE from 'three';
import * as CONST from '../constants.ts';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

export class ControlsManager {
	public window: Window;
	public camera: THREE.PerspectiveCamera; 
	public renderer: THREE.WebGLRenderer;
	public composer: EffectComposer;
	public planeSize: THREE.Vector2;
	
	public isPanning = false;
	public panSpeedFactor = 10.0;

	public minZoomCameraPosZ = 0.8;

	public isSideZooming = false;
	public sideZoomZoneWidth = 0.15;
	private sideZoomPos = 0;

	public scrollZoomSpeedFactor = 0.001;
	public sideZoomSpeedFactor = 0.002;

	private startMouse = new THREE.Vector2();
	private startCameraPosition = new THREE.Vector3();
	
	constructor(window: Window, 
		camera: THREE.PerspectiveCamera, 
		renderer: THREE.WebGLRenderer, 
		composer: EffectComposer,
		planeSize: THREE.Vector2) {

		this.window = window;
		this.camera = camera;
		this.renderer = renderer;
		this.composer = composer;
		this.planeSize = planeSize;

		// Add Event Listeners for Panning
		window.addEventListener("mousedown", (event) => {
			this.isSideZoomZone(event.clientX) ? 
				this.onSideZoomStart(event.clientY) :
				this.onPanStart(event.clientX, event.clientY);
		});

		window.addEventListener("mousemove", (event) => {
			this.isSideZooming ?
				this.onSideZoom(event.clientY) :
				this.onPan(event.clientX, event.clientY);
		});

		window.addEventListener("mouseup", () => {
			this.isSideZooming ?
				this.onSideZoomEnd() :
				this.onPanEnd();
		});

		window.addEventListener("touchstart", (event) => {
			this.isSideZoomZone(event.touches[0].clientX) ? 
				this.onSideZoomStart(event.touches[0].clientY) :
				this.onPanStart(event.touches[0].clientX, event.touches[0].clientY);
		});

		window.addEventListener("touchmove", (event) => {
			this.isSideZooming ?
				this.onSideZoom(event.touches[0].clientY) :
				this.onPan(event.touches[0].clientX, event.touches[0].clientY);
		});

		window.addEventListener("touchend", () => {
			this.isSideZooming ?
				this.onSideZoomEnd() :
				this.onPanEnd();
		});

		// Zoom using scroll wheel
		window.addEventListener("wheel", (event) => {
			this.onZoom(event.deltaY * this.scrollZoomSpeedFactor);
		});

		// Resize Handling
		window.addEventListener("resize", () => {
			this.onResize();
		});
	}

	public update(time: number) {
		// if needed
	}

	private isSideZoomZone(x: number) {
		return x / this.window.innerWidth > (1.0 - this.sideZoomZoneWidth);
	}

	private onSideZoomStart(y: number) {
		this.isSideZooming = true;
		this.sideZoomPos = y;
	}
	
	private onSideZoom(y: number) {
		const deltaY = y - this.sideZoomPos;
		this.sideZoomPos = y;
		this.onZoom(deltaY * this.sideZoomSpeedFactor);
	}

	private onSideZoomEnd() {
		this.isSideZooming = false;
	}

	private onZoom(delta: number) {
		this.camera.position.z += delta * this.camera.position.z;

		this.restrictCameraPosition();
	}

	private onPanStart(x: number, y: number) {
		this.isPanning = true;
		this.startMouse.set(x, y);
		this.startCameraPosition.copy(this.camera.position);
	}

	private onPanEnd() {
		this.isPanning = false;
	}

	private onPan(x: number, y: number) {
		if (!this.isPanning) return;

		const deltaX = (x - this.startMouse.x) / this.window.innerWidth;
		const deltaY = (y - this.startMouse.y) / this.window.innerHeight;

		this.camera.position.x = this.startCameraPosition.x + deltaX * this.panSpeedFactor;
		this.camera.position.y = this.startCameraPosition.y - deltaY * this.panSpeedFactor;

		this.restrictCameraPosition();
	}

	private onResize() {
		this.camera.aspect = this.window.innerWidth / this.window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(this.window.innerWidth, this.window.innerHeight);
		this.composer.setSize(this.window.innerWidth, this.window.innerHeight);
		this.restrictCameraPosition();
	}

	private restrictCameraPosition() {
		const edgeFactor = 0.85; // account for black border of binoculars
		const z = this.camera.position.z;
		const fov = (edgeFactor * this.camera.fov / 2) * (Math.PI / 180);
		const cameraAr = this.camera.aspect;

		// Calculate frustum dimensions at the plane's distance
		const frustumHeight = 2 * z * Math.tan(fov);
		const frustumWidth = frustumHeight * cameraAr;

		// Calculate camera boundaries
		const xMax = (this.planeSize.x - frustumWidth) / 2;
		const yMax = (this.planeSize.y - frustumHeight) / 2;

		// Restrict zoom camera position
		const zMaxFromHeight = this.planeSize.y / (2 * Math.tan(fov));
		const zMaxFromWidth = this.planeSize.x / (2 * Math.tan(fov) * cameraAr);
		const zMax = Math.min(zMaxFromHeight, zMaxFromWidth)

		this.camera.position.x = THREE.MathUtils.clamp(this.camera.position.x, -xMax, xMax);
		this.camera.position.y = THREE.MathUtils.clamp(this.camera.position.y, -yMax, yMax);
		this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, this.minZoomCameraPosZ, zMax);
	}
}