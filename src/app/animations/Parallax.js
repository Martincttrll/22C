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
      const scrollProgress = Math.min(
        1,
        Math.max(
          0,
          this.currentY / (document.body.scrollHeight - window.innerHeight)
        )
      );
      each(this.elements, (element) => {
        const scale = 1 + scrollProgress * 0.5;
        element.style.transform = `translateY(${this.currentY}px) scale(${scale})`;
      });
    });
  }
}
