import * as THREE from 'three';
import * as CONST from '../constants.ts';

export class Terrain extends THREE.Group {
	constructor({ size = 320 }: { size?: number } = {}) {
		super();

		const planeGeometry = new THREE.PlaneGeometry(size, size);
		const planeMaterial = new THREE.MeshBasicMaterial({
			color: CONST.TERRAIN_COLOR,
			transparent: true,
			opacity: CONST.TERRAIN_OPACITY,
			depthWrite: false,
		});
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.rotation.x = -Math.PI / 2;
		plane.position.y = -0.02;

		const grid = new THREE.GridHelper(size, size / 5, CONST.GRID_COLOR, CONST.GRID_COLOR);
		const gridMaterial = grid.material as THREE.Material;
		gridMaterial.transparent = true;
		gridMaterial.opacity = CONST.GRID_OPACITY;

		this.add(plane);
		this.add(grid);
	}
}
