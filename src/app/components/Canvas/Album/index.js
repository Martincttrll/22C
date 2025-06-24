import Transition from "../Transition.js";
import * as THREE from "three";
import gsap from "gsap";
export default class Album {
  constructor({ scene, sizes, camera, group, transition }) {
    this.scene = scene;
    this.camera = camera;
    this.sizes = sizes;
    this.group = group;
    this.transition = transition;
    this.addDebug();
  }

  onClickBack() {
    if (!this.transition.meshCopy) {
      this.transition.animateFallbackMesh(this.fakeMesh);
    } else {
      this.transition.playFromAlbum();
    }
  }

  show() {
    if (this.transition.meshCopy) return; //Si on a déjà un mesh de transition
    //arrivé direct sur album,
    const coverUrl = document.querySelector(".album__wrapper").dataset.cover;

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    const texture = new THREE.TextureLoader().load(coverUrl);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    this.fakeMesh = new THREE.Mesh(geometry, material);
    this.fakeMesh.material.side = THREE.DoubleSide;
    this.fakeMesh.rotation.y = Math.PI;

    const cameraZ = this.camera.position.z;
    const distance = Math.abs(cameraZ - this.fakeMesh.position.z);
    const fov = this.camera.fov * (Math.PI / 180);
    const heightAtDistance = 2 * Math.tan(fov / 2) * distance;
    const widthAtDistance = heightAtDistance * this.camera.aspect;
    const scaleTarget = Math.max(widthAtDistance, heightAtDistance);
    this.fakeMesh.scale.set(scaleTarget, scaleTarget, 1);
    this.fakeMesh.material.transparent = true;
    this.fakeMesh.material.opacity = 0;

    this.fakeMesh.position.set(0, 0, 0);

    this.scene.add(this.fakeMesh);
  }
  hide() {
    this.group.clear();
    this.scene.remove(this.group);
  }
  //debug
  addDebug() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "d") {
        this.fakeMesh.material.wireframe = !this.fakeMesh.material.wireframe;
      }
    });
  }
}
