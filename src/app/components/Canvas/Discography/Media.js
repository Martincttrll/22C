import * as THREE from "three";

export class Media {
  constructor({ element, geometry, gl, scene, sizes }) {
    this.element = element;
    this.geometry = geometry;
    this.gl = gl;
    this.scene = scene;
    this.sizes = sizes;

    this.createTexture();
    this.createMesh();
    this.updateBounds();
  }

  createTexture() {
    const image = this.element.getAttribute("data-src");
    const textureLoader = new THREE.TextureLoader();
    this.texture = textureLoader.load(image);
  }

  createMesh() {
    const material = new THREE.MeshBasicMaterial({ map: this.texture });
    this.mesh = new THREE.Mesh(this.geometry, material);
    this.scene.add(this.mesh);
  }

  updateBounds() {
    const bounds = this.element.getBoundingClientRect();

    this.width = (bounds.width / window.innerWidth) * this.sizes.width;
    this.height = (bounds.height / window.innerHeight) * this.sizes.height;

    this.x =
      (bounds.left / window.innerWidth) * this.sizes.width -
      this.sizes.width / 2 +
      this.width / 2;
    this.y =
      this.sizes.height / 2 -
      (bounds.top / window.innerHeight) * this.sizes.height -
      this.height / 2;

    this.mesh.scale.set(this.width, this.height, 1);
    this.mesh.position.set(this.x, this.y, 0);
  }

  update() {
    this.updateBounds();
  }
}
