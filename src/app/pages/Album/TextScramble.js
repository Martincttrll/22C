import gsap from "gsap";
import { Detection } from "@classes/Detection";

export default class TextScramble {
  constructor(element) {
    this.element = element;

    if (!Detection.isMobile) {
      this.create();
    }
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
        if (element.classList.contains("album__track__listen")) return;
        gsap.to(element, {
          duration: 1,
          scrambleText: {
            text: element.dataset.original,
            chars:
              "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!/:#?;&$%()-_=+*^",
            revealDelay: 0.5,
          },
        });
      });
    });
  }
}
