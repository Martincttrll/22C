import gsap from "gsap";
import Animation from "../classes/Animation.js";
export default class Separator extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
  }

  animateIn() {
    console.log(this.element);
    gsap.fromTo(
      this.element,
      {
        width: 0,
      },
      {
        width: "100%",
        duration: 1,
        ease: "power2.out",
      }
    );
  }
  animateOut() {
    gsap.set(this.element, {
      width: 0,
    });
  }
}
