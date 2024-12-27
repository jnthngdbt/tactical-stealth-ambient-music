import * as THREE from 'three';
import * as CONST from './constants.ts';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

export class NavigationControls {
  public window: Window;
  public camera: THREE.PerspectiveCamera; 
  public renderer: THREE.WebGLRenderer;
  public composer: EffectComposer;
  
  public isPanning = false;
  public scrollZoomSpeedFactor = 0.001;
  public panSpeedFactor = 8.0;

  private startMouse = new THREE.Vector2();
  private startCameraPosition = new THREE.Vector3();
  
  constructor(window: Window, 
    camera: THREE.PerspectiveCamera, 
    renderer: THREE.WebGLRenderer, 
    composer: EffectComposer) {

    this.window = window;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = composer;

    // Add Event Listeners for Panning
    window.addEventListener("mousedown", (event) => {
      this.onPanStart(event.clientX, event.clientY);
    });

    window.addEventListener("mousemove", (event) => {
      this.onPan(event.clientX, event.clientY);
    });

    window.addEventListener("mouseup", () => {
      this.onPanEnd();
    });

    window.addEventListener("touchstart", (event) => {
      this.onPanStart(event.touches[0].clientX, event.touches[0].clientY);
    });

    window.addEventListener("touchmove", (event) => {
      this.onPan(event.touches[0].clientX, event.touches[0].clientY);
    });

    window.addEventListener("touchend", () => {
      this.onPanEnd();
    });

    // Zoom using scroll wheel
    window.addEventListener("wheel", (event) => {
      this.onZoom(event.deltaY);
    });

    // Resize Handling
    window.addEventListener("resize", () => {
      this.onResize();
    });
  }

  public update(time: number) {
    // if needed
  }

  private onZoom(deltaY: number) {
    this.camera.position.z += deltaY * this.scrollZoomSpeedFactor * this.camera.position.z;
    this.camera.position.z = THREE.MathUtils.clamp(this.camera.position.z, CONST.MIN_ZOOM_POS, CONST.MAX_ZOOM_POS);
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

    // Adjust camera position for panning
    this.camera.position.x = this.startCameraPosition.x + deltaX * this.panSpeedFactor;
    this.camera.position.y = this.startCameraPosition.y - deltaY * this.panSpeedFactor;
  }

  private onResize() {
    this.camera.aspect = this.window.innerWidth / this.window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.window.innerWidth, this.window.innerHeight);
    this.composer.setSize(this.window.innerWidth, this.window.innerHeight);
  }
}