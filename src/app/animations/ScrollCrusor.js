import { getMousePosition } from "../utils/mousePos";
export class ScrollCursor {
  constructor(element, text) {
    this.element = element;
    this.text = text;
    this.create();
  }

  create() {
    const cursor = document.createElement("div");
    cursor.classList.add("cursor__scroll");
    const cursorText = document.createElement("div");
    cursorText.classList.add("cursor__scroll__text");

    cursor.appendChild(cursorText);
    this.element.appendChild(cursor);

    this.circleText(cursorText);
    this.animate(cursor);
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

  animate(cursor) {
    const { mouseX, mouseY } = getMousePosition();
    this.element.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1";
    });

    this.element.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
    });
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    requestAnimationFrame(() => this.animate(cursor));
  }
}
