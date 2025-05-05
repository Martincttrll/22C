import { each } from "lodash";
import gsap from "gsap";
export class Parallax {
  constructor(elements, smoother) {
    this.smoother = smoother;
    this.elements = Array.isArray(elements) ? elements : [elements];

    this.lerpFactor = 0.2;
    this.currentY = 0;

    this.create();
  }

  create() {
    if (!this.smoother) return;
    each(this.elements, (element) => {
      gsap.to({
        element,
        y: () => {
          return (
            this.smoother.scrollTrigger.start - this.smoother.scrollTrigger.end
          );
        },
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          markers: true,
        },
      });
    });
  }
}
