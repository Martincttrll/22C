import * as THREE from "three";

export class Camera {
  constructor(app) {
    this.app = app;
    // this.instance = new THREE.PerspectiveCamera(
    //   75,
    //   app.container.clientWidth / app.container.clientHeight,
    //   0.1,
    //   100
    // );

    const aspect = app.container.clientWidth / app.container.clientHeight;
    const frustumSize = 1.5; // Adjust this value as needed for your scene

    this.instance = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2, // left
      (frustumSize * aspect) / 2, // right
      frustumSize / 2, // top
      -frustumSize / 2, // bottom
      0.1, // near
      100 // far
    );
    this.instance.position.set(0, 1, 3);
  }
}
