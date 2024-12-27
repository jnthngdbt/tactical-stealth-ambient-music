import * as THREE from 'three';

const PixelatedNoiseMaterial = new THREE.ShaderMaterial({
  uniforms: {
    resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    pixelSize: { value: 3 },
    time: { value: 0.0 },
    noiseIntensity: { value: 0.08 },
    diffuseTexture: { value: null }, // Renamed to avoid conflict
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform vec2 resolution;
    uniform float pixelSize;
    uniform float time;
    uniform float noiseIntensity;
    uniform sampler2D diffuseTexture; // Renamed
    varying vec2 vUv;

    // Generate random noise
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
      // Sample the texture normally, without pixelation
      vec4 texColor = texture2D(diffuseTexture, vUv);

      // Calculate pixelation size and coordinates
      vec2 dxy = pixelSize / resolution;
      vec2 coord = dxy * floor(vUv / dxy);

      // Add pixelated noise
      float noise = random(coord * time) * noiseIntensity;
      texColor.rgb += noise;

      gl_FragColor = texColor;
    }
  `,
});


export default PixelatedNoiseMaterial;
