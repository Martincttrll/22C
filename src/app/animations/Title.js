import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import Animation from "@classes/Animation.js";

gsap.registerPlugin(ScrambleTextPlugin);

export default class Title extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
  }

  animateIn() {
    gsap.fromTo(
      this.element,
      { filter: "blur(5px)" },
      {
        filter: "blur(0px)",
        duration: 1,
        delay: 0.5,
        ease: "power2.out",
      }
    );
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
