import { getMousePosition } from "../utils/mousePos";
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
      gradientWrapper.appendChild(blop);
    }
    this.element.appendChild(gradientWrapper);
    this.animate();
  }

  animate() {
    const { mouseX, mouseY } = getMousePosition();
    const lerpFactor = 0.1;
    const blobs = document.querySelectorAll(".background__gradient__blob");
    blobs.forEach((blob, index) => {
      const movementFactor = 50 * (index + 1);
      const targetOffsetX =
        ((mouseX - window.innerWidth / 2) / window.innerWidth) * movementFactor;
      const targetOffsetY =
        ((mouseY - window.innerHeight / 2) / window.innerHeight) *
        movementFactor;

      // Lerp pour lisser le déplacement
      const currentOffsetX = parseFloat(blob.dataset.offsetX || 0);
      const currentOffsetY = parseFloat(blob.dataset.offsetY || 0);

      // Interpolation linéaire pour le déplacement
      const newOffsetX =
        currentOffsetX + (targetOffsetX - currentOffsetX) * lerpFactor;
      const newOffsetY =
        currentOffsetY + (targetOffsetY - currentOffsetY) * lerpFactor;

      // Appliquer la nouvelle position
      blob.style.transform = `translate(-50%, -50%) translate(${newOffsetX}px, ${newOffsetY}px)`;

      // Sauvegarder les nouvelles positions pour la prochaine itération
      blob.dataset.offsetX = newOffsetX;
      blob.dataset.offsetY = newOffsetY;
    });
    requestAnimationFrame(() => this.animate());
  }
}
