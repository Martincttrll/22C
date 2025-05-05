import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export class HeadingShrink {
  constructor(smoother, startEl, endEl) {
    this.smoother = smoother;
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
      start: "top top+=20px",
      onEnter: () => {
        this.startEl.classList.add("hidden");
      },
      markers: true,
      onLeaveBack: () => {
        this.startEl.classList.remove("hidden");
      },
    });

    gsap.to(this.startEl, {
      scale: scaleRatio,
      x: "2rem",
      ease: "power2.out",
      scrollTrigger: {
        trigger: this.startEl,
        start: "bottom bottom",
        end: `bottom top`,
        scrub: true,
      },
    });
  }
}
