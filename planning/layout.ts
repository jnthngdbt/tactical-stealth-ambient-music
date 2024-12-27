import * as THREE from 'three';
import { Terrain } from './objects/terrain.ts';
import { Room } from './objects/room.ts';

export class Layout {
  public scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  public addTerrain({ size } : { size: [number, number ] }) {
    const floor = new Terrain({ size});
    this.scene.add(floor);
  }

  public addRoom({ size, position = [0, 0], level = 0 }: { size: [number, number], position?: [number, number], level?: number }) {
    const room = new Room({ size, position, level });
    this.scene.add(room);
  }
}