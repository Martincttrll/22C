import gsap from "gsap";
export default class TextScramble {
  constructor(element) {
    this.element = element;

    this.create();
  }
  create() {
    this.initOriginalText();
    this.addEventListeners();
  }
  initOriginalText() {
    this.element.querySelectorAll("td").forEach((el) => {
      if (!el.dataset.original) {
        el.dataset.original = el.innerText;
      }
    });
  }

  addEventListeners() {
    this.element.addEventListener("mouseover", () => {
      this.element.querySelectorAll("td").forEach((element) => {
        gsap.to(element, {
          duration: 1,
          scrambleText: {
            text: element.dataset.original,
            chars:
              "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
            revealDelay: 0.5,
          },
        });
      });
    });
  }
}
