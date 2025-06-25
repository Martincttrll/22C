import gsap from "gsap";
import Component from "@classes/Component";
export class Preloader extends Component {
  constructor() {
    super({
      element: ".preloader",
      elements: {
        title: ".preloader__title",
        barOuter: ".preloader__bar",
        bar: ".preloader__bar__inner",
        percent: ".preloader__percent",
      },
    });

    this.minDisplayTime = 1000;
    this.entryStartTime = performance.now();
    this.loadAssets().then(() => {
      const elapsed = performance.now() - this.entryStartTime;
      const delay = Math.max(0, this.minDisplayTime - elapsed);
      setTimeout(() => {
        this.onLoaded();
      }, delay);
    });
  }

  loadAssets() {
    return new Promise((resolve) => {
      const totalSteps = 100;
      let current = 0;

      const interval = setInterval(() => {
        current++;

        this.updateCounter(current);

        if (current >= totalSteps) {
          clearInterval(interval);
          resolve();
        }
      }, 20);
    });
  }
  onLoaded() {
    return new Promise((resolve) => {
      this.emit("completed");

      this.animateOut = gsap.timeline({
        delay: 0.5,
        onComplete: () => {
          this.destroy();
          resolve();
        },
      });
      const rect = this.elements.title.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const titleCenterX = rect.left + rect.width / 2;
      const titleCenterY = rect.top + rect.height / 2;

      // Décalage à appliquer pour centrer la lettre sur l'écran
      const deltaX = centerX - titleCenterX;
      const deltaY = centerY - titleCenterY;

      this.animateOut.to(
        [this.elements.bar, this.elements.percent, this.elements.barOuter],
        {
          autoAlpha: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        "-=0.8"
      );
      this.animateOut.to(this.elements.title, {
        scale: 100,
        x: deltaX,
        y: deltaY,
        duration: 1,
        ease: "power2.inOut",
      });
      this.animateOut.to(this.element, {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    });
  }

  updateCounter(value) {
    const padded = value.toString().padStart(3, "0");
    this.elements.percent.innerText = padded;
    this.elements.bar.style.width = `${value}%`;
  }
  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
