import gsap from "gsap";
import SplitText from "gsap/SplitText";
import Animation from "@classes/Animation.js";

gsap.registerPlugin(SplitText);

export default class Title extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    this.splits = SplitText.create(this.element, {
      type: "chars",
      mask: "chars",
    });

    gsap.set(this.splits.chars, {
      y: "100%",
    });
  }

  animateIn() {
    gsap.to(this.splits.chars, {
      y: "0%",
      duration: 1,
      ease: "power2.inOut",
      stagger: 0.1,
    });
  }
  // animateIn() {
  //   gsap.to(this.element, {
  //     duration: 1,
  //     scrambleText: {
  //       text: this.element.textContent,
  //       chars: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  //       revealDelay: 0.5,
  //     },
  //   });
  // }

  animateOut() {}
}
