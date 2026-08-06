import * as THREE from 'three';
import * as CONST from '../constants.ts';
import { BuildingDef } from '../mission.ts';

// A compound structure rendered as a translucent hologram-style volume with
// glowing wireframe edges. The edge color eases towards the accent color
// while the building is the current objective's target.
export class Building extends THREE.Group {
	private edges: THREE.LineSegments;
	private baseColor = new THREE.Color(CONST.BUILDING_EDGE_COLOR);
	private activeColor = new THREE.Color(CONST.ACCENT_COLOR);
	private currentColor = new THREE.Color(CONST.BUILDING_EDGE_COLOR);
	private target = 0;

	constructor({ position, size }: BuildingDef) {
		super();

		const [x, z] = position;
		const [width, height, depth] = size;

		const geometry = new THREE.BoxGeometry(width, height, depth);
		const fill = new THREE.Mesh(
			geometry,
			new THREE.MeshBasicMaterial({
				color: CONST.BUILDING_FILL_COLOR,
				transparent: true,
				opacity: CONST.BUILDING_FILL_OPACITY,
				depthWrite: false,
			}),
		);

		this.edges = new THREE.LineSegments(
			new THREE.EdgesGeometry(geometry),
			new THREE.LineBasicMaterial({ color: this.baseColor.clone() }),
		);

		this.add(fill);
		this.add(this.edges);
		this.position.set(x, height / 2, z);
	}

	public setActive(active: boolean) {
		this.target = active ? 1 : 0;
	}

	public tick(delta: number) {
		this.currentColor.lerp(this.target ? this.activeColor : this.baseColor, Math.min(1, delta * 4));
		(this.edges.material as THREE.LineBasicMaterial).color.copy(this.currentColor);
	}
}
