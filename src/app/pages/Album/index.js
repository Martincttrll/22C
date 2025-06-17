import Page from "@classes/Page";
import TextScramble from "./textScramble";
export class Album extends Page {
  constructor() {
    super({
      element: ".album",
      elements: {
        wrapper: ".album__wrapper",
        tableRow: "tbody tr",
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

    // Supprime l'ancien background si déjà présent
    const oldBg = this.elements.wrapper.querySelector(".bg-mirror");
    if (oldBg) oldBg.remove();

    // Crée un nouvel élément pour le background
    const bg = document.createElement("div");
    bg.className = "bg-mirror";
    bg.style.position = "absolute";
    bg.style.inset = "0";
    bg.style.background = `url(${this.cover}) center/cover no-repeat`;
    bg.style.transform = "scaleX(-1)";
    bg.style.zIndex = "0";
    bg.style.pointerEvents = "none";
    bg.style.filter = "brightness(0.5)";

    this.elements.wrapper.style.position = "relative";
    this.elements.wrapper.prepend(bg);
  }
}
