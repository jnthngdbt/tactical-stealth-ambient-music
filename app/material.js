import * as THREE from 'three';

// Default material.
export const base = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: vertexShader(),
    fragmentShader: fragmentShaderGray(0.5, 0.1),
});

export const active = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: vertexShader(),
    fragmentShader: fragmentShaderGray(0.5, 0.35),
});

export const highlight = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(1.0, 0.5, 1.0, 0.25),
});

function fragmentShaderGray(gray, a) {
    return fragmentShader(gray, gray, gray, a);
}

function fragmentShader(r, g, b, a) {
    return `
        // XRAY
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
            // Normalize the normal and view direction
            vec3 normal = normalize(vNormal);
            vec3 viewDir = normalize(-vViewPosition);  // In view space, view position is the inverse of camera direction

            // Calculate the dot product to get the angle between the normal and view direction
            float dotProduct = abs(dot(normal, viewDir));

            // Set the alpha based on how aligned the normal is with the view direction
            float alpha = ${0.85 * a} * smoothstep(0.0, 1.0, dotProduct); // Adjust the range as needed
            
            // Set the final color, for simplicity we'll use white
            gl_FragColor = vec4(${r}, ${g}, ${b}, ${a} - alpha); // Use alpha for transparency
        }
        `;
}

function vertexShader(shear = 0.0) {
    return `
        // XRAY
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
            // XRAY
            vNormal = normalize(normalMatrix * normal); // Transform normal to view space
            vViewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        
            // SHEAR
            float shear = ${shear.toFixed(2)};
            vec4 shearedPosition = vec4(position, 1.0);
            shearedPosition.y += shear * shearedPosition.z;

            // Standard transformation for the vertex
            gl_Position = projectionMatrix * modelViewMatrix * shearedPosition;
        }
        `;
}
