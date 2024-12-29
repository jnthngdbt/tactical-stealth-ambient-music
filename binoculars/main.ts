import * as THREE from "three";
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import PixelatedNoiseMaterial from "./PixelatedNoiseMaterial.ts";
import { ControlsManager } from "./controls/ControlsManager.ts";
import { CameraJitter } from "./controls/CameraJitter.ts";

// Scene Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ================================
// #region SCENE IMAGE
// ================================

// Some images for testing:
const images = [
	"jnthngdbt_Dark_theme_heavily_defended_concrete_multi-building_b_2e4dae5c-a670-4c21-a6c0-abe8f0757a25.png", // (big sad complex)
	"jnthngdbt_Dark_theme_heavily_defended_concrete_multi-building_b_f081fe34-33ad-4b6b-bf7d-63a0b79bb8b8.png", // (dam towers)
	"jnthngdbt_Dark_theme_heavily_fortified_concrete_multi-building__71c05842-c354-4d31-bd7c-fc93629f3f38.png", // (cold dam base)
	"jnthngdbt_Heavily_defended_desert_concrete_multi-building_bunke_4e449e81-c3bd-4d08-94ec-aa464fb40833.png", // (daylight 2 silos)
	"jnthngdbt_Heavily_fortified_and_defended_desert_concrete_multi-_0a2ed1db-e1f4-4419-8dbf-ce26f915394e.png", // (trapezoid)
	"jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_74d166ca-8493-4f48-a146-64ca25121cab.png", // (blue house)
	"jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_92a6a60d-4ee6-40bd-82ed-1df5387ec3a8.png", // (spatioport)
	"jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_354daa91-edcb-4e11-a44f-f56a098819f8.png", // (nice gray base)
	"jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_0701d598-e389-4b2a-a124-7589788e4d04.png", // (orange units)
	"jnthngdbt_Midnight_cyberpunk_concrete_multi-building_bunker_com_ce184244-4427-4403-9573-914a55257101.png", // (cozy silos)
	"jnthngdbt_Midnight_futuristic_concrete_multi-building_bunker_co_6cc95bcb-8818-4a4b-882c-8f8367139ad8.png", // (badass waterside)
	"jnthngdbt_Midnight_futuristic_concrete_multi-building_bunker_co_cdcc27e2-b964-4ba4-9990-92acce687e7c.png", // (red industry)
	"jnthngdbt_Midnight_futuristic_concrete_multi-building_bunker_co_cf4c2416-c763-45a1-8ef7-d1381616799a.png", // (sea port)
	"jnthngdbt_Midnight_heavily_defended_desert_concrete_multi-build_4a24248c-3833-4961-bb7f-372992a6cb87.png", // (original structure)
	"jnthngdbt_Midnight_heavily_defended_desert_concrete_multi-build_f0371757-ae87-48d0-b7c5-856f2e4edb59.png", // (moonlike)
];

const host = "https://raw.githubusercontent.com/jnthngdbt/tactical-steath-ambient-music-assets/refs/heads/main/binoculars/high-res/";

var planeSize = new THREE.Vector2(0, 0);
var planeMesh: THREE.Mesh;

const textureLoader = new THREE.TextureLoader();

function loadImage(idx: number) {
	if (idx < 0) imageIndex = images.length - 1;
	else if (idx >= images.length) imageIndex = 0;
	else imageIndex = idx;

	const img = images[imageIndex];

	textureLoader.load(host + img, (texture) => {
		PixelatedNoiseMaterial.uniforms.diffuseTexture.value = texture;
		PixelatedNoiseMaterial.uniforms.resolution.value.set(texture.image.width, texture.image.height);
	
		// Create a plane geometry and material
		const aspectRatio = texture.image.width / texture.image.height;
		planeSize.set(10, 10 / aspectRatio);
		const geometry = new THREE.PlaneGeometry(planeSize.x, planeSize.y);
	
		scene.remove(planeMesh);
		planeMesh = new THREE.Mesh(geometry, PixelatedNoiseMaterial);
		scene.add(planeMesh);
	});
}

// Load the first image
var imageIndex = 3;
loadImage(imageIndex);

document.getElementById('prevImageBtn')?.addEventListener('click', () => loadImage(imageIndex - 1));
document.getElementById('nextImageBtn')?.addEventListener('click', () => loadImage(imageIndex + 1));

// ================================
// #region POST-PROCESSING
// ================================

// Post-Processing Setup
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// Add post-processing passes... (if necessary)

// ================================
// #region CONTROLS
// ================================

// Pan and zoom controls
var navControls = new ControlsManager(window, camera, renderer, composer, planeSize);

// Camera jitter for a shaky effect
var cameraJitter = new CameraJitter(camera, 0.0015, 2);

// ================================
// #region ANIMATION
// ================================

// Clock for time-based animation
const clock = new THREE.Clock();

// Animation Loop
function animate() {
	const time = clock.getElapsedTime();

	PixelatedNoiseMaterial.uniforms.time.value = time;

	navControls.update(time);
	cameraJitter.update(time);

	requestAnimationFrame(animate);

	composer.render();
}

animate();

// Hide the cursor over the canvas
//renderer.domElement.style.cursor = 'none';