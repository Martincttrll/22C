import { UAParser } from "ua-parser-js";
import Animation from "../classes/Animation.js";

export default class Reels extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    console.log(element);
    this.element.muted = true;
    this.createCursor();
    this.addEventListeners();
  }

  createCursor() {
    this.cursor = document.createElement("div");
    this.cursor.classList.add("reel-cursor");

    const cursorText = document.createElement("div");
    cursorText.classList.add("cursor__reels");
    cursorText.innerText = "▶";

    this.cursor.appendChild(cursorText);
    document.body.appendChild(this.cursor);

    this.cursor.style.position = "absolute";
    this.cursor.style.pointerEvents = "none";
    this.cursor.style.opacity = "0";
    this.cursor.style.transition = "opacity 0.3s ease";
  }
  /*TO DO (UA PARSER) : 
 DESKTOP : cursor text click ! (svg son coupé au milieu) ()=> activer le son au hover comme actuellement
 MOBILE : encart explication rester appuyer sur la video pour le son.
*/
  addEventListeners() {
    if (isSoundEnabled) {
      this.element.addEventListener("mouseenter", () => {
        this.element.muted = false;
        this.cursor.style.opacity = "1";
      });

      this.element.addEventListener("mousemove", (event) => {
        this.cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      });

      this.element.addEventListener("mouseleave", () => {
        this.element.muted = true;

        this.cursor.style.opacity = "0";
      });

      this.element.addEventListener("click", () => {
        if (this.element.muted) {
          this.element.muted = false;
          this.cursor.innerText = "Unmuted";
        } else {
          this.element.muted = true;
          this.cursor.innerText = "Muted";
        }
      });
    }
  }

  animateIn() {}
  animateOut() {}
}
