// Import Three.js modules
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

document.body.style.margin = '0';
document.body.style.overflow = 'hidden';

const assetsPath = 'https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/';

// #region COLORS

// #region CONSTANTS

// #region SCENE

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050011);

// #region CAMERA 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 0);

scene.add(camera);

// #region LIGHTING

// Add light sources
const ambientLight = new THREE.AmbientLight(0x131122);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0x7700ff, 0.5);
moonLight.position.set(-50, 10, -10);
scene.add(moonLight);

// Flickering Lights (Explosions)
const fireLights: THREE.PointLight[] = [];
for (let i = 0; i < 10; i++) {
	const light = new THREE.PointLight(0xff5500, 10, 0, 1.6);
	light.position.set(
		(Math.random() - 0.5) * 100,
		Math.random() * -10 - 5,
		Math.random() * -30 - 10
	);
	scene.add(light);
	fireLights.push(light);
}

// #region RENDERER

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// #region SHADERS

// #region GROUND

const textureLoader = new THREE.TextureLoader();
const bumpMap = textureLoader.load(assetsPath + "textures/noise-perlin-0.png");
bumpMap.wrapS = THREE.RepeatWrapping; // Allow tiling
bumpMap.wrapT = THREE.RepeatWrapping;
bumpMap.repeat.set(40, 40); // Adjust tiling scale

// Add a plane as the ground
const groundGeometry = new THREE.PlaneGeometry(20, 5, 100, 100);
const groundMaterial = new THREE.MeshStandardMaterial({
	color: 0xcccccc, bumpMap: bumpMap, bumpScale: 0.7
});

// Apply noise to vertices
const position = groundGeometry.attributes.position;
for (let i = 0; i < position.count; i++) {
	const z = Math.random() * 0.05; // Add ruggedness
	position.setZ(i, z);
}
position.needsUpdate = true; // Notify Three.js of changes
groundGeometry.computeVertexNormals(); // Recompute normals for lighting

const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.z = -2;
ground.receiveShadow = true;
scene.add(ground);

// #region MOUNTAIN

bumpMap.repeat.set(0.5, 0.3); // Adjust tiling scale
const mountainGeometry = new THREE.PlaneGeometry(300, 100, 500, 500);
const mountainMaterial = new THREE.MeshStandardMaterial({
	color: 0xcccccc, displacementMap: bumpMap, displacementScale: 50, bumpMap: bumpMap, bumpScale: 50
});

const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
mountain.rotation.x = -Math.PI / 4;
mountain.position.z = -80;
mountain.position.y = -20;
mountain.receiveShadow = true;
scene.add(mountain);

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

// #region ANIMATION

// Light Flickering Animation
const animateLights = () => {
	fireLights.forEach((light) => {
		light.intensity = 0.5 + Math.random() * 2.5; // Flicker effect
	});
};

const clock = new THREE.Clock();
const velocity = new THREE.Vector3();
const speed = 20;

// Animation loop
function animate() {
	requestAnimationFrame(animate);
	animateLights();

	const delta = clock.getDelta();

	if (controls.isLocked) {
		velocity.x -= velocity.x * 15.0 * delta; // sideways
		velocity.z -= velocity.z * 10.0 * delta; // forward-backward

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