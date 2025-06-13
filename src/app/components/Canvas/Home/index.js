import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_DURATION = 800;

export default class Home {
  constructor({ scene, addUpdate }) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.addUpdate = addUpdate;
    this.loader = new GLTFLoader();

    this.models = [];
    this.steps = [
      {
        color: 0xb8ffa3,
        label: "sphinx",
        modelPath: "src/assets/models/caracter/caracter.gltf",
      },
      {
        color: 0x35b7cc,
        label: "gabi",
        modelPath: "src/assets/models/caracter/caracter.gltf",
      },
      {
        color: 0xcc332d,
        label: "hatlas",
        modelPath: "src/assets/models/caracter/caracter.gltf",
      },
    ];
    this.createLights();
    this.modelsPromise = this.loadModels();
  }

  createLights() {
    this.spotLight = new THREE.SpotLight(this.steps[0].color, 3);
    this.spotLight.position.set(0.8, 2.5, -2);
    this.spotLight.angle = 0.3;
    this.spotLight.penumbra = 0.2;
    this.group.add(this.spotLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    this.group.add(this.directionalLight);
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

    this.addUpdate(() => {
      this.steps.forEach((step) => {
        if (step.model) step.model.rotation.y += 0.01;
      });
    });
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
          this.updateLightColor(step.color);
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
      this.updateLightColor(this.steps[0].color);
    });

    this.steps.forEach((step, index) => {
      const targetX = -index * 3.5;

      tl.to(this.modelGroup.position, {
        x: targetX,
        duration: 1,
      }).call(() => {
        this.label.innerText = step.label;
        this.updateLightColor(step.color);
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

  updateLightColor(hexColor) {
    const r = ((hexColor >> 16) & 255) / 255;
    const g = ((hexColor >> 8) & 255) / 255;
    const b = (hexColor & 255) / 255;

    gsap.to(this.spotLight.color, {
      r,
      g,
      b,
      duration: 0.5,
    });
  }

  async show() {
    await this.modelsPromise;
    this.modelGroup.position.set(0, -2.5, 0);
    this.setupScrollAnimation();
    this.scene.add(this.group);
  }
  hide() {
    this.scene.remove(this.group);
  }
}
