import * as CONST from './constants.ts';
import * as MATERIAL from './material.ts';
import * as THREE from 'three';
import { CSG } from 'three-csg-ts';

interface FloorOptions {
  size: [number, number];
  position?: [number, number];
}

export function floor({size, position = [0, 0]}: FloorOptions) {
  const [width, depth] = size;
  const planeGeometry = new THREE.PlaneGeometry(width, depth);
  const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, opacity: CONST.FLOOR_OPACITY, transparent: true, depthWrite: false });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.01; // Slightly lower the plane to avoid z-fighting

  return plane;
}

interface RoomOptions {
  size: [number, number];
  position?: [number, number];
  name?: string;
  level?: number;
  height?: number;
}

export function room({size, position = [0, 0], name = '', level = 0, height = CONST.CEILING_HEIGHT}: RoomOptions ) {
  const [x, z] = position;
  const [width, depth] = size;
  const y = level * CONST.LEVEL_HEIGHT + height / 2; // put room floor at floor level

  // Room with thickness.
  const thickness = 0.1;
  const outer = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), MATERIAL.base);
  const inner = new THREE.Mesh(new THREE.BoxGeometry(width-thickness, height-thickness, depth-thickness), new THREE.MeshBasicMaterial({ color: 0x000000 }));
  const room = CSG.subtract(outer, inner);
  room.position.set(x, y, z);

  // Add door.
  const door = new THREE.Mesh(new THREE.BoxGeometry(CONST.DOOR_WIDTH, CONST.DOOR_HEIGHT, thickness * 3), MATERIAL.base);
  door.position.set(x, y - 0.5 * (height - CONST.DOOR_HEIGHT), z -depth / 2);

  room.updateMatrix();
  door.updateMatrix();

  const roomdoor = CSG.subtract(room, door);

  roomdoor.name = name;

  return roomdoor;
}