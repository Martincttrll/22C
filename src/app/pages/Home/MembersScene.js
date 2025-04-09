import { App } from "../../three/core/App";
import * as THREE from "three";
import { ModelLoader } from "../../three/core/ModelLoader";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export class MembersScene {
  constructor(selector) {
    this.selector = selector;
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

    this.create();
    this.setupScrollAnimation();
  }

  async create() {
    this.app = new App(this.selector, false);

    //Lights
    this.spotLight = new THREE.SpotLight(this.steps[0].color, 3);
    this.spotLight.position.set(0.8, 2.5, 0);
    this.spotLight.angle = 0.3;
    this.spotLight.penumbra = 0.2;
    this.app.scene.add(this.spotLight);

    const spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    // this.app.scene.add(spotLightHelper);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    // this.app.scene.add(this.directionalLight);

    //Models
    this.modelGroup = new THREE.Group();
    this.app.scene.add(this.modelGroup);

    const modelLoader = new ModelLoader();
    this.modelPromises = this.steps.map((step, i) =>
      modelLoader.load(step.modelPath).then((model) => {
        model.position.x = i * 2;
        step.model = model;
        this.modelGroup.add(model);
      })
    );

    this.label = document.querySelector(".home__three__label");
    this.label.innerText = this.steps[0].label;
    // Camera
    this.app.camera.instance.position.z = 1;
    this.app.camera.instance.position.y = 0.58;
    // Animation boucle (rotation des modèles)
    this.app.addUpdate(() => {
      this.steps.forEach((step) => {
        if (step.model) step.model.rotation.y += 0.01;
      });
    });
  }

  setupScrollAnimation() {
    Promise.all(this.modelPromises).then(() => {
      const scrollDuration = this.steps.length * 1000;

      // Crée une timeline pin scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.querySelector(this.selector),
          start: "top center-=200px",
          end: `+=${scrollDuration}`,
          scrub: true,
          pin: true,
          // markers: true,
          onUpdate: (self) => {
            // Met à jour le label et la couleur pendant le scroll
            const stepIndex = Math.round(
              self.progress * (this.steps.length - 1)
            );
            const step = this.steps[stepIndex];

            // Mise à jour dynamique du label et de la couleur
            this.label.innerText = step.label;
            this.updateLightColor(step.color);
          },
        },
      });

      this.steps.forEach((step, index) => {
        const targetX = -index * 2;

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
          start: `top+=${index * 1000} center`,
          end: `top+=${(index + 1) * 1000} center`,
          scrub: true,
          onLeaveBack: () => {
            const prevStep = this.steps[index - 1] || this.steps[0];
            this.label.innerText = prevStep.label;
            this.updateLightColor(prevStep.color);
          },
        });
      });
    });
  }

  // Fonction pour changer la couleur du spot
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
