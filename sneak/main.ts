// Import Three.js modules
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { HorizontalBlurShader, OBJLoader, ShaderPass, VerticalBlurShader } from 'three/examples/jsm/Addons.js';

document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

// #region COLORS

const useInfrared = true;
const infraredGain = 1.0;
const colorInfrared = 0xffffff;

var isInfraredProjectorOn = true;

const blurAmount = 1.0 / 1000.0; // default is 1.0 / 512.0

function convertToInfrared(originalHex: number): THREE.Color {
	const original = new THREE.Color(originalHex);
	if (!useInfrared) return new THREE.Color(original);
	const luminescence = infraredGain * (original.r * 0.3 + original.g * 0.59 + original.b * 0.11);
	const tint = new THREE.Color(colorInfrared);
	return new THREE.Color(luminescence * tint.r, luminescence * tint.g, luminescence * tint.b);
}

const colorSky = convertToInfrared(0x01010E);
const colorGround = convertToInfrared(0x88837D);
const colorBuilding = convertToInfrared(0x8A8782);
const colorDoor = convertToInfrared(0x6A6762);
const colorDoorHandle = convertToInfrared(0x888888);
const colorGoggleLight = convertToInfrared(0xcccccc);
const colorAmbientLight = convertToInfrared(0x333333);
const colorTree = convertToInfrared(0x555555);
const colorTarget = 0xffffff;

const assetsPath = 'https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/';

// #region CONSTANTS

// Scene ranges.
const rangeBuffer = 200;
const buildingRangeX = 250;
const buildingRangeZ = 250;
const environmentRangeX = rangeBuffer + buildingRangeX;
const environmentRangeZ = rangeBuffer + buildingRangeZ;
const groundRangeX = rangeBuffer + environmentRangeX;
const groundRangeZ = rangeBuffer + environmentRangeZ;
const targetRangeX = 1.2 * buildingRangeX;
const targetRangeZ = 1.2 * buildingRangeZ;

// Terrain.
const terrainResolution = 512;

// Buildings.
const buildingMinSize = 10;
const buildingMaxSize = 30;
const buildingMinHeight = 4;
const buildingMaxHeight = 20;
const buidingLightmapIntensity = 20.0;
const bigBuildingHeightThreshold = 12;
const buildingLightsSpacing = 10.0; // m

// Player.
const spawnPositionX = buildingRangeX / 2 + 25;
const spawnPositionZ = buildingRangeZ / 2 + 25;
const bobbingSpeed = 8;
const bobbingAmplitudeVertical = 0.035;

// Infrared.
const infraredProjectorIntensity = 10.5;
const infraredProjectorDecay = 0.5; // smaller is more intense

// Intensity (wheel).
const scrollZoomSpeedFactor = 0.01; // using mouse, event.deltaY is 100 or -100
const minIntensity = 0.0;
const maxIntensity = 10.0;
const initIntensity = maxIntensity;
const minSpeed = 2.0;
const maxSpeed = 30.0;
const minStand = 1.0;
const maxStand = 1.0;
const standFactor = (maxStand - minStand) / (maxIntensity - minIntensity);
const speedFactor = (maxSpeed - minSpeed) / (maxIntensity - minIntensity);

// Target heart.
const heartBeatSignal = [
	1, 1.5, 1.2, 1, 0.8, 1, // Beat
	1, 1, 1,                 // Rest
	1.2, 1.5, 1.2, 1, 0.8, 1, // Beat
	1, 1, 1                  // Rest
];
const heartBeatDuration = 2; // Total duration for one cycle in seconds
const heartBeatSamplesPerSecond = heartBeatSignal.length / heartBeatDuration;

// #region SCENE

const scene = new THREE.Scene();
scene.background = new THREE.Color(colorSky);

// #region WHEEL INTENSITY

var intensity = initIntensity; // corresponds to mouse wheel value
var stand = computeStand(); // camera stand height
var speed = computeSpeed(); // camera movement speed

window.addEventListener("wheel", (event) => {
	intensity = THREE.MathUtils.clamp(intensity - event.deltaY * scrollZoomSpeedFactor, minIntensity, maxIntensity);
	stand = computeStand();
	speed = computeSpeed();
});

function computeSpeed() {
	return minSpeed + speedFactor * intensity;
}

function computeStand() {
	return minStand + standFactor * intensity;
}

// #region CAMERA 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(spawnPositionX, stand, spawnPositionZ);
camera.lookAt(0, 0, 0);

// #region LIGHTING

function getInfraredProjectorIntensity(): number {
	return isInfraredProjectorOn ? infraredProjectorIntensity : 0;
}

// Add light sources
const ambientLight = new THREE.AmbientLight(colorAmbientLight);
scene.add(ambientLight);

const spotlight = new THREE.PointLight(colorGoggleLight);
spotlight.intensity = getInfraredProjectorIntensity();
spotlight.decay = infraredProjectorDecay;
scene.add(spotlight);

// Attach spotlight to the camera
camera.add(spotlight);
scene.add(camera);

// #region RENDERER

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// #region GROUND

const textureLoader = new THREE.TextureLoader();
const bumpMap = textureLoader.load(assetsPath + "textures/noise-perlin-0.png");
bumpMap.wrapS = THREE.RepeatWrapping; // Allow tiling
bumpMap.wrapT = THREE.RepeatWrapping;
bumpMap.repeat.set(40, 40); // Adjust tiling scale

// Add a plane as the ground
const planeGeometry = new THREE.PlaneGeometry(groundRangeX, groundRangeZ, terrainResolution, terrainResolution);
const planeMaterial = new THREE.MeshStandardMaterial({ 
	color: colorGround, bumpMap: bumpMap, bumpScale: 0.7 });

// Apply noise to vertices
const position = planeGeometry.attributes.position;
for (let i = 0; i < position.count; i++) {
  const z = Math.random() * 0.1; // Add ruggedness
  position.setZ(i, z);
}
position.needsUpdate = true; // Notify Three.js of changes
planeGeometry.computeVertexNormals(); // Recompute normals for lighting

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

// #region BUILDINGS

const objLoader = new OBJLoader();

var targets: THREE.Mesh[] = [];

