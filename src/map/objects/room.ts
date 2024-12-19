import * as THREE from 'three';
import * as CONST from '../constants.ts';
import * as MATERIAL from '../material.ts';
import { CSG } from 'three-csg-ts';

export class Room extends THREE.Mesh {
  constructor({
    size, 
    position = [0, 0],
    level = 0,
    height = CONST.CEILING_HEIGHT,
  }: {
    size: [number, number];
    position?: [number, number];
    level?: number;
    height?: number;
  }) {
    const [x, z] = position;
    const [width, depth] = size;
    const y = level * CONST.LEVEL_HEIGHT + height / 2; // put room floor at floor level
  
    // Room with thickness.
    const thickness = 0.1;
    const outer = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), MATERIAL.base);
    const inner = new THREE.Mesh(new THREE.BoxGeometry(width-thickness, height-thickness, depth-thickness), new THREE.MeshBasicMaterial());
    const room = CSG.subtract(outer, inner);
  
    super(room.geometry, room.material);
    
    this.position.set(x, y, z);
  }
}