import { Detection } from "../../classes/Detection";

export class Reels {
  constructor(element) {
    this.element = element;
    this.reels = this.element.querySelectorAll("video");
    this.addEventListeners();
  }

  /*TO DO (UA PARSER) : 
 DESKTOP : cursor text click ! (svg son coupé au milieu) ()=> activer le son au hover comme actuellement
 MOBILE : encart explication rester appuyer sur la video pour le son.
*/
  addEventListeners() {
    this.element.addEventListener("mouseenter", () => {
      this.element.muted = false;
    });

    this.element.addEventListener("mousemove", (event) => {
      this.cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    });

    this.element.addEventListener("mouseleave", () => {
      this.element.muted = true;
    });

    this.element.addEventListener("click", () => {
      if (this.element.muted) {
        this.element.muted = false;
      } else {
        this.element.muted = true;
      }
    });
  }
}
