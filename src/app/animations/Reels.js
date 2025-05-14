import { Detection } from "../classes/Detection";
import Animation from "../classes/Animation";

export default class Reels extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    // this.element = element;
    // this.elements.reels = this.element.querySelectorAll("video");
    this.isMuted = true;

    this.addEventListeners();
    this.addIntersectionObserver();
  }

  /*TO DO :
  faire hériter la classe de Animation
  animateIn() mobile : ptite anime de doigt qui appuie sur les reels (full widh du wrapper )
  animateOut() : mute 
*/
  addEventListeners() {
    if (!Detection.isMobile) {
      this.element.addEventListener("click", (e) => {
        console.log(e.target);
        this.isMuted = !this.isMuted;

        if (this.isMuted) {
          this.elements.reels.forEach((reel) => {
            reel.muted = true;
          });
        } else {
          e.target.muted = false;
        }

        this.elements.reels.forEach((reel) => {
          reel.addEventListener("mouseenter", () => {
            if (!this.isMuted) {
              reel.muted = false;
            }
          });

          reel.addEventListener("mouseleave", () => {
            reel.muted = true;
          });
        });
      });
    } else {
      this.elements.reels.forEach((reel) => {
        reel.addEventListener("click", () => {
          if (reel.muted) {
            this.elements.reels.forEach((otherReel) => {
              otherReel.muted = true;
            });
            reel.muted = false;
          } else {
            reel.muted = true;
          }
        });
      });
    }
  }
  animateIn() {
    console.log(this.elements.reels);
    console.log("Reels visible - animateIn");
    this.elements.reels.forEach((reel) => {
      reel.play().catch((error) => {
        console.warn("Video play failed:", error);
      });
    });
  }

  animateOut() {
    console.log(this.element);

    console.log(this.elements.reels);
    console.log("Reels hidden - animateOut");
    this.elements.reels.forEach((reel) => {
      reel.muted = true;
      reel.pause();
    });
  }
}
