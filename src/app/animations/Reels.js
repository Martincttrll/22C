import { Detection } from "@classes/Detection";
import Animation from "@classes/Animation";
import { gsap } from "gsap";
export default class Reels extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    this.isMuted = true;
  }

  addEventListeners() {
    if (!Detection.isMobile) {
      this.element.addEventListener("click", (e) => {
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
          if (document.querySelector(".tap-anim")) {
            document.querySelector(".tap-anim").remove();
          }
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
    if (Detection.isMobile) {
      const tap = document.createElement("div");
      tap.className = "reels__tap-anim tap-anim";
      this.element.appendChild(tap);

      gsap.fromTo(
        tap,
        { scale: 1, opacity: 1 },
        {
          scale: 3,
          opacity: 0,
          repeat: -1,
          yoyo: false,
          duration: 0.8,
          ease: "power1.out",
        }
      );
    }
  }

  animateOut() {
    if (document.querySelector(".reels__tap-anim")) {
      document.querySelector(".reels__tap-anim").remove();
    }
    this.elements.reels.forEach((reel) => {
      reel.muted = true;
    });
  }
}
