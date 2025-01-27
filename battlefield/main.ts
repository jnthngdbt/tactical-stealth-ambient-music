// Import Three.js modules
import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/Addons.js';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const assetsPath = 'https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/';

const scene = createScene(0x1E1731);
const camera = createCamera();
const renderer = createRenderer();

const perlin = createPerlin();

const canyonDepth = 800;

const ground = createGround(0xcccccc);
const mountain = createMountain();

const ambientLight = createAmbientLight(0x443355);
const moonLight = createMoonLight(0x666699);
const { fireLights, animateFireLights } = createFireLights(0xff5500);

const smokeParticleCount = 100;
const smokeMinX = -50;
const smokeMaxX = 50;
const smokeMinY = -100;
const smokeMaxY = 100;
const smokeNear = 20;
const smokeFar = 100;
const { smokeSystem, smokeParticles, smokeVelocities } = createSmoke(0.1);

const controlsSpeed = 20;
const { controls, movement } = createControls();

const composer = createPostprocessing();

const clock = new THREE.Clock();

function animate() {
	requestAnimationFrame(animate);

	const delta = clock.getDelta();
	animateFireLights();
	animateControls(delta);
	animateSmoke(delta);

	composer.render(delta);
}

animate();

// #region SCENE

function createScene(color: number) {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(color);
	return scene;
}

// #region CAMERA

function createCamera() {
	const camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 10000);
	camera.position.set(0, 2, -1);
	camera.rotateY(-Math.PI / 60);
	camera.rotateX(Math.PI / 15);

	scene.add(camera);

	return camera;
}

// #region RENDERER

function createRenderer() {
	const renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	return renderer;
}

// #region NOISE

function createPerlin() {
	const textureLoader = new THREE.TextureLoader();
	const perlin = textureLoader.load(assetsPath + 'textures/noise-perlin-0.png');
	return perlin;
}

// #region GROUND

