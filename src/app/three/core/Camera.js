import * as THREE from "three";

export class Camera {
  constructor(app) {
    this.app = app;
    this.instance = new THREE.PerspectiveCamera(
      75,
      app.container.clientWidth / app.container.clientHeight,
      0.1,
      100
    );

    this.instance.position.set(0, 1, 3);
  }
}
