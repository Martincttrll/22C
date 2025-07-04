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
  }

  onClickBack() {
    if (!this.transition.meshCopy) {
      this.transition.animateFallbackMesh(this.fakeMesh);
    } else {
      this.transition.playFromAlbum();
    }
  }

  onAudioPlay({ data, analyser }) {
    console.log(data, analyser);
    this.audioData = data;
    this.analyser = analyser;

    this.audioMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshBasicMaterial({ color: 0xd2d2d2 })
    );

    this.audioMesh.position.set(0, 0, 0);

    this.scene.add(this.audioMesh);
  }

  update() {
    if (this.audioData && this.analyser && this.audioMesh) {
      console.log("z");
      this.audioMesh.rotation.x += 0.5;
      this.audioMesh.rotation.y += 0.5;
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
}