const doorMaterial = new THREE.MeshPhongMaterial({ color: colorDoor });
const lightName = useInfrared ? "spotlight-0.png" : "spotlight-warm-0.png";
textureLoader.load(assetsPath + "textures/" + lightName, (lightMapBase) => {
	// Add buildings (cubes)
	for (let i = 0; i < 100; i++) {
		const width = THREE.MathUtils.randFloat(buildingMinSize, buildingMaxSize);
		const height = THREE.MathUtils.randFloat(buildingMinHeight, buildingMaxHeight);
		const depth = THREE.MathUtils.randFloat(buildingMinSize, buildingMaxSize);

		const isBigBuilding = height > bigBuildingHeightThreshold;

		const buildingGeometry = new THREE.BoxGeometry(width, height, depth);

		const material = isBigBuilding ? 
			createLightedFaceMaterials(depth, width, lightMapBase) : 
			new THREE.MeshPhongMaterial({ color: colorBuilding });

		const building = new THREE.Mesh(buildingGeometry, material);

		const position = { 
			x: THREE.MathUtils.randFloat(-buildingRangeX/2, buildingRangeX/2), 
			y: buildingGeometry.parameters.height / 2, 
			z: THREE.MathUtils.randFloat(-buildingRangeZ/2, buildingRangeZ/2) 
		};
		building.position.set(position.x, position.y, position.z);
		building.castShadow = true;
		building.receiveShadow = true;

		// #region DOORS
		for (let j = 0; j < 2; j++) {
			const doorGeometry = new THREE.BoxGeometry(1, 2, 0.1);
			const door = new THREE.Mesh(doorGeometry, doorMaterial);
			const facing = (j < 1 ? 1 : -1)
			const doorRangeOnWall = 0.9 * buildingGeometry.parameters.width / 2;
			door.position.set(
				THREE.MathUtils.randFloat(-doorRangeOnWall, doorRangeOnWall),
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

			// #region TARGETS

			// Add target for big building door			
			const isTargetRange = 
				Math.abs(building.position.x) < targetRangeX / 2 && 
				Math.abs(building.position.z) < targetRangeZ / 2;
			if (isTargetRange) {
				const targetGeometry = new THREE.SphereGeometry(0.01, 32, 32);
				const targetMaterial = new THREE.MeshBasicMaterial({ color: colorTarget, depthTest: false });
				const target = new THREE.Mesh(targetGeometry, targetMaterial);
				target.renderOrder = 1; // render last to be always visible
				target.position.set(1, 0, -facing * 1.5);
				target.userData = { heartSpeed: THREE.MathUtils.randFloat(1.0, 1.5) };
				door.add(target);
				targets.push(target);
			}

			door.add(handle);
			building.add(door);
		}

		scene.add(building);
	}
});

// Create materials for each face of the building
function createLightedFaceMaterials(depth: number, width: number, lightMapBase: THREE.Texture) {
	const lightMaps = [
		lightMapBase.clone(), // Front
		lightMapBase.clone(), // Back
		null, // Top
		null, // Bottom
		lightMapBase.clone(), // Left
		lightMapBase.clone(), // Right
	];

	// Set wrapping for each texture
	lightMaps.forEach((lightMap, index) => {
		if (lightMap === null) return;
		lightMap.wrapS = THREE.RepeatWrapping;
		lightMap.wrapT = THREE.RepeatWrapping;
		const repeat = index === 0 || index === 1 ? // Front or back
			Math.floor(depth / buildingLightsSpacing) : 
			Math.floor(width / buildingLightsSpacing);
		lightMap.repeat.set(repeat, 1);
	});

	// Create materials for each face
	const materials = lightMaps.map((lightMap) => 
		new THREE.MeshPhongMaterial({ 
			color: colorBuilding, 
			lightMap: lightMap, 
			lightMapIntensity: buidingLightmapIntensity }));

	return materials;
}

// #region TREES

// Add bitrunk palm trees
objLoader.load(assetsPath + "models/palmtree-0.obj", (objectBase) => {
		for (let j = 0; j < 1000; j++) {
			const object = objectBase.clone();

			const scale = THREE.MathUtils.randFloat(0.005, 0.02);

			object.scale.set(scale, scale, scale);
			object.position.set(
				THREE.MathUtils.randFloat(-environmentRangeX/2, environmentRangeX/2),
				0,
				THREE.MathUtils.randFloat(-environmentRangeZ/2, environmentRangeZ/2)
			);
			object.rotation.y = THREE.MathUtils.randFloat(0, 2 * Math.PI);
		object.traverse((child) => {
			if (child instanceof THREE.Mesh) {
					child.material = new THREE.MeshStandardMaterial({ color: colorTree }); // Dark gray
			}
		});

			scene.add(object);
		}
	});

// #region CONTROLS

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
		case 'KeyC':
			spotlight.intensity = getInfraredProjectorIntensity();
			isInfraredProjectorOn = !isInfraredProjectorOn;
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
const blurHorizontalShader = new ShaderPass(HorizontalBlurShader);

// Using constant blur factor, otherwise less blur on bigger screens.
blurVerticalShader.uniforms.v.value = blurAmount;
blurHorizontalShader.uniforms.h.value = blurAmount;

composer.addPass(blurVerticalShader);
composer.addPass(blurHorizontalShader);

// Film grain pass
const filmPass = new FilmPass(2, false);
composer.addPass(filmPass);

// #region ANIMATION

const clock = new THREE.Clock();
const velocity = new THREE.Vector3();

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

		// Normalize the movement vector if moving diagonally
		const movementEpsilon = 0.1;
		const isDiagMove = 
			Math.abs(velocity.x) > movementEpsilon && 
			Math.abs(velocity.z) > movementEpsilon;
		const diagMoveNormalization = isDiagMove ? 0.707 : 1.0;

    controls.moveRight(velocity.x * diagMoveNormalization * delta);
    controls.moveForward(-velocity.z * diagMoveNormalization * delta);
		
		// Bobbing effect
		step += delta * bobbingSpeed * velocity.length() * diagMoveNormalization;
		const bobbingVertical = Math.sin(step) * bobbingAmplitudeVertical;
		camera.position.y = stand + bobbingVertical;

		// Targets hearts
		targets.forEach((target) => {
			const heartTime = clock.elapsedTime * heartBeatSamplesPerSecond * target.userData.heartSpeed;
			const sampleIndex = Math.floor(heartTime) % heartBeatSignal.length;
			const scale = 10 * (heartBeatSignal[sampleIndex] - 0.7);
			target.scale.set(scale, scale, scale);
		});
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

// Add event listener to the button to trigger exportScene on click
document.getElementById('downloadBtn')?.addEventListener('click', exportScene);

// Export scene to JSON and download it.
function exportScene() {
	scene.updateMatrixWorld();
	var result = scene.toJSON();
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