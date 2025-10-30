import gsap from "gsap";
import SplitText from "gsap/SplitText";
import Animation from "@classes/Animation.js";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default class ParagraphFalling extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });

    this.splitText = SplitText.create(element, {
      type: "chars,words",
      charsClass: "char",
      wordsClass: "word",
      mask: "words",
    });
  }

  animateIn() {
    const chars = this.splitText.chars;
    const specialChars = chars.filter((char) => char.textContent === "2");
    const otherChars = chars.filter((char) => char.textContent !== "2");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.element,
        start: "top 30%",
        end: "top 10%",
        scrub: 1,
      },
    });

    tl.to(otherChars, {
      y: "100%",
      opacity: 0.2,
      stagger: {
        amount: 0.5,
        from: "random",
      },
      ease: "power2.in",
    });

    tl.to(
      specialChars,
      {
        scale: 1.2,
        fontWeight: "bold",
        ease: "power2.out",
      },
      "<"
    );
  }

  animateOut() {}
}
