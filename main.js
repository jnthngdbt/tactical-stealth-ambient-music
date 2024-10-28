import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as CONST from './app/constants.js';
import * as OBJECTS from './app/objects.js';
import * as MATERIAL from './app/material.js';

// Create scene and renderer
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(75, 40, 80);

// Set background color
scene.background = new THREE.Color(0x111122);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // for smooth controls
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI;
controls.update();

// Create map layout
scene.add(OBJECTS.floor({ size: [100, 100] }));
scene.add(OBJECTS.room({ position: [0 ,  0], size: [16, 20], name: 'active-1' }));
scene.children[scene.children.length - 1].rotateY(Math.PI);
scene.add(OBJECTS.room({ position: [16,  0], size: [16, 20], name: 'active-2' }));
scene.add(OBJECTS.room({ position: [0 , 20], size: [16, 20], name: 'highlight' }));
scene.add(OBJECTS.room({ position: [0 , 20], size: [16, 20], level: 1 }));
scene.add(OBJECTS.room({ position: [16 , 20], size: [16, 20], level: 1 }));

scene.getObjectByName('highlight').material = MATERIAL.highlight;
scene.getObjectByName('active-1').material = MATERIAL.active;
scene.getObjectByName('active-2').material = MATERIAL.active;

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

// Export scene to JSON and download it.
function exportScene() {
    scene.updateMatrixWorld();
    var result=scene.toJSON();
    var jsonStr =JSON.stringify(result);

    // Create a downloadable link for the exported scene
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'tsam.three.js.scene.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Add event listener to the button to trigger exportScene on click
document.getElementById('downloadBtn').addEventListener('click', exportScene);
