import Component from "./Component.js";
export default class Animation extends Component {
  constructor({ element, elements }) {
    super({ element, elements });

    this.previousScroll = window.scrollY;
    this.isScrollingDown = true;

    this.createObsverver();
    this.animateOut();
  }
  createObsverver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && this.isScrollingDown) {
          this.animateIn();
        } else {
          this.animateOut();
        }
      });
    });
    this.observer.observe(this.element);
  }

  animateIn() {}
  animateOut() {}
}
