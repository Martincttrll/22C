export class BackgroundGradient {
  constructor(element) {
    this.element = document.querySelector(element);
    if (!this.element) {
      console.error(`L'élément "${element}" n'existe pas.`);
      return;
    }

    this.create();
  }

  create() {
    const gradientWrapper = document.createElement("div");
    gradientWrapper.classList.add("background__gradient__wrapper");

    for (let i = 0; i < 4; i++) {
      const blop = document.createElement("div");
      blop.classList.add("background__gradient__blob", `blob__${i}`);
      gradientWrapper.appendChild(blop);
    }

    this.element.appendChild(gradientWrapper);
  }
}
