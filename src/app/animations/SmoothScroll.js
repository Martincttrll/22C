import "lenis/dist/lenis.css";
import Lenis from "lenis";

export class SmoothScroll {
  constructor(wrapper, content) {
    this.wrapper = wrapper;
    this.content = content;

    this.create();
  }
  create() {
    const lenis = new Lenis({
      wrapper: this.wrapper,
      content: this.content,
      lerp: 0.08,
      autoRaf: true,
    });
  }
}
