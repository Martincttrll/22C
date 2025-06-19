import Transition from "../Transition.js";
import * as THREE from "three";
import gsap from "gsap";
export default class Album {
  constructor({ scene, sizes, camera, group }) {
    this.scene = scene;
    this.camera = camera;
    this.sizes = sizes;
    this.group = group;
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
