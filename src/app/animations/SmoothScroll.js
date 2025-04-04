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
  }

  create() {
    this.lenis = new Lenis({
      wrapper: this.wrapper,
      content: this.content,
      lerp: 0.07,
      autoRaf: false,
    });

    this.initScrollTriggerProxy(this.lenis);

    const raf = (time) => {
      this.lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    this.lenis.on("scroll", () => {
      this.updateScrollProgress();
    });
  }

  updateScrollProgress() {
    const scroll = this.lenis.scroll;
    const maxScroll = this.lenis.limit;

    this.progress = maxScroll === 0 ? 0 : (scroll / maxScroll) * 100;
  }

  initScrollTriggerProxy(lenis) {
    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        // setter : ScrollTrigger veut scrollTo()
        if (arguments.length) {
          lenis.scrollTo(value);
        } else {
          // getter : ScrollTrigger demande "on est scrollé à combien ?"
          return lenis.scroll;
        }
      },
      getBoundingClientRect() {
        // dit à ScrollTrigger la taille de la fenêtre visible
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: document.body.style.transform ? "transform" : "fixed",
    });

    ScrollTrigger.defaults({
      scroller: document.body,
    });
  }
}
