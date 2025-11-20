import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { mouse } from "@utils/mousePos.js";
import { Detection } from "@classes/Detection";

export class Contact {
  constructor({ scene, camera, sizes }) {
    this.scene = scene;
    this.camera = camera;
    this.sizes = sizes;
    this.group = new THREE.Group();

    this.displacementFactor = 3;
    this.friction = 0.01;
    this.meshSize = Detection.isMobile ? 4 : 8;
  }

  async createMesh() {
    const loader = new FontLoader();
    const font = await loader.loadAsync("src/fonts/human_json.json");

    this.geometry = new TextGeometry("22C", {
      font,
      size: this.meshSize,
      height: 0.2,
      depth: 0.8,
    });

    this.geometry.computeBoundingBox();
    const bbox = this.geometry.boundingBox;
    const centerOffsetX = (bbox.max.x + bbox.min.x) / 2;
    const centerOffsetY = (bbox.max.y + bbox.min.y) / 2;
    const centerOffsetZ = (bbox.max.z + bbox.min.z) / 2;
    this.geometry.translate(-centerOffsetX, -centerOffsetY, -centerOffsetZ);

    this.mesh = new THREE.Mesh(
      this.geometry,
      new THREE.MeshBasicMaterial({ wireframe: false, color: 0xffffff })
    );

    this.mesh.position.set(0, 0, 0);
    this.group.add(this.mesh);
    this.scene.add(this.group);
    this.mesh.rotation.y = 2;

    this.camera.lookAt(this.mesh.position);
  }

  update() {
    if (!Detection.isMobile && this.mesh) {
      this.mouse = {
        x: (mouse.x / window.innerWidth) * 2 - 1,
        y: (mouse.y / window.innerHeight) * 2 - 1,
      };
      this.mesh.position.x +=
        (-this.mouse.x * this.displacementFactor - this.mesh.position.x) * 0.05;
      this.mesh.position.y +=
        (this.mouse.y * this.displacementFactor - this.mesh.position.y) * 0.05;
    }
    if (this.mesh) {
      this.mesh.rotation.y += 0.04;
    }
  }
  show() {
    if (!this.mesh) {
      this.createMesh();
    }
    this.scene.add(this.group);
  }
  hide() {
    this.scene.remove(this.group);
  }
}
