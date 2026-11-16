import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import * as CONST from './constants.ts';

interface NightGradingOptions {
	exposure?: number;
	tint?: number;
	saturation?: number;
	vignette?: number;
	contrast?: number;
	grain?: number;
}

// Post-process pass that fakes "night" over imagery that was actually
// captured in daylight: darkens and desaturates the frame, pushes it toward
// a cool moonlight tint, and darkens the edges with a vignette. Runs after
// bloom so glowing operators keep their punch while the terrain goes dark.
// A luma contrast curve then separates lit surfaces (paths, roofs) from
// shadow (trees, water) so the dimmed frame keeps depth instead of sitting in
// one flat murky band, and animated sensor grain makes it read as a live
// low-light camera feed rather than a clean render.
export class NightGradingPass extends ShaderPass {
	constructor({
		exposure = 0.32,
		tint = 0x1c3a4a,
		saturation = 0.5,
		vignette = 0.6,
		contrast = CONST.NIGHT_CONTRAST,
		grain = CONST.NIGHT_GRAIN,
	}: NightGradingOptions = {}) {
		super({
			uniforms: {
				tDiffuse: { value: null },
				exposure: { value: exposure },
				tint: { value: new THREE.Color(tint) },
				saturation: { value: saturation },
				vignette: { value: vignette },
				contrast: { value: contrast },
				contrastPivot: { value: CONST.NIGHT_CONTRAST_PIVOT },
				grain: { value: grain },
				time: { value: 0 },
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
				uniform float contrast;
				uniform float contrastPivot;
				uniform float grain;
				uniform float time;
				varying vec2 vUv;

				float hash(vec2 p) {
					vec3 p3 = fract(vec3(p.xyx) * 0.1031);
					p3 += dot(p3, p3.yzx + 33.33);
					return fract((p3.x + p3.y) * p3.z);
				}

				void main() {
					vec4 color = texture2D(tDiffuse, vUv);

					vec3 graded = color.rgb * exposure;
					float luma = dot(graded, vec3(0.299, 0.587, 0.114));
					graded = mix(vec3(luma), graded, saturation);
					graded = mix(graded, graded * tint * 2.0, 0.65);

					// power curve on luma around a pivot: darker than the pivot sinks,
					// brighter lifts, black stays black and hue is untouched
					float l = dot(graded, vec3(0.299, 0.587, 0.114));
					float curved = contrastPivot * pow(l / contrastPivot, contrast);
					graded *= curved / max(l, 1e-5);

					float dist = distance(vUv, vec2(0.5));
					float vig = smoothstep(0.85, 0.25, dist * (1.0 + vignette));
					graded *= mix(1.0 - vignette, 1.0, vig);

					// sensor noise, re-rolled ~24x/sec; partly additive so it stays
					// visible in the shadows, where a real low-light sensor is noisiest
					float n = hash(gl_FragCoord.xy + floor(time * 24.0) * 37.0) - 0.5;
					graded += n * grain * (0.02 + graded);

					gl_FragColor = vec4(graded, color.a);
				}
			`,
		});
	}
}
