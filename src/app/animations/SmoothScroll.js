import Lenis from "lenis";

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
    });

    this.lenis.on("scroll", () => {
      this.updateScrollProgress();
    });

    this.raf();
  }

  updateScrollProgress() {
    const scroll = this.lenis.scroll;
    const maxScroll = this.lenis.limit;

    this.progress = maxScroll === 0 ? 0 : (scroll / maxScroll) * 100;
    console.log(this.progress);
  }

  raf() {
    const update = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
}
