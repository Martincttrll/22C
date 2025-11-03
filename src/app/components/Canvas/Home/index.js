import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Video from "./Video";
import Reels from "./Reels";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_DURATION = 800;

export default class Home {
  constructor({ scene, sizes, camera }) {
    this.scene = scene;
    this.sizes = sizes;
    this.camera = camera;
    this.group = new THREE.Group();
    this.loader = new GLTFLoader();

    this.models = [];
    this.steps = [
      {
        label: "sphinx",
        modelPath: "/models/sphinx.gltf",
      },
      {
        label: "gabi",
        modelPath: "/models/gabi.gltf",
      },
      {
        label: "hatlas",
        modelPath: "/models/hatlas.gltf",
      },
    ];
    this.modelsPromise = this.loadModels();
  }

  async loadModels() {
    this.modelGroup = new THREE.Group();
    this.group.add(this.modelGroup);

    const modelPromises = this.steps.map(async (step, i) => {
      const model = await new Promise((resolve, reject) => {
        this.loader.load(
          step.modelPath,
          (gltf) => resolve(gltf.scene),
          undefined,
          (error) => reject(error)
        );
      });
      model.position.z = 3;
      model.position.x = i * 3.5;
      model.position.y = -model.scale.y / 2;

      step.model = model;
      this.modelGroup.add(model);
    });

    await Promise.all(modelPromises);
  }

  setupScrollAnimation() {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    const scrollDuration = this.steps.length * SCROLL_DURATION;
    this.label = document.querySelector(".home__three__label");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.querySelector(".home__three__wrapper"),
        start: "top center",
        end: `+=${scrollDuration}`,
        scrub: true,
        pin: true,

        onUpdate: (self) => {
          const index = Math.round(self.progress * (this.steps.length - 1));
          const step = this.steps[index];
          this.label.innerText = step.label;
        },
      },
    });

    tl.to(this.modelGroup.position, {
      y: 0,
      duration: 1,
      ease: "power2.out",
    }).call(() => {
      this.label.innerText = this.steps[0].label;
      this.updateLabel();
    });

    this.steps.forEach((step, index) => {
      const targetX = -index * 3.5;

      tl.to(this.modelGroup.position, {
        x: targetX,
        duration: 1,
      }).call(() => {
        this.label.innerText = step.label;
      });
    });

    tl.to(this.modelGroup.position, {
      y: 2.5,
      duration: 1,
      ease: "power2.out",
    });
  }

  updateLabel() {
    this.label.innerText = this.steps[0].label;
  }

  createVideo() {
    this.video = new Video({
      element: document.querySelector(".home__video"),
      group: this.group,
      sizes: this.sizes,
    });
  }

  createReels() {
    this.reels = new Reels({
      elements: document.querySelectorAll(".home__reels__video"),
      group: this.group,
      camera: this.camera,
      sizes: this.sizes,
    });
  }

  update(scroll) {
    this.steps.forEach((step) => {
      if (step.model) step.model.rotation.y += 0.01;
    });

    if (this.video && this.video.update) {
      this.video.update(scroll);
    }
    if (this.reels && this.reels.update) {
      this.reels.update(scroll);
    }
  }

  onResize(sizes) {
    this.sizes = sizes;
    if (!this.video || !this.video.onResize) return;
    this.video.onResize(this.sizes);
  }

  addDebug() {
    if (this.video && this.video.addDebug) {
      this.video.addDebug();
    }
    if (this.reels && this.reels.addDebug) {
      this.video.addDebug();
    }
  }

  async show() {
    if (!this.video) {
      this.createVideo();
    }
    // this.createReels(); // WIP
    await this.modelsPromise;
    this.modelGroup.position.set(0, -2.5, 0);

    this.setupScrollAnimation();
    this.scene.add(this.group);
  }
  hide() {
    this.scene.remove(this.group);
  }
}
