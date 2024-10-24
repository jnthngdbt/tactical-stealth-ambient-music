import * as CONST from './constants.js';
import * as MATERIAL from './material.js';
import * as THREE from 'three';

'use strict';

export function floor({ size }) {
  const [width, depth] = size;
  const planeGeometry = new THREE.PlaneGeometry(width, depth);
  const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide, opacity: CONST.FLOOR_OPACITY, transparent: true, depthWrite: false });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.01; // Slightly lower the plane to avoid z-fighting

  return plane;
}

export function room({ position, size, level = 0, height = CONST.CEILING_HEIGHT, name = '' }) {
  const [x, z] = position;
  const [width, depth] = size;
  const y = level * CONST.LEVEL_HEIGHT + height / 2; // put room floor at floor level
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const cube = new THREE.Mesh(geometry, MATERIAL.base);
  cube.position.set(x, y, z);

  cube.name = name;

  return cube;
}