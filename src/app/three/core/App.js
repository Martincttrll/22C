import * as THREE from "three";
import { Renderer } from "./Renderer.js";
import { Camera } from "./Camera.js";
import { Controls } from "./Controls.js";
import { Clock } from "./Clock.js";

export class App {
  constructor(container, useControls = true) {
    this.container = document.querySelector(container);

    this.scene = new THREE.Scene();
    this.camera = new Camera(this);
    this.renderer = new Renderer(this);

    if (useControls) {
      this.controls = new Controls(this);
    }

    this.clock = new Clock(this);
    this.updatables = [];

    this.init();
  }

  init() {
    this.container.appendChild(this.renderer.domElement);
    this.animate();
  }

  animate = () => {
    requestAnimationFrame(this.animate);
    this.clock.update();
    if (this.controls) {
      this.controls.update();
    }

    this.updatables.forEach((update) => update());
    this.renderer.render();
  };

  addUpdate(updateFunction) {
    this.updatables.push(updateFunction);
  }

  add(object) {
    this.scene.add(object);
  }

  remove(object) {
    this.scene.remove(object);
  }
}
