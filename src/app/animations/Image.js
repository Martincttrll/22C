import gsap from "gsap";
import Animation from "../classes/Animation";

export default class Image extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    this.createContainer();
  }

  createContainer() {
    const container = document.createElement("div");

    container.style.position = "relative";
    container.style.overflow = "hidden";
    container.style.width = `${this.element.offsetWidth}px`;
    container.style.height = `${this.element.offsetHeight}px`;

    this.element.parentNode.insertBefore(container, this.element);
    container.appendChild(this.element);

    this.container = container;

    // Apply styles to the image
    this.element.style.position = "absolute";
    this.element.style.left = "0";
  }

  animateIn() {
    if (this.hasAnimatedIn) return;
    this.hasAnimatedIn = true;

    gsap.fromTo(
      this.element,
      {
        y: "100%",
        rotation: 3,
      },
      {
        y: "0%",
        rotation: 0,
        ease: "power2.out",
        // delay: 0.5,
        duration: 1.5,
        onComplete: () => {
          this.hasAnimatedIn = false;
        },
      }
    );
  }
}