function createGround(color: number) {
	perlin.wrapS = THREE.RepeatWrapping; // Allow tiling
	perlin.wrapT = THREE.RepeatWrapping;
	perlin.repeat.set(40, 40); // Adjust tiling scale

	// Add a plane as the ground
	const groundGeometry = new THREE.PlaneGeometry(20, 5, 100, 100);
	const groundMaterial = new THREE.MeshStandardMaterial({
		color: color, bumpMap: perlin, bumpScale: 0.7
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

	return ground;
}

// #region MOUNTAIN

function createMountain() {
	perlin.repeat.set(0.5, 0.3); // Adjust tiling scale
	const mountainGeometry = new THREE.PlaneGeometry(6000, 2000, 500, 500);
	const mountainMaterial = new THREE.MeshStandardMaterial({
		color: 0xcccccc, displacementMap: perlin, displacementScale: 500, bumpMap: perlin, bumpScale: 500,
	});

	const mountain = new THREE.Mesh(mountainGeometry, mountainMaterial);
	mountain.rotation.x = -Math.PI / 4;
	mountain.position.z = -800;
	mountain.position.y = -200;
	mountain.receiveShadow = true;
	scene.add(mountain);

	return mountain;
}

// #region LIGHTING

function createAmbientLight(color: number) {
	const light = new THREE.AmbientLight(color);
	scene.add(light);
	return light;
}

function createMoonLight(color: number) {
	const light = new THREE.DirectionalLight(color, 0.5);
	light.position.set(-50, 10, -10);
	scene.add(light);
	return light;
}

function createFireLights(color: number) {
	const minIntensity = 5;
	const decay = 0.5;
	const maxDistance = 1500;

	const fireLights: THREE.PointLight[] = [];
	for (let i = 0; i < 10; i++) {
		const light = new THREE.PointLight(color, minIntensity, maxDistance, decay);
		light.position.set(
			(Math.random() - 0.5) * 100,
			Math.random() * -10 - canyonDepth,
			Math.random() * -30 - 10
		);
		scene.add(light);
		fireLights.push(light);
	}

	// const animateFireLights = () => { };
	// Light Flickering Animation
	const flickerSmoothness = 0.9;
	const animateFireLights = () => {
		fireLights.forEach((light) => {
			const flicker = Math.random() * minIntensity;
			light.intensity = flickerSmoothness * light.intensity + (1.0 - flickerSmoothness) * flicker;
		});
	};

	return { fireLights, animateFireLights };
}

// #region SMOKE

function createSmoke(speed: number) {
	// Particle geometry and material
	let smokeParticles = new THREE.BufferGeometry();
	const smokePositions = new Float32Array(smokeParticleCount * 3);
	let smokeVelocities = new Float32Array(smokeParticleCount);

	for (let i = 0; i < smokeParticleCount; i++) {
		smokePositions[i * 3 + 0] = Math.random() * (smokeMaxX - smokeMinX) - smokeMinX;
		smokePositions[i * 3 + 1] = Math.random() * (smokeMaxY - smokeMinY) - smokeMinY;
		smokePositions[i * 3 + 2] = Math.random() * -(smokeFar - smokeNear) - smokeNear;
		smokeVelocities[i] = 0.001 + Math.random() * speed;  // Rising speed
	}

	smokeParticles.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));

	// Shader material
	const particleMaterial = new THREE.ShaderMaterial({
		uniforms: {
			u_color: { value: new THREE.Color(0xcccccc) },
			u_minHeight: { value: -canyonDepth },
			u_maxHeight: { value: 10.0 },
			u_texture: { value: new THREE.TextureLoader().load(assetsPath + 'textures/smoke1.png') }, // open game art
		},
		vertexShader: `
      varying float v_height;
      void main() {
        gl_PointSize = 1000.0;
				v_height = position.y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
		fragmentShader: `
      uniform sampler2D u_texture;
      uniform vec3 u_color;
			uniform float u_minHeight;
			uniform float u_maxHeight;
      varying float v_height;
      void main() {
        vec4 textureColor = texture2D(u_texture, gl_PointCoord);

				float opacity = max(0.0, 0.4 * (1.0 - (v_height - u_minHeight) / (u_maxHeight - u_minHeight)));

        gl_FragColor = vec4(u_color, textureColor.a * opacity) * textureColor;
      }
    `,
		transparent: true,
		depthWrite: false,
	});

	// Particle system
	let smokeSystem = new THREE.Points(smokeParticles, particleMaterial);
	scene.add(smokeSystem);

	return { smokeSystem, smokeParticles, smokeVelocities };
}

// #region CONTROLS

function createControls() {
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

	return { controls, movement };
}

// #region POSTPROCESSING

function createPostprocessing() {
	const composer = new EffectComposer(renderer);
	const renderPass = new RenderPass(scene, camera);
	composer.addPass(renderPass);
	return composer;
}

// #region ANIMATION

const controlsVelocity = new THREE.Vector3();

function animateControls(delta: number) {
	if (controls.isLocked) {
		controlsVelocity.x -= controlsVelocity.x * 15.0 * delta; // sideways
		controlsVelocity.z -= controlsVelocity.z * 10.0 * delta; // forward-backward

		if (movement.forward) controlsVelocity.z -= controlsSpeed * delta;
		if (movement.backward) controlsVelocity.z += controlsSpeed * delta;
		if (movement.left) controlsVelocity.x -= controlsSpeed * delta;
		if (movement.right) controlsVelocity.x += controlsSpeed * delta;

		// Normalize the movement vector if moving diagonally
		const movementEpsilon = 0.1;
		const isDiagMove =
			Math.abs(controlsVelocity.x) > movementEpsilon &&
			Math.abs(controlsVelocity.z) > movementEpsilon;
		const diagMoveNormalization = isDiagMove ? 0.707 : 1.0;

		controls.moveRight(controlsVelocity.x * diagMoveNormalization * delta);
		controls.moveForward(-controlsVelocity.z * diagMoveNormalization * delta);
	}
}

function animateSmoke(delta: number) {
	const positions = smokeParticles.attributes.position.array as Float32Array;
	for (let i = 0; i < smokeParticleCount; i++) {
		positions[i * 3 + 1] += smokeVelocities[i]; // move upward....
		positions[i * 3 + 0] -= smokeVelocities[i]; // ...oblique

		// Reset position if the particle moves too high
		if (positions[i * 3 + 1] > smokeMaxY) {
			positions[i * 3 + 1] = smokeMinY;
			positions[i * 3 + 0] = Math.random() * (smokeMaxX - smokeMinX) - smokeMinX;
		}
	}
	smokeParticles.attributes.position.needsUpdate = true;
}

// #region WINDOW

window.addEventListener('resize', () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
	composer.setSize(window.innerWidth, window.innerHeight);
});

// #region DOWNLOAD

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