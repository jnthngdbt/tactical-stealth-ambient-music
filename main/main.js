import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as shader from '/shader.js';

// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set background color
scene.background = new THREE.Color(0x111122);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // for smooth controls
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI;

// Custom Shader Material using external shaders
const shaderMaterial = new THREE.ShaderMaterial({
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
});

// Create plane
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, opacity: 0.04, transparent: true, depthWrite: false });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -0.01; // Slightly lower the plane to avoid z-fighting
scene.add(plane);

// Function to create an elongated cube
function createElongatedCube(x, z, sx, sy, sz) {
    const geometry = new THREE.BoxGeometry(sx, sy, sz); // Elongated in Z direction
    const cube = new THREE.Mesh(geometry, shaderMaterial);
    cube.position.set(x, sy/2, z);
    scene.add(cube);
}

// Add 3 elongated cubes
createElongatedCube(-4, 0, 3, 1, 5);
createElongatedCube(0, 0, 2, 1, 4);
createElongatedCube(4, 0, 4, 1, 7);

// Set camera position
camera.position.set(0, 10, 15);
controls.update();

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});