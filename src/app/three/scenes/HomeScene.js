import { App } from "../core/App";
import * as THREE from "three";
import { ModelLoader } from "../core/ModelLoader";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export class HomeScene {
  constructor(lenis) {
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    this.steps = [
      {
        spotLightColor: 0xb8ffa3ff,
        label: "sphinx",
      },
      {
        spotLightColor: 0x35b7cc,
        label: "gabi",
      },
      {
        spotLightColor: 0xcc332d,
        label: "hatlas",
      },
    ];

    this.create();
    this.setupScrollAnimation();
  }

  async create() {
    this.app = new App(".home__three__wrapper", false);

    const modelLoader = new ModelLoader();
    const model = await modelLoader.load(
      "src/assets/models/caracter/caracter.gltf"
    );

    this.app.add(model);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    this.app.scene.add(this.directionalLight);
    this.directionalLight.target = model;

    const label = document.querySelector(".home__three__label");

    const spotLight = new THREE.SpotLight(0xb8ffa3ff, 3);
    spotLight.position.set(1, 2.5, 0);
    spotLight.angle = 0.4;
    spotLight.target = model;
    this.app.scene.add(spotLight);
    // const helper = new THREE.SpotLightHelper(spotLight);
    // this.app.scene.add(helper);

    this.app.camera.instance.position.z = 1;
    this.app.camera.instance.position.y = 0.58;

    this.app.addUpdate(() => {
      if (model) {
        model.rotation.y += 0.01;
      }
    });
  }

  setupScrollAnimation() {
    this.steps.forEach((step, index) => {
      gsap.to(step.spotLight, {
        intensity: 2, // Augmente progressivement
        scrollTrigger: {
          trigger: ".home__three__wrapper",
          start: `${index * 33}% top`,
          end: `${(index + 1) * 33}% top`,
          scrub: true,
          // markers: true, // Debug
          onEnter: () => {
            document.querySelector(".home__three__label").innerText =
              step.label;
          },
        },
      });
    });
  }
}
