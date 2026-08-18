import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

interface NightGradingOptions {
	exposure?: number;
	tint?: number;
	saturation?: number;
	vignette?: number;
}

// Post-process pass that fakes "night" over imagery that was actually
// captured in daylight: darkens and desaturates the frame, pushes it toward
// a cool moonlight tint, and darkens the edges with a vignette. Runs after
// bloom so glowing operators keep their punch while the terrain goes dark.
export class NightGradingPass extends ShaderPass {
	constructor({ exposure = 0.32, tint = 0x1c3a4a, saturation = 0.5, vignette = 0.6 }: NightGradingOptions = {}) {
		super({
			uniforms: {
				tDiffuse: { value: null },
				exposure: { value: exposure },
				tint: { value: new THREE.Color(tint) },
				saturation: { value: saturation },
				vignette: { value: vignette },
			},
			vertexShader: /* glsl */ `
				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: /* glsl */ `
				uniform sampler2D tDiffuse;
				uniform float exposure;
				uniform vec3 tint;
				uniform float saturation;
				uniform float vignette;
				varying vec2 vUv;

				void main() {
					vec4 color = texture2D(tDiffuse, vUv);

					vec3 graded = color.rgb * exposure;
					float luma = dot(graded, vec3(0.299, 0.587, 0.114));
					graded = mix(vec3(luma), graded, saturation);
					graded = mix(graded, graded * tint * 2.0, 0.65);

					float dist = distance(vUv, vec2(0.5));
					float vig = smoothstep(0.85, 0.25, dist * (1.0 + vignette));
					graded *= mix(1.0 - vignette, 1.0, vig);

					gl_FragColor = vec4(graded, color.a);
				}
			`,
		});
	}
}
