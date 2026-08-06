import * as THREE from 'three';
import * as CONST from '../constants.ts';

// Polyline connecting the objectives in order. Vertex colors reveal the
// route progressively as the mission advances, like a route drawn on a map.
export class MissionPath extends THREE.Line {
	private colors: Float32Array;
	private vertexCount: number;

	constructor(points: THREE.Vector3[]) {
		const raised = points.map((p) => new THREE.Vector3(p.x, 0.15, p.z));
		const geometry = new THREE.BufferGeometry().setFromPoints(raised);

		const colors = new Float32Array(raised.length * 3);
		geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

		const material = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 });

		super(geometry, material);

		this.colors = colors;
		this.vertexCount = raised.length;
		this.setProgress(0);
	}

	// progress: 0..(vertexCount - 1), how far along the route has been "walked".
	public setProgress(progress: number) {
		const idle = new THREE.Color(CONST.PATH_IDLE_COLOR);
		const active = new THREE.Color(CONST.ACCENT_COLOR);

		for (let i = 0; i < this.vertexCount; i++) {
			const t = THREE.MathUtils.clamp(progress - i, 0, 1);
			const color = idle.clone().lerp(active, t);
			this.colors[i * 3] = color.r;
			this.colors[i * 3 + 1] = color.g;
			this.colors[i * 3 + 2] = color.b;
		}

		(this.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
	}
}
