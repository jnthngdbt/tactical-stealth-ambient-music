// Import Three.js modules
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { HorizontalBlurShader, ShaderPass, VerticalBlurShader } from 'three/examples/jsm/Addons.js';

document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// #region SCENE OBJECTS

// Add a plane as the ground
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// Add buildings (cubes)
for (let i = 0; i < 100; i++) {
  const buildingGeometry = new THREE.BoxGeometry(
    THREE.MathUtils.randFloat(30, 60),
    THREE.MathUtils.randFloat(30, 60),
    THREE.MathUtils.randFloat(30, 60)
  );
  const buildingMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc }); //{ color: Math.random() * 0xffffff }
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.set(
    THREE.MathUtils.randFloat(-250, 250),
    buildingGeometry.parameters.height / 2,
    THREE.MathUtils.randFloat(-250, 250)
  );
  building.castShadow = true;
  building.receiveShadow = true;
  scene.add(building);
}

// #region LIGHTING

// Add light sources
const ambientLight = new THREE.AmbientLight(0x4444444);
scene.add(ambientLight);

const spotlight = new THREE.PointLight(0x888888);
spotlight.intensity = 10.5;
spotlight.decay = 0.7;
scene.add(spotlight);

// Attach spotlight to the camera
camera.position.set(0, 10, 0);
camera.add(spotlight);
scene.add(camera);

// #region CONTROLS

const velocity = new THREE.Vector3();
const speed = 100;

// FPS Controls
const controls = new PointerLockControls(camera, renderer.domElement);
document.addEventListener('click', () => {
  controls.lock();
});

controls.addEventListener('lock', () => {
  console.log('Pointer locked');
});

controls.addEventListener('unlock', () => {
  console.log('Pointer unlocked');
});

// Movement controls
const movement = { forward: false, backward: false, left: false, right: false };
document.addEventListener('keydown', (event) => {
  switch (event.code) {
    case 'KeyW':
      movement.forward = true;
      break;
    case 'KeyS':
      movement.backward = true;
      break;
    case 'KeyA':
      movement.left = true;
      break;
    case 'KeyD':
      movement.right = true;
      break;
  }
});

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'KeyW':
      movement.forward = false;
      break;
    case 'KeyS':
      movement.backward = false;
      break;
    case 'KeyA':
      movement.left = false;
      break;
    case 'KeyD':
      movement.right = false;
      break;
  }
});

// #region POSTPROCESSING

// Postprocessing setup
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);


const blurVerticalShader = new ShaderPass(VerticalBlurShader);
composer.addPass(blurVerticalShader);

const blurHorizontalShader = new ShaderPass(HorizontalBlurShader);
composer.addPass(blurHorizontalShader);

// Film grain pass
const filmPass = new FilmPass(2, false);
composer.addPass(filmPass);

// #region ANIMATION

// Animation loop
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (controls.isLocked) {
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    if (movement.forward) velocity.z -= speed * delta;
    if (movement.backward) velocity.z += speed * delta;
    if (movement.left) velocity.x -= speed * delta;
    if (movement.right) velocity.x += speed * delta;

    controls.moveRight(velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
		
		camera.position.y = 5 + 0.2 * velocity.length();
  }

  composer.render(delta);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});