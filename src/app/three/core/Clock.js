import * as THREE from "three";
export class Clock {
  constructor(app) {
    this.app = app;
    this.clock = new THREE.Clock();
  }

  update() {
    const elapsedTime = this.clock.getElapsedTime();
  }
}
