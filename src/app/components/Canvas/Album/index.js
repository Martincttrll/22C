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
      window.app.onChange({ url: "/discography/" });
      // const meshCopy = mesh.clone();
      // meshCopy.material = mesh.material.clone();
      // meshCopy.material.map = null;
      // meshCopy.material.color.set(0xff0000);
      // meshCopy.material.needsUpdate = true;
      // mesh.material.transparent = true;
      // mesh.material.opacity = 0;
      // this.transition.meshCopy = meshCopy;
      // this.transition.playFromAlbum();
    } else {
      console.log("playFromAlbum onClickBack");
      this.transition.playFromAlbum();
    }
  }

  show() {
    //Si arrivé direct sur album, discogrpahy.group n'existe pas => création d'un plane avec texture cover (cf : canvas discography)
    //Call transition.playFromAlbum avec mesh créé
    //Sinon
    if (!this.transition.meshCopy) {
      // 1. Récupère l'URL de la cover
      const coverUrl = document.querySelector(".album__wrapper").dataset.cover;

      // 2. Crée le mesh fictif
      const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
      const texture = new THREE.TextureLoader().load(coverUrl);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      this.fakeMesh = new THREE.Mesh(geometry, material);
      this.fakeMesh.material.side = THREE.DoubleSide;
      this.fakeMesh.rotation.y = Math.PI;

      // 3. Calcule le scale pour couvrir tout le viewport
      const cameraZ = this.camera.position.z;
      const distance = Math.abs(cameraZ - this.fakeMesh.position.z);
      const fov = this.camera.fov * (Math.PI / 180);
      const heightAtDistance = 2 * Math.tan(fov / 2) * distance;
      const widthAtDistance = heightAtDistance * this.camera.aspect;
      const scaleTarget = Math.max(widthAtDistance, heightAtDistance);
      this.fakeMesh.scale.set(scaleTarget, scaleTarget, 1);
      this.fakeMesh.material.transparent = true;
      this.fakeMesh.material.opacity = 0;

      // 4. Place au centre
      this.fakeMesh.position.set(0, 0, 0);

      // 5. Ajoute à la scène
      this.scene.add(this.fakeMesh);

      // 6. Passe ce mesh à la transition
      this.transition.meshCopy = this.fakeMesh;
      // Optionnel: stocke une référence si besoin pour cleanup

      // 7. Quand on clique sur "back", joue la transition reverse
      // (dans onClickBack, tu appelles this.transition.playFromAlbum())
    } else {
      // Cas normal, galerie déjà présente
    }
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
