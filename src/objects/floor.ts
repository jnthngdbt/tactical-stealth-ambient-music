import * as THREE from 'three';
import * as MATERIAL from '../material.ts';

export class Terrain extends THREE.Mesh {
  constructor({
    size, 
    position = [0, 0],
  }: {
    size: [number, number];
    position?: [number, number];
    color?: number;
    opacity?: number;
  }) {
    const [width, depth] = size;
    const planeGeometry = new THREE.PlaneGeometry(width, depth);
    super(planeGeometry, MATERIAL.terrain);
    this.rotation.x = -Math.PI / 2;
    this.position.y = -0.01; // Slightly lower the plane to avoid z-fighting
    [this.position.x, this.position.z] = position;
  }
}