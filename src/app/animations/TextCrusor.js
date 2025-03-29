import { mouse } from "../utils/mousePos";
export class TextCursor {
  constructor(element, text) {
    this.element = element;
    this.text = text;

    this.cursor = null;

    this.lerpFactor = 0.1;
    this.currentX = 0;
    this.currentY = 0;
    this.cursorHasMoved = false;
    this.create();
  }

  create() {
    this.cursor = document.createElement("div");
    this.cursor.classList.add("cursor__scroll");
    const cursorText = document.createElement("div");
    cursorText.classList.add("cursor__scroll__text");

    this.cursor.appendChild(cursorText);
    document.querySelector("body").appendChild(this.cursor);

    this.circleText(cursorText);
    this.animate();
    this.addEventListener();
  }

  circleText(cursorText) {
    for (let i = 0; i < this.text.length; i++) {
      const span = document.createElement("span");
      span.innerText = this.text[i];
      cursorText.appendChild(span);
      span.style.transform = `rotate(${
        (360 / this.text.length) * i
      }deg) translateY(-30px)`;
    }
  }

  addEventListener() {
    document.addEventListener(
      "mousemove",
      () => {
        if (!this.cursorHasMoved) {
          this.cursorHasMoved = true;
          this.cursor.style.opacity = "1";
        }
      },
      { once: true }
    );
    this.element.addEventListener("mouseover", () => {
      if (this.cursorHasMoved) {
        this.cursor.style.opacity = "1";
      }
    });

    this.element.addEventListener("mouseleave", () => {
      this.cursor.style.opacity = "0";
    });
  }

  animate() {
    this.currentX += (mouse.x - this.currentX) * this.lerpFactor;
    this.currentY += (mouse.y - this.currentY) * this.lerpFactor;

    this.cursor.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`;
    requestAnimationFrame(() => this.animate());
  }
}
