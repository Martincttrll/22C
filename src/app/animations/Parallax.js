import { each } from "lodash";

export class Parallax {
  constructor(elements, lenis) {
    this.lenis = lenis;
    this.elements = Array.isArray(elements) ? elements : [elements];

    this.lerpFactor = 0.2;
    this.currentY = 0;

    this.create();
  }

  create() {
    if (!this.lenis) return;
    this.lenis.on("scroll", (e) => {
      this.currentY +=
        (e.animatedScroll * this.lerpFactor - this.currentY) * 0.1;
      each(this.elements, (element) => {
        element.style.transform = `translateY(${this.currentY}px)`;
      });
    });
  }
}
