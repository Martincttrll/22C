import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export class SmoothScroll {
  constructor(wrapper, content) {
    this.wrapper = wrapper;
    this.content = content;
    this.smoother = null;
    this.create();
  }

  create() {
    this.smoother = ScrollSmoother.create({
      wrapper: this.wrapper,
      content: this.content,
      smooth: 1.5,
      effects: true,
      ignoreMobileResize: true,
    });
    console.log(this.smoother);
  }
}
