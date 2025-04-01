import * as THREE from "three";

export class Renderer {
  constructor(app, alpha = true) {
    this.app = app;
    this.domElement = document.createElement("canvas");
    this.instance = new THREE.WebGLRenderer({
      canvas: this.domElement,
      antialias: true,
      alpha,
    });

    this.resize();
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.addEventListeners();
  }

  resize = () => {
    const { clientWidth: width, clientHeight: height } = this.app.container;
    this.instance.setSize(width, height);

    this.app.camera.instance.aspect = width / height;
    this.app.camera.instance.updateProjectionMatrix();
  };

  addEventListeners() {
    window.addEventListener("resize", this.resize);
  }

  render() {
    this.instance.render(this.app.scene, this.app.camera.instance);
  }
}
