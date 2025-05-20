//Class qui permet de génerer tous les canvas du site (preloader ????)
import * as THREE from "three";
export default class Canvas {
  constructor() {
    this.createRenderer();
    this.createScene();
    this.createCamera();
    this.createCube();
    this.update();
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true });

    this.renderer.domElement.style.pointerEvents = "none";
    this.renderer.domElement.style.border = "1px solid red";
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.cursor = "absolute";
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

  createCube() {
    this.cube = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    );
    this.scene.add(this.cube);
  }

  update() {
    requestAnimationFrame(() => this.update());
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
}
