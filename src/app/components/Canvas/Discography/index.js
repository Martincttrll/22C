import * as THREE from "three";

export default class Discography {
  constructor({ scene }) {
    this.scene = scene;

    this.group = new THREE.Group();
  }

  show() {
    this.scene.add(this.group);
  }
  hide() {
    this.scene.remove(this.group);
  }
}
