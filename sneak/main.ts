// Import Three.js modules
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { HorizontalBlurShader, ShaderPass, VerticalBlurShader } from 'three/examples/jsm/Addons.js';

document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

const scene = new THREE.Scene();

// #region CAMERA 

const minStand = 5;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, minStand, 0);

// #region RENDERER

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// #region OBJECTS

// Add a plane as the ground
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });

const floor = new THREE.Mesh(planeGeometry, planeMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const ceiling = floor.clone();
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 20;
scene.add(ceiling);

// Add buildings (cubes)
const rangeX = 200;
const rangeZ = 400;
for (let i = 0; i < 100; i++) {
  const buildingGeometry = new THREE.BoxGeometry(
    THREE.MathUtils.randFloat(30, 60),
    THREE.MathUtils.randFloat(30, 60),
    THREE.MathUtils.randFloat(30, 60)
  );
  const buildingMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc }); //{ color: Math.random() * 0xffffff }
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.set(
    THREE.MathUtils.randFloat(-rangeX, rangeX),
    buildingGeometry.parameters.height / 2,
    THREE.MathUtils.randFloat(-rangeZ, rangeZ)
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
camera.add(spotlight);
scene.add(camera);

// #region CONTROLS

const velocity = new THREE.Vector3();

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

// #region WHEEL SPEED

const scrollZoomSpeedFactor = 0.01;
const wheelFactor = 5;
const minSpeed = 10;
const standFactor = 0.1;
const speedFactor = 5;
var wheel = 0;
var stand = minStand;
var speed = minSpeed;

window.addEventListener("wheel", (event) => {
	wheel = Math.max(wheel - event.deltaY * scrollZoomSpeedFactor, 0);
	stand = minStand + standFactor * wheel * wheelFactor;
	speed = Math.max(speedFactor * wheel * wheelFactor, minSpeed);
	console.log(speed);
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
		
		camera.position.y = stand;
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