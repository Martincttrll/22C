import { mouse } from "../utils/mousePos";

export class BackgroundGradient {
  constructor(element) {
    this.element = element;
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
      blop.classList.add("background__gradient__blob", `blob__${i + 1}`);
      blop.dataset.offsetX = "0";
      blop.dataset.offsetY = "0";
      gradientWrapper.appendChild(blop);
    }

    this.element.appendChild(gradientWrapper);
    this.animate = this.animate.bind(this); // Assurer le bon `this`
    window.addEventListener("mousemove", this.animate);
  }

  animate() {
    const lerpFactor = 0.1;
    const blobs = document.querySelectorAll(".background__gradient__blob");

    blobs.forEach((blob, index) => {
      const movementFactor = 50 * (index + 1);
      const targetOffsetX =
        ((mouse.x - window.innerWidth / 2) / window.innerWidth) *
        movementFactor;
      const targetOffsetY =
        ((mouse.y - window.innerHeight / 2) / window.innerHeight) *
        movementFactor;

      // Lerp pour lisser le déplacement
      const currentOffsetX = parseFloat(blob.dataset.offsetX);
      const currentOffsetY = parseFloat(blob.dataset.offsetY);

      const newOffsetX =
        currentOffsetX + (targetOffsetX - currentOffsetX) * lerpFactor;
      const newOffsetY =
        currentOffsetY + (targetOffsetY - currentOffsetY) * lerpFactor;

      blob.style.transform = `translate(-50%, -50%) translate(${newOffsetX}px, ${newOffsetY}px)`;

      blob.dataset.offsetX = newOffsetX;
      blob.dataset.offsetY = newOffsetY;
    });
  }
}
