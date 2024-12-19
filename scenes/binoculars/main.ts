import * as THREE from "three";

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

// Load an Image Texture
const textureLoader = new THREE.TextureLoader();
textureLoader.load("https://cdn.midjourney.com/4a24248c-3833-4961-bb7f-372992a6cb87/0_0.png", (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace; // Ensure texture is in sRGB

  // Create a plane geometry and material
  const aspectRatio = texture.image.width / texture.image.height;
  const geometry = new THREE.PlaneGeometry(10, 10 / aspectRatio); // Maintain aspect ratio
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const plane = new THREE.Mesh(geometry, material);

  scene.add(plane);
});

// Resize Handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

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
    camera.position.x = startCameraPosition.x + deltaX * camera.position.z * 2;
    camera.position.y = startCameraPosition.y - deltaY * camera.position.z * 2;
  }
});

window.addEventListener("mouseup", () => {
  isPanning = false;
});

// Zoom using scroll wheel
window.addEventListener("wheel", (event) => {
  var scrollZoomSpeedFactor = 0.001;
  camera.position.z += event.deltaY * scrollZoomSpeedFactor * camera.position.z; // Adjust zoom speed
  camera.position.z = THREE.MathUtils.clamp(camera.position.z, 0.5, 10); // Clamp zoom levels
});

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();