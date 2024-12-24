import * as THREE from "three";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RenderPixelatedPass } from 'three/addons/postprocessing/RenderPixelatedPass.js';
import { FilmPass, ShaderPass } from "three/examples/jsm/Addons.js";
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
jnthngdbt_Dark_theme_heavily_defended_concrete_multi-building_b_2e4dae5c-a670-4c21-a6c0-abe8f0757a25.png
jnthngdbt_Dark_theme_heavily_defended_concrete_multi-building_b_f081fe34-33ad-4b6b-bf7d-63a0b79bb8b8.png
jnthngdbt_Dark_theme_heavily_fortified_concrete_multi-building__71c05842-c354-4d31-bd7c-fc93629f3f38.png
jnthngdbt_Heavily_defended_desert_concrete_multi-building_bunke_4e449e81-c3bd-4d08-94ec-aa464fb40833.png
jnthngdbt_Heavily_fortified_and_defended_desert_concrete_multi-_0a2ed1db-e1f4-4419-8dbf-ce26f915394e.png
jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_74d166ca-8493-4f48-a146-64ca25121cab.png
jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_92a6a60d-4ee6-40bd-82ed-1df5387ec3a8.png (spatioport)
jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_354daa91-edcb-4e11-a44f-f56a098819f8.png
jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_0701d598-e389-4b2a-a124-7589788e4d04.png
jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_ce184244-4427-4403-9573-914a55257101.png
jnthngdbt_Midnight_futuristic_concrete_multi-building_bunker_co_6cc95bcb-8818-4a4b-882c-8f8367139ad8.png
jnthngdbt_Midnight_futuristic_concrete_multi-building_bunker_co_cdcc27e2-b964-4ba4-9990-92acce687e7c.png
jnthngdbt_Midnight_futuristic_concrete_multi-building_bunker_co_cf4c2416-c763-45a1-8ef7-d1381616799a.png (sea port)
jnthngdbt_Midnight_heavily_defended_desert_concrete_multi-build_4a24248c-3833-4961-bb7f-372992a6cb87.png
jnthngdbt_Midnight_heavily_defended_desert_concrete_multi-build_f0371757-ae87-48d0-b7c5-856f2e4edb59.png
*/

// Load an Image Texture
const textureLoader = new THREE.TextureLoader();
textureLoader.load("assets/jnthngdbt_Midnight_futuristic_concrete_multi-building_bunker_co_6cc95bcb-8818-4a4b-882c-8f8367139ad8.png", (texture) => {
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

// Invert Color Shader
const NoiseShader = {
  uniforms: {
    tDiffuse: { value: null }, // Scene texture
    time: { value: 0 }, // Time uniform
    noiseIntensity: { value: 0.1 }, // Noise intensity
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float noiseIntensity;

    // Random function
    float random(vec2 uv) {
      return fract(sin(dot(uv.xy, vec2(12.9898,78.233))) * 43758.5453123) - 0.5;
    }

    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float noise = random(vUv + time);
      gl_FragColor = vec4(color.rgb + noise * noiseIntensity, color.a);
    }
  `,
};
const noisePass = new ShaderPass(NoiseShader);
composer.addPass(noisePass);


// Add pixel pass
const pixelPass = new RenderPixelatedPass(5, scene, camera);
composer.addPass(pixelPass);

// Film Grain Effect
const filmPass = new FilmPass(1.5);
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
    var panSpeedFactor = 8.0;
    camera.position.x = startCameraPosition.x + deltaX * panSpeedFactor;
    camera.position.y = startCameraPosition.y - deltaY * panSpeedFactor;
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

// Jitter Parameters
const jitterAmplitude = 0.0015; // Maximum jitter offset
const jitterSpeed = 2; // Lower means faster jitter
const addJitter = true; // Toggle jitter

// Animation loop
const clock = new THREE.Clock();

// Cast uniforms to explicitly known types
type PixelPassUniforms = {
  pixelSize: { value: number };
};

// Animation Loop
function animate() {
  const elapsedTime = clock.getElapsedTime();
  noisePass.uniforms.time.value = elapsedTime;
  noisePass.uniforms.noiseIntensity.value = getNoiseIntensity(camera.position.z);

  // var pixelPassUniforms = pixelPass. as PixelPassUniforms;
  pixelPass.setPixelSize(getPixelSize(camera.position.z));

  if (addJitter) {
    // Apply small random jitter to the camera position
    const time = performance.now() / jitterSpeed;
    camera.position.x += Math.sin(time) * jitterAmplitude * (Math.random() - 0.5);
    camera.position.y += Math.cos(time) * jitterAmplitude * (Math.random() - 0.5);
  }

  requestAnimationFrame(animate);

  composer.render();
}

function getPixelSize(cameraPosition: number): number {
  return THREE.MathUtils.mapLinear(
    cameraPosition, 
    CONST.MIN_ZOOM_POS, 
    CONST.MAX_ZOOM_POS, 
    CONST.MAX_PIXEL_SIZE, 
    CONST.MIN_PIXEL_SIZE);
}

function getNoiseIntensity(cameraPosition: number): number {
  return THREE.MathUtils.mapLinear(
    cameraPosition, 
    CONST.MIN_ZOOM_POS, 
    CONST.MAX_ZOOM_POS, 
    CONST.MAX_NOISE_INTENSITY, 
    CONST.MIN_NOISE_INTENSITY);
}

animate();

// Hide the cursor over the canvas
//renderer.domElement.style.cursor = 'none';