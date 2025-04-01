import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class Controls {
  constructor(app) {
    this.app = app;
    this.instance = new OrbitControls(
      this.app.camera.instance,
      this.app.renderer.domElement
    );
    this.instance.enableDamping = true;
  }

  update() {
    this.instance.update();
  }
}
