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

// #region WHEEL INTENSITY

const scrollZoomSpeedFactor = 0.01; // using mouse, event.deltaY is 100 or -100
const minIntensity = 0.0;
const maxIntensity = 10.0;
const minSpeed = 2.0;
const maxSpeed = 30.0;
const minStand = 1.0;
const maxStand = 1.0;
const standFactor = (maxStand - minStand) / (maxIntensity - minIntensity);
const speedFactor = (maxSpeed - minSpeed) / (maxIntensity - minIntensity);
var intensity = 7.0; // incremental wheel value
var stand = computeStand(); // camera stand height
var speed = computeSpeed(); // camera movement speed

window.addEventListener("wheel", (event) => {
	intensity = THREE.MathUtils.clamp(intensity - event.deltaY * scrollZoomSpeedFactor, minIntensity, maxIntensity);
	stand = computeStand();
	speed = computeSpeed();
	console.log(`wheel: ${intensity}, stand: ${stand}, speed: ${speed}`);
});

function computeSpeed() {
	return minSpeed + speedFactor * intensity;
}

function computeStand() {
	return minStand + standFactor * intensity;
}

// #region CAMERA 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, stand, 0);

// #region RENDERER

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// #region OBJECTS

const colorFloor = 0x888888;
const colorBuilding = 0xcccccc;
const colorDoor = 0xaaaaaa;
const colorDoorHandle = 0x888888;
const colorGoggleLight = 0xcccccc;
const colorSpotlight = 0xffffff;
const colorAmbientLight = 0x444444;

// Add a plane as the ground
const planeGeometry = new THREE.PlaneGeometry(500, 500);
const planeMaterial = new THREE.MeshPhongMaterial({ color: colorFloor });

const floor = new THREE.Mesh(planeGeometry, planeMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const addCeiling = false;
var ceiling = new THREE.Mesh();
if (addCeiling) {
	ceiling = floor.clone();
	ceiling.rotation.x = Math.PI / 2;
	ceiling.position.y = 20;
	scene.add(ceiling);
}

// Add buildings (cubes)
const rangeX = 200;
const rangeZ = 200;
for (let i = 0; i < 100; i++) {
  const buildingGeometry = new THREE.BoxGeometry(
    THREE.MathUtils.randFloat(10, 60),
    THREE.MathUtils.randFloat(4, 20),
    THREE.MathUtils.randFloat(10, 60)
  );
  const buildingMaterial = new THREE.MeshPhongMaterial({ color: colorBuilding, side: THREE.FrontSide }); //{ color: Math.random() * 0xffffff }
  const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
  building.position.set(
    THREE.MathUtils.randFloat(-rangeX, rangeX),
    buildingGeometry.parameters.height / 2,
    THREE.MathUtils.randFloat(-rangeZ, rangeZ)
  );
  building.castShadow = true;
  building.receiveShadow = true;

	// Add doors
	for (let j = 0; j < 4; j++) {
		const doorGeometry = new THREE.BoxGeometry(1, 2, 0.1);
		const doorMaterial = new THREE.MeshPhongMaterial({ color: colorDoor });
		const door = new THREE.Mesh(doorGeometry, doorMaterial);
		const facing =(j < 2 ? 1 : -1)
		door.position.set(
			THREE.MathUtils.randFloat(-buildingGeometry.parameters.width / 2, buildingGeometry.parameters.width / 2),
			doorGeometry.parameters.height / 2 - buildingGeometry.parameters.height / 2 ,
			facing * buildingGeometry.parameters.depth / 2 - facing * 0.9 * 0.5 * doorGeometry.parameters.depth
		);

		// Add door handle
		const handleGeometry = new THREE.BoxGeometry(0.03, 0.25, 0.2);
		const handleMaterial = new THREE.MeshPhongMaterial({ color: colorDoorHandle });
		const handle = new THREE.Mesh(handleGeometry, handleMaterial);
		handle.position.set(
			-0.3 * doorGeometry.parameters.width, // left-right
			-0.05 * doorGeometry.parameters.height,
			0.0,
		);

		door.add(handle);
		building.add(door);
	}

  scene.add(building);
}

// #region LIGHTING

// Add light sources
const ambientLight = new THREE.AmbientLight(colorAmbientLight);
scene.add(ambientLight);

const spotlight = new THREE.PointLight(colorGoggleLight);
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

const clock = new THREE.Clock();

const bobbingSpeed = 0.18;
const bobbingAmplitude = 0.035;
var step = 0; // incremental movement for camera bobbing

// Animation loop
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
		
		step += bobbingSpeed * velocity.length();

		const bobbing = Math.sin(step) * bobbingAmplitude;
		camera.position.y = stand + bobbing;
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