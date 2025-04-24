import * as THREE from "three";
import { Media } from "./Media";

export class DiscographyScene {
  constructor({ container, sizes }) {
    this.container = container;
    this.sizes = sizes;

    this.scene = new THREE.Scene();

    this.createCamera();
    this.createRenderer();
    this.createGeometry();
    this.createMedias();

    this.onResize();
  }

  createCamera() {
    const aspect = this.sizes.width / this.sizes.height;

    this.camera = new THREE.OrthographicCamera(
      -this.sizes.width / 2, // left
      this.sizes.width / 2, // right
      this.sizes.height / 2, // top
      -this.sizes.height / 2, // bottom
      0.1, // near
      1000 // far
    );

    this.camera.position.z = 1;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.container.appendChild(this.renderer.domElement);
  }

  createGeometry() {
    this.geometry = new THREE.PlaneGeometry(1, 1, 10, 10);
  }

  createMedias() {
    const mediaElements = this.container.querySelectorAll(
      ".discography__album"
    );
    this.medias = Array.from(mediaElements).map((element) => {
      return new Media({
        element,
        geometry: this.geometry,
        scene: this.scene,
        sizes: this.sizes,
      });
    });
  }

  onResize() {
    const { width, height } = this.container.getBoundingClientRect();
    this.sizes.width = width;
    this.sizes.height = height;

    this.camera.left = -this.sizes.width / 2;
    this.camera.right = this.sizes.width / 2;
    this.camera.top = this.sizes.height / 2;
    this.camera.bottom = -this.sizes.height / 2;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.sizes.width, this.sizes.height);

    this.medias.forEach((media) => media.update());
  }

  update() {
    this.renderer.render(this.scene, this.camera);
  }
}
