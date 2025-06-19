import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger);

export class SmoothScroll {
  constructor(wrapper, content) {
    this.wrapper = wrapper;
    this.content = content;
    this.lenis = null;
    this.progress = 0;
    this.create();
    this.initScrollTriggerProxy(this.lenis);
  }

  create() {
    this.lenis = new Lenis({
      wrapper: this.wrapper,
      content: this.content,
      lerp: 0.07,
      autoRaf: false,
    });

    this.lenis.on("scroll", () => {
      this.updateScrollProgress();
      ScrollTrigger.update();
    });

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  initScrollTriggerProxy(lenis) {
    const scroller = this.wrapper;

    ScrollTrigger.scrollerProxy(scroller, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value);
        } else {
          return lenis.scroll;
        }
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType:
        getComputedStyle(scroller).transform !== "none" ? "transform" : "fixed",
    });

    ScrollTrigger.defaults({
      scroller: scroller,
    });
  }

  updateScrollProgress() {
    const scroll = this.lenis.scroll;
    const maxScroll = this.lenis.limit;
    this.progress = maxScroll === 0 ? 0 : (scroll / maxScroll) * 100;
  }
}
