import Page from "@classes/Page";
import TextScramble from "./textScramble";
export class Album extends Page {
  constructor() {
    super({
      element: ".album",
      elements: {
        wrapper: ".album__wrapper",
        tableRow: "tbody tr",
        backBtn: ".album__back__link",
      },
    });
  }

  create() {
    super.create();
    this.elements.tableRow.forEach((element) => {
      new TextScramble(element);
    });
    this.createBackground();
  }

  createBackground() {
    this.cover = this.elements.wrapper.dataset.cover;

    const oldBg = this.elements.wrapper.querySelector(".bg-mirror");
    if (oldBg) oldBg.remove();

    const bg = document.createElement("div");
    bg.className = "bg-mirror";
    bg.style.position = "absolute";
    bg.style.inset = "0";
    bg.style.background = `url(${this.cover}) center/cover no-repeat`;
    bg.style.transform = "scaleX(-1)";
    bg.style.zIndex = "0";
    bg.style.pointerEvents = "none";
    bg.style.filter = "brightness(0.5) grayscale(1)";

    this.elements.wrapper.style.position = "relative";
    this.elements.wrapper.prepend(bg);
  }

  addEventListeners() {
    super.addEventListeners();
    this.elements.backBtn.addEventListener(
      "click",
      (e) => {
        e.stopPropagation();
        this.canvasPage.onClickBack();
      },
      { once: true }
    );
  }
}
