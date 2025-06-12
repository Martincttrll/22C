import gsap from "gsap";
import Animation from "@classes/Animation.js";
export default class Separator extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
  }

  animateIn() {
    gsap.fromTo(
      this.element,
      {
        width: 0,
      },
      {
        width: "100%",
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          this.observer.disconnect();
        },
      }
    );
  }
}
