import * as THREE from "three";
export default class Media {
  constructor({ element, group, sizes }) {
    this.element = element;
    //this.title = document.querySelector(".discography__album__title").innerText; // debug a supprimer
    this.group = group;
    this.sizes = sizes;
    this.createTextures();
    this.createMesh();
    this.createBounds();
  }

  createTextures() {
    const image = this.element;
    this.texture = image.getAttribute("src");
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.MeshBasicMaterial({
      map: null,
      transparent: true,
    });
    this.loader = new THREE.TextureLoader();
    this.loader.load(this.texture, (texture) => {
      this.material.map = texture;
      this.material.needsUpdate = true;
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);
    this.mesh.material.opacity = 1;
    this.group.add(this.mesh);
  }

  createBounds() {
    const { width, height, x, y } = this.element.getBoundingClientRect();
    this.bounds = { width, height, x, y };
    this.updateScale();
    this.updatePosition();
  }
  updateScale() {
    this.height = this.bounds.height / window.innerHeight;
    this.width = this.bounds.width / window.innerWidth;

    this.mesh.scale.x = this.sizes.width * this.width;
    this.mesh.scale.y = this.sizes.height * this.height;
  }

  updatePosition() {
    this.x = (this.bounds.x + this.bounds.width / 2) / window.innerWidth;
    this.y = (this.bounds.y + this.bounds.height / 2) / window.innerHeight;
    this.mesh.position.x = this.x * this.sizes.width - this.sizes.width / 2;
    this.mesh.position.y = -this.y * this.sizes.height + this.sizes.height / 2;
  }

  onResize(sizes) {
    this.sizes = sizes;
    this.createBounds();
  }
}
