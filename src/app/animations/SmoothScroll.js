import Lenis from "lenis";

export class SmoothScroll {
  constructor(wrapper, content) {
    this.wrapper = wrapper;
    this.content = content;
    this.lenis = null;
    this.create();
  }
  create() {
    this.lenis = new Lenis({
      wrapper: this.wrapper,
      content: this.content,
      lerp: 0.07,
    });
  }
}
