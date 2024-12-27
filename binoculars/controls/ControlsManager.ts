import * as THREE from 'three';
import * as CONST from '../constants.ts';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

export class ControlsManager {
  public window: Window;
  public camera: THREE.PerspectiveCamera; 
  public renderer: THREE.WebGLRenderer;
  public composer: EffectComposer;
  
  public isPanning = false;
  public panSpeedFactor = 10.0;

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
    composer: EffectComposer) {

    this.window = window;
    this.camera = camera;
    this.renderer = renderer;
    this.composer = composer;

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