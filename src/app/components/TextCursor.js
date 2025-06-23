import { mouse } from "@utils/mousePos";
import { Detection } from "@classes/Detection";
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

  updateIconOnClick(elementConfig) {
    const { icon, onClickIcon } = elementConfig;

    if (elementConfig.isToggled) {
      this.updateIcon(icon);
    } else {
      this.updateIcon(onClickIcon);
    }

    elementConfig.isToggled = !elementConfig.isToggled;
  }

  updateIcon(icon) {
    let newIcon;
    if (typeof icon === "function") {
      newIcon = icon();
    } else {
      newIcon = icon;
    }

    if (Array.isArray(newIcon)) {
      this.cursorIcon.innerHTML = "";
      newIcon.forEach((element) => {
        this.cursorIcon.appendChild(element);
      });
    } else if (newIcon instanceof HTMLElement) {
      this.cursorIcon.innerHTML = "";
      this.cursorIcon.appendChild(newIcon);
    } else if (typeof newIcon === "string") {
      this.cursorIcon.innerHTML = newIcon;
    }
  }

  addEventListener() {
    this.elementsConfig.forEach((elementConfig) => {
      const { element, text, icon, onClickIcon } = elementConfig;

      elementConfig.isToggled = false;

      element.addEventListener("mouseenter", () => {
        this.update({ text, icon });
        this.show();
      });

      element.addEventListener("mouseleave", () => {
        this.hide();
      });
      if (onClickIcon) {
        element.addEventListener("click", () => {
          this.updateIconOnClick(elementConfig);
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
