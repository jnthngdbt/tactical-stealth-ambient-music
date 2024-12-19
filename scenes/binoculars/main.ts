import * as THREE from "three";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FilmPass } from "three/examples/jsm/Addons.js";
import * as CONST from './constants.ts';

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ensure proper color management
renderer.toneMapping = THREE.NoToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;

/*
Some images for testing:
- https://cdn.midjourney.com/4a24248c-3833-4961-bb7f-372992a6cb87/0_0.png (desert, first)
- https://cdn.midjourney.com/018cde85-080a-400c-b235-60d29413adb7/0_1.png (moonlike)
- https://cdn.midjourney.com/9b6e2976-aa7a-4cda-b089-1a481818df87/0_1.png (trapezoid)
- https://cdn.midjourney.com/2e4dae5c-a670-4c21-a6c0-abe8f0757a25/0_0.png (dark, multiple buildings)
- https://cdn.midjourney.com/4e449e81-c3bd-4d08-94ec-aa464fb40833/0_0.png (bright, 2 towers)
*/

// Load an Image Texture
const textureLoader = new THREE.TextureLoader();
textureLoader.load("https://cdn.midjourney.com/2e4dae5c-a670-4c21-a6c0-abe8f0757a25/0_0.png", (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace; // Ensure texture is in sRGB

  // Create a plane geometry and material
  const aspectRatio = texture.image.width / texture.image.height;
  const geometry = new THREE.PlaneGeometry(10, 10 / aspectRatio); // Maintain aspect ratio
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);

  scene.add(plane);
});

// Post-Processing Setup
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// Film Grain Effect
const filmPass = new FilmPass(getFilmGrainIntensity(camera.position.z));
composer.addPass(filmPass);

// Bloom Effect (Glow)
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.2, // Strength
  0.4, // Radius
  0.85 // Threshold
);
composer.addPass(bloomPass);

// Variables for panning
let isPanning = false;
let startMouse = new THREE.Vector2();
let startCameraPosition = new THREE.Vector3();

// Add Event Listeners for Panning and Zooming
window.addEventListener("mousedown", (event) => {
  isPanning = true;
  startMouse.set(event.clientX, event.clientY);
  startCameraPosition.copy(camera.position);
});

window.addEventListener("mousemove", (event) => {
  if (isPanning) {
    const deltaX = (event.clientX - startMouse.x) / window.innerWidth;
    const deltaY = (event.clientY - startMouse.y) / window.innerHeight;

    // Adjust camera position for panning
    var panSpeedFactor = 2.2 / camera.position.z;
    camera.position.x = startCameraPosition.x + deltaX * camera.position.z * 2 * panSpeedFactor;
    camera.position.y = startCameraPosition.y - deltaY * camera.position.z * 2 * panSpeedFactor;
  }
});

window.addEventListener("mouseup", () => {
  isPanning = false;
});

// Zoom using scroll wheel
window.addEventListener("wheel", (event) => {
  var scrollZoomSpeedFactor = 0.001;
  camera.position.z += event.deltaY * scrollZoomSpeedFactor * camera.position.z; // Adjust zoom speed
  camera.position.z = THREE.MathUtils.clamp(camera.position.z, CONST.MIN_ZOOM_POS, CONST.MAX_ZOOM_POS); // Clamp zoom levels
});

// Resize Handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Cast uniforms to explicitly known types
type FilmPassUniforms = {
  intensity: { value: number };
};

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Update FilmPass intensity based on camera position
  // (the more zoomed in, the more intense the film grain)
  const uniforms = filmPass.uniforms as FilmPassUniforms;
  uniforms.intensity.value = getFilmGrainIntensity(camera.position.z); 

  composer.render();
}

function getFilmGrainIntensity(cameraPosition: number): number {
  return THREE.MathUtils.mapLinear(
    cameraPosition, 
    CONST.MIN_ZOOM_POS, 
    CONST.MAX_ZOOM_POS, 
    CONST.MAX_FILM_INTENSITY, 
    CONST.MIN_FILM_INTENSITY);
}

animate();

