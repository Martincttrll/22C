import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_DURATION = 800;

export default class Home {
  constructor({ scene, camera, addUpdate }) {
    this.scene = scene;
    this.camera = camera;
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

    this.init();
  }

  async init() {
    this.createLights();
    await this.loadModels();
    this.setupCamera();
    this.setupScrollAnimation();
  }

  createLights() {
    this.spotLight = new THREE.SpotLight(this.steps[0].color, 3);
    this.spotLight.position.set(0.8, 2.5, -2);
    this.spotLight.angle = 0.3;
    this.spotLight.penumbra = 0.2;
    this.scene.add(this.spotLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    this.scene.add(this.directionalLight);
  }

  async loadModels() {
    this.modelGroup = new THREE.Group();
    this.scene.add(this.modelGroup);

    const modelPromises = this.steps.map(async (step, i) => {
      const model = await new Promise((resolve, reject) => {
        this.loader.load(
          step.modelPath,
          (gltf) => resolve(gltf.scene),
          undefined,
          (error) => reject(error)
        );
      });
      model.position.z = -1;
      model.position.x = i * 3.5;
      step.model = model;
      this.modelGroup.add(model);
    });

    await Promise.all(modelPromises);

    this.label = document.querySelector(".home__three__label");
    this.label.innerText = this.steps[0].label;

    this.addUpdate(() => {
      this.steps.forEach((step) => {
        if (step.model) step.model.rotation.y += 0.01;
      });
    });
  }

  setupCamera() {
    this.camera.position.set(0, 0.58, 1);
  }

  setupScrollAnimation() {
    const scrollDuration = this.steps.length * SCROLL_DURATION;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.querySelector(".home__three__wrapper"),
        start: "top center-=200px",
        end: `+=${scrollDuration}`,
        scrub: true,
        pin: true,
        onUpdate: (self) => {
          const stepIndex = Math.round(self.progress * (this.steps.length - 1));
          const step = this.steps[stepIndex];
          this.label.innerText = step.label;
          this.updateLightColor(step.color);
        },
      },
    });

    this.steps.forEach((step, index) => {
      const targetX = -index * 3.5;

      tl.to(this.modelGroup.position, {
        x: targetX,
        duration: 1,
        onStart: () => {
          this.label.innerText = step.label;
          this.updateLightColor(step.color);
        },
      });

      ScrollTrigger.create({
        trigger: document.querySelector(this.selector),
        start: `top+=${index * SCROLL_DURATION} center`,
        end: `top+=${(index + 1) * SCROLL_DURATION} center`,
        scrub: true,
        onLeaveBack: () => {
          const prevStep = this.steps[index - 1] || this.steps[0];
          this.label.innerText = prevStep.label;
          this.updateLightColor(prevStep.color);
        },
      });
    });
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
}
