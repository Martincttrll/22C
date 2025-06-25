import gsap from "gsap";
import { Detection } from "@classes/Detection.js";
import { Physics2DPlugin } from "gsap/all";
gsap.registerPlugin(Physics2DPlugin);

export class Archives {
  constructor({ element }) {
    this.paths = [
      "src/assets/archives/10.png",
      "src/assets/archives/1.png",
      "src/assets/archives/2.png",
      "src/assets/archives/3.png",
      "src/assets/archives/4.png",
      "src/assets/archives/5.png",
      "src/assets/archives/6.png",
      "src/assets/archives/7.png",
      "src/assets/archives/8.png",
      "src/assets/archives/9.png",
    ];
    this.element = element;
    this.images = [];
    this.mouseOver = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.currentPathIndex = 0;
    this.interval = null;
    this.addEventListeners();
    this.createTapHelper();
  }

  createImageAt(x, y) {
    const img = document.createElement("img");
    img.src = this.paths[this.currentPathIndex];
    this.currentPathIndex = (this.currentPathIndex + 1) % this.paths.length;

    img.classList.add("archive-image");
    img.alt = "Archive Image";
    img.loading = "lazy";
    img.draggable = false;
    img.style.position = "absolute";
    img.style.width = "100px";
    img.style.height = "auto";
    const rect = this.element.getBoundingClientRect();
    img.style.left = `${x - rect.left}px`;
    img.style.top = `${y - rect.top}px`;
    img.style.transform = "translate(-50%, -50%)";

    this.element.appendChild(img);

    gsap.to(img, {
      duration: 2,
      physics2D: {
        angle: 90,
        gravity: 400,
        velocity: Math.random() * 100 - 50,
      },
      ease: "power2.in",
      onComplete: () => {
        img.remove();
      },
    });
  }

  createTapHelper() {
    console.log("Creating tap helper for mobile devices");
    if (Detection.isMobile) {
      const tap = document.createElement("div");
      tap.className = "archives__tap-anim tap-anim";
      this.element.appendChild(tap);

      console.log("tap");
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

  startRain() {
    if (this.interval) return;
    this.interval = setInterval(() => {
      if (this.mouseOver) {
        this.createImageAt(this.mouseX, this.mouseY);
      }
    }, 80);
  }

  stopRain() {
    clearInterval(this.interval);
    this.interval = null;
  }

  addEventListeners() {
    if (!Detection.isMobile) {
      this.element.addEventListener("mouseenter", (e) => {
        this.mouseOver = true;
        this.startRain();
      });
      this.element.addEventListener("mousemove", (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      });
      this.element.addEventListener("mouseleave", () => {
        this.mouseOver = false;
        this.stopRain();
      });
    } else {
      this.element.addEventListener("touchstart", (e) => {
        if (document.querySelector(".archives__tap-anim")) {
          document.querySelector(".archives__tap-anim").remove();
        }
        const touch = e.touches[0];
        this.createImageAt(touch.clientX, touch.clientY);
      });
    }
  }
}
