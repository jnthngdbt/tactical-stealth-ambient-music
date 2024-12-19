import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class App {
  public scene = new THREE.Scene();
  public renderer = new THREE.WebGLRenderer({ antialias: true });
  public camera: THREE.PerspectiveCamera;
  public controls: OrbitControls;

  constructor({
    color = 0x111122,
    fov = 50,
    pov = [75, 40, 80],
  }: {
    color?: number;
    fov?: number;
    pov?: [number, number, number];
  }) {
    // Create scene and renderer
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(...pov);

    // Set background color
    this.scene.background = new THREE.Color(color);

    // Orbit controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true; // for smooth controls
    this.controls.dampingFactor = 0.25;
    this.controls.screenSpacePanning = false;
    this.controls.maxPolarAngle = Math.PI;
    this.controls.update();

    // Handle window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Bind methods to the current instance
    this.animate = this.animate.bind(this);
    this.exportScene = this.exportScene.bind(this); // must be before the `addEventListener` call

    // Add event listener to the button to trigger exportScene on click
    document.getElementById('downloadBtn')?.addEventListener('click', this.exportScene);
  }

  // Render loop.
  // Requires `this.animate = this.animate.bind(this);` in the constructor.
  public animate() {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  // Export scene to JSON and download it.
  public exportScene() {
    this.scene.updateMatrixWorld();
    var result = this.scene.toJSON();
    var jsonStr = JSON.stringify(result);

    // Create a downloadable link for the exported scene
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tsam.three.js.scene.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

