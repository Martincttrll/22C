import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export class HeadingShrink {
  constructor(lenis, startEl, endEl) {
    this.lenis = lenis;
    this.startEl = startEl;
    this.endEl = endEl;

    if (!this.startEl || !this.endEl) {
      console.warn("Elements not found for animation");
      return;
    }

    this.create();
  }

  create() {
    const startElRect = this.startEl.getBoundingClientRect();
    const endElRect = this.endEl.getBoundingClientRect();

    const scaleRatio = endElRect.height / startElRect.height;

    ScrollTrigger.create({
      trigger: this.startEl,
      start: "top top+=20px", // Quand le haut de l'élément atteint 2rem du haut du viewport
      onEnter: () => {
        this.startEl.classList.add("hidden");
      },
      //   markers: true,
      // Optionnel : tu peux retirer la classe quand on remonte
      onLeaveBack: () => {
        this.startEl.classList.remove("hidden");
      },
    });

    // Animate position + scale
    gsap.to(this.startEl, {
      scale: scaleRatio,
      x: "2rem",
      ease: "power2.out",
      scrollTrigger: {
        trigger: this.startEl,
        start: "bottom+=300 bottom",
        end: `bottom top`,
        scrub: true,
      },
    });
  }
}
