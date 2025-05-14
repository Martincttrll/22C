import { mouse } from "../utils/mousePos";
import { Detection } from "../classes/Detection";
export class TextCursor {
  constructor({ elementsConfig }) {
    this.elementsConfig = elementsConfig;
    this.cursor = null;
    this.lerpFactor = 0.1;
    this.currentX = 0;
    this.currentY = 0;
    this.create();
  }

  create() {
    if (Detection.isMobile) {
      return;
    }
    this.cursor = document.createElement("div");
    this.cursor.classList.add("cursor");

    this.cursorText = document.createElement("div");
    this.cursorText.classList.add("cursor__text");
    this.cursor.appendChild(this.cursorText);

    this.cursorIcon = document.createElement("div");
    this.cursorIcon.classList.add("cursor__icon");
    this.cursor.appendChild(this.cursorIcon);

    document.querySelector("body").appendChild(this.cursor);

    this.addEventListener();
    this.animate();
  }

  update({ text = "", icon = null }) {
    this.cursorText.innerHTML = "";
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement("span");
      span.innerText = text[i];
      this.cursorText.appendChild(span);
      span.style.transform = `rotate(${
        (360 / text.length) * i
      }deg) translateY(-30px)`;
    }

    this.cursorIcon.innerHTML = icon || "";
  }

  updateIconOnClick(newIcon) {
    // Méthode pour changer dynamiquement l'icône au clic
    this.cursorIcon.innerHTML = newIcon;

    // Vous pouvez ajouter ici la logique pour déclencher une animation GSAP
    console.log("Icon updated on click!");
  }

  addEventListener() {
    this.elementsConfig.forEach(({ element, text, icon, onClickIcon }) => {
      element.addEventListener("mouseover", () => {
        this.update({ text, icon });
        this.show();
      });

      element.addEventListener("mouseleave", () => {
        this.hide();
      });
      if (onClickIcon) {
        element.addEventListener("click", () => {
          this.updateIconOnClick(onClickIcon);
        });
      }
    });
  }

  show() {
    this.cursor.style.opacity = "1";
  }

  hide() {
    this.cursor.style.opacity = "0";
  }

  animate() {
    this.currentX += (mouse.x - this.currentX) * this.lerpFactor;
    this.currentY += (mouse.y - this.currentY) * this.lerpFactor;

    this.cursor.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
    requestAnimationFrame(() => this.animate());
  }
}
