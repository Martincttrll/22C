//Class qui permet de génerer tous les canvas du site (preloader ????)
import * as THREE from "three";
import Home from "./Home";
export default class Canvas {
  constructor() {
    this.createRenderer();
    this.createScene();
    this.createCamera();

    this.updateCallbacks = [];

    this.update();
    this.createHome();
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true });

    this.renderer.domElement.style.pointerEvents = "none";
    this.renderer.domElement.style.border = "1px solid red";
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.overflow = "hidden";
    this.renderer.domElement.style.top = 0;
    this.renderer.domElement.style.left = 0;
    this.renderer.domElement.style.zIndex = 10;

    document.body.appendChild(this.renderer.domElement);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
  }
  createScene() {
    this.scene = new THREE.Scene();
  }

  update() {
    requestAnimationFrame(() => this.update());
    this.updateCallbacks.forEach((update) => update());
    this.renderer.render(this.scene, this.camera);
  }

  addUpdate(updateFunction) {
    this.updateCallbacks.push(updateFunction);
  }

  createHome() {
    this.home = new Home({
      scene: this.scene,
      camera: this.camera,
      addUpdate: this.addUpdate.bind(this),
    });
  }

  /**
   * Events.
   */
  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  onChange(template, isPreloaded) {
    if (template === "/") {
      this.home.show(isPreloaded);
    } else {
      this.home.hide();
    }

    this.template = template;
  }
}
