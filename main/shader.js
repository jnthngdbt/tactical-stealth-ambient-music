export const fragmentShader = `
    varying vec3 vPosition;
    void main() {
        gl_FragColor = vec4(abs(vPosition), 1.0);
    }
`;

export const vertexShader = `
    varying vec3 vPosition;
    void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;
