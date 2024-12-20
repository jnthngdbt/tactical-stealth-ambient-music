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
- https://media.discordapp.net/attachments/1319498604766953512/1319500437174620200/jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_354daa91-edcb-4e11-a44f-f56a098819f8.png?ex=6766300b&is=6764de8b&hm=f7128cb8e728dddf7f44af2106c323f8bc533b00c42a798af80600e1a35f3530&=&format=webp&quality=lossless (nice base orange)
- https://media.discordapp.net/attachments/1319498604766953512/1319500458930470912/jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_92a6a60d-4ee6-40bd-82ed-1df5387ec3a8.png?ex=67663010&is=6764de90&hm=e04b6ad0c3e305895e53849c3ea3fbb14ad2078b54bb0c567129a4b80e4a1ba5&=&format=webp&quality=lossless (spatioport)
- https://media.discordapp.net/attachments/1319498604766953512/1319500329343258624/jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_3a4c4704-f83d-4f54-a9c9-28e7fcc11441.png?ex=67662ff1&is=6764de71&hm=637176c06a0a714bd8e572cb3e532d1794c9c7ae55df037573c3d88289e53c54&=&format=webp&quality=lossless (cozy silos)
- https://media.discordapp.net/attachments/1319498604766953512/1319505786111787051/jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_74d166ca-8493-4f48-a146-64ca25121cab.png?ex=67663506&is=6764e386&hm=befb989829d1165e48e4428a14869ea2c2c8d5735c06685ae578fe253dc89af8&=&format=webp&quality=lossless (blue house from below)
- https://media.discordapp.net/attachments/1319498604766953512/1319511172948693002/jnthngdbt_Midnight_futuristic_concrete_multi-building_bunker_co_cdcc27e2-b964-4ba4-9990-92acce687e7c.png?ex=67663a0a&is=6764e88a&hm=3d084c813ba956c51a6c5a9694d03db3e34b59fd63f74f23eaff16c775e24fca&=&format=webp&quality=lossless (red base close)
- https://media.discordapp.net/attachments/1319498604766953512/1319511209749516381/jnthngdbt_Midnight_futuristic_concrete_multi-building_bunker_co_cf4c2416-c763-45a1-8ef7-d1381616799a.png?ex=67663a13&is=6764e893&hm=ab4e6d37a0ddac72cc36467445fb2298df8f2e75a277b21ca2c25482bd232dba&=&format=webp&quality=lossless (gray outpost)
- https://media.discordapp.net/attachments/1319498604766953512/1319511408164995092/jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_0701d598-e389-4b2a-a124-7589788e4d04.png?ex=67663a43&is=6764e8c3&hm=8607b89ee42b75be4bcc962e6f655eecfc0dfd440c9caa2cdce0769ac6bb0116&=&format=webp&quality=lossless (dark forest orange)
*/

// Load an Image Texture
const textureLoader = new THREE.TextureLoader();
textureLoader.load("https://media.discordapp.net/attachments/1319498604766953512/1319500437174620200/jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_354daa91-edcb-4e11-a44f-f56a098819f8.png?ex=6766300b&is=6764de8b&hm=f7128cb8e728dddf7f44af2106c323f8bc533b00c42a798af80600e1a35f3530&=&format=webp&quality=lossless", (texture) => {
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

// Jitter Parameters
const jitterAmplitude = 0.001; // Maximum jitter offset
const jitterSpeed = 2; // Lower means faster jitter
const addJitter = true; // Toggle jitter

// Animation Loop
function animate() {
  if (addJitter) {
    // Apply small random jitter to the camera position
    const time = performance.now() / jitterSpeed;
    camera.position.x += Math.sin(time) * jitterAmplitude * (Math.random() - 0.5);
    camera.position.y += Math.cos(time) * jitterAmplitude * (Math.random() - 0.5);
  }

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

// Hide the cursor over the canvas
//renderer.domElement.style.cursor = 'none';