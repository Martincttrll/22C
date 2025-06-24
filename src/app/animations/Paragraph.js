import gsap from "gsap";
import SplitText from "gsap/SplitText";
import Animation from "@classes/Animation.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default class Title extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    this.chars = SplitText.create(element, { type: "chars" });
  }
  //Idée random je sais pas ou : paragraph blabla avec dedans un (des?) mots clefs
  //  genre "Brutalisme?" et au scroll tout se blur pour laisser que ce mot clef
  animateIn() {
    // gsap
    //   .fromTo
    // this.chars.chars,
    // {
    //   autoAlpha: 0,
    //   willChange: "transform",
    // },
    // {
    //   scrollTrigger: {
    //     trigger: this.element,
    //     start: "top 85%",
    //     end: "top 60%",
    //     scrub: true,
    //     markers: false,
    //   },
    //   autoAlpha: 1,
    //   stagger: 0.3,
    //   ease: "none",
    //   onComplete: () => {
    //     this.observer.disconnect();
    //   },
    // }
    // ();
  }

  animateOut() {}
}
