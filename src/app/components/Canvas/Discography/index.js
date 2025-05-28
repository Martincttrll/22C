import { each } from "lodash";
import Media from "./Media.js";
import * as THREE from "three";

export default class Discography {
  constructor({ scene, sizes }) {
    this.scene = scene;
    this.sizes = sizes;
    this.group = new THREE.Group();
  }

  createMedia() {
    const mediaElements = document.querySelectorAll(
      ".discography__album__cover"
    );
    this.mediaInstances = [];
    each(mediaElements, (element) => {
      const media = new Media({
        element,
        group: this.group,
        sizes: this.sizes,
      });
      this.mediaInstances.push(media);
    });
  }

  createGallery() {
    this.mediaInstances.forEach((media, i) => {
      media.mesh.position.z -= i * 0.5;
      media.mesh.position.y += i * 0.5;
      media.mesh.rotation.x = 0.1;
      media.mesh.material.opacity = 1 * (1 - i * 0.1);
    });
  }

  onResize(sizes) {
    each(this.mediaInstances, (media) => {
      media.onResize(sizes);
    });
  }

  show() {
    this.createMedia();
    this.createGallery();
    this.scene.add(this.group);
  }
  hide() {
    this.scene.remove(this.group);
  }
}
