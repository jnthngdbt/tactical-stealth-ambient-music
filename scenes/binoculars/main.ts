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

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();