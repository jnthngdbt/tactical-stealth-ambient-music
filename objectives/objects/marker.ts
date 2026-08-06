import * as THREE from 'three';
import * as CONST from '../constants.ts';

export type MarkerState = 'pending' | 'active' | 'done';

// A pin marking an objective on the map: a ground ring plus a vertical
// beacon beam. Color and pulse react to the mission's current state.
export class ObjectiveMarker extends THREE.Group {
	private ring: THREE.Mesh;
	private ringMaterial: THREE.MeshBasicMaterial;
	private beacon: THREE.Mesh;
	private beaconMaterial: THREE.MeshBasicMaterial;
	private currentColor = new THREE.Color(CONST.MARKER_IDLE_COLOR);

	constructor({ position, height = 26 }: { position: THREE.Vector3; height?: number }) {
		super();

		this.ringMaterial = new THREE.MeshBasicMaterial({
			color: CONST.MARKER_IDLE_COLOR,
			transparent: true,
			opacity: 0.25,
			side: THREE.DoubleSide,
			depthWrite: false,
		});
		this.ring = new THREE.Mesh(new THREE.RingGeometry(2.2, 2.8, 40), this.ringMaterial);
		this.ring.rotation.x = -Math.PI / 2;
		this.ring.position.y = 0.05;

		this.beaconMaterial = new THREE.MeshBasicMaterial({
			color: CONST.MARKER_IDLE_COLOR,
			transparent: true,
			opacity: 0.16,
			depthWrite: false,
		});
		this.beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, height, 8, 1, true), this.beaconMaterial);
		this.beacon.position.y = height / 2;

		this.add(this.ring);
		this.add(this.beacon);
		this.position.copy(position);
	}

	public update(state: MarkerState, pulse: number, delta: number) {
		const target =
			state === 'done' ? CONST.MARKER_DONE_COLOR : state === 'active' ? CONST.ACCENT_COLOR : CONST.MARKER_IDLE_COLOR;
		this.currentColor.lerp(new THREE.Color(target), Math.min(1, delta * 4));

		const opacity = state === 'active' ? 0.55 + 0.35 * pulse : state === 'done' ? 0.4 : 0.22;
		const scale = state === 'active' ? 1 + 0.18 * pulse : 1;

		this.ringMaterial.color.copy(this.currentColor);
		this.ringMaterial.opacity = opacity;
		this.beaconMaterial.color.copy(this.currentColor);
		this.beaconMaterial.opacity = opacity * 0.55;
		this.ring.scale.setScalar(scale);
	}
}
