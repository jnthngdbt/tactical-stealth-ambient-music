import * as THREE from 'three';

export class CameraJitter {
  private camera: THREE.Camera;
  private amplitude = 0.0015;
  private speed = 2;

  constructor(camera: THREE.Camera, amplitude = 0.0015, speed = 2) {
    this.camera = camera;
    this.amplitude = amplitude;
    this.speed = speed;
  }

  public update(time: number) {
    const t = time / this.speed;
    this.camera.position.x += Math.sin(t) * this.amplitude * (Math.random() - 0.5);
    this.camera.position.y += Math.cos(t) * this.amplitude * (Math.random() - 0.5);
  }
}