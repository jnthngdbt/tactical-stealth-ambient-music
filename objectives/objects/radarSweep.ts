import * as THREE from 'three';
import * as CONST from '../constants.ts';

// A rotating radar-sweep wedge over the map for tactical-scanner flavor.
export class RadarSweep extends THREE.Mesh {
	constructor(radius: number) {
		const sweepAngle = Math.PI / 6;
		const geometry = new THREE.CircleGeometry(radius, 64, 0, sweepAngle);
		const material = new THREE.MeshBasicMaterial({
			color: CONST.ACCENT_COLOR,
			transparent: true,
			opacity: 0.015,
			depthWrite: false,
			side: THREE.DoubleSide,
		});
		super(geometry, material);
		this.rotation.x = -Math.PI / 2;
		this.position.y = 0.03;
	}

	public update(time: number, speed = 0.35) {
		this.rotation.z = -time * speed;
	}
}
