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
    console.log(this.transition.meshCopy);
    if (!this.transition.meshCopy) {
      const meshCopy = mesh.clone();
      meshCopy.material = mesh.material.clone();
      meshCopy.material.map = null;
      meshCopy.material.color.set(0xff0000);
      meshCopy.material.needsUpdate = true;
      mesh.material.transparent = true;
      mesh.material.opacity = 0;
      this.transition.meshCopy = meshCopy;
      this.transition.playFromAlbum();
    } else {
      //On a le mesh (et la position finale dans gallery ?)
      //On play l'animation reverse de transition

      this.transition.playFromAlbum();
    }
  }

  show() {
    //Si arrivé direct sur album, discogrpahy.group n'existe pas => création d'un plane avec texture cover (cf : canvas discography)
    //Call transition.playFromAlbum avec mesh créé
    //Sinon
  }
  hide() {
    this.group.clear();
    this.scene.remove(this.group);
  }
}
