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
    gsap.fromTo(
      this.chars.chars,
      {
        scaleY: 0.08,
        scaleX: 1.8,

        willChange: "transform",
      },
      {
        scrollTrigger: {
          trigger: this.element,
          start: "top 85%",
          end: "top top",
          scrub: true,
          markers: false,
        },
        scaleY: 1,
        scaleX: 1,

        stagger: 0.3,
        ease: "none",
        onComplete: () => {
          this.observer.disconnect();
        },
      }
    );
  }

  animateOut() {}
}
