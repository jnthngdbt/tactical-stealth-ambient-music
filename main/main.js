import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        // Create scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true; // for smooth controls
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI;

        // Custom Shader Material
        const shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent,
        });

        // Create plane
        const planeGeometry = new THREE.PlaneGeometry(50, 50);
        const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        scene.add(plane);

        // Function to create an elongated cube
        function createElongatedCube(x, y, z) {
            const geometry = new THREE.BoxGeometry(1, 1, 5); // Elongated in Z direction
            const cube = new THREE.Mesh(geometry, shaderMaterial);
            cube.position.set(x, y, z);
            scene.add(cube);
        }

        // Add 3 elongated cubes
        createElongatedCube(-4, 0.5, 0);
        createElongatedCube(0, 0.5, 0);
        createElongatedCube(4, 0.5, 0);

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