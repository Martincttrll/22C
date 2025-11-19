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

    window.PRELOADED = {};

    this.animateIn();

    document.body.style.visibility = "visible";

    this.minDisplayTime = 1500;
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
    const assets = window.ASSETS.critical || [];
    if (!Array.isArray(assets) || assets.length === 0) {
      this.updateCounter(100);
      return Promise.resolve();
    }

    const total = assets.length;
    let counted = 0;

    const updateProgress = () => {
      counted++;
      const percent = Math.round((counted / total) * 100);
      gsap.to(this, {
        dummy: percent,
        duration: 0.3,
        onUpdate: () => this.updateCounter(Math.round(this.dummy)),
      });
    };

    const loadAsset = (src) => {
      return new Promise((resolve) => {
        let element;
        let resolved = false;

        const finishWait = () => {
          if (!resolved) {
            resolved = true;
            updateProgress();
            resolve(); // we stop WAITING, not LOADING
          }
        };

        // timeout stops waiting, NOT loading
        const timeoutId = setTimeout(() => {
          console.warn("Asset slow, skipping wait:", src);
          finishWait();
        }, 5000); // or 3000, or dynamic later…

        const onSuccess = () => {
          clearTimeout(timeoutId);
          window.PRELOADED[src] = element;
          finishWait();
        };

        const onError = () => {
          clearTimeout(timeoutId);
          console.warn("Asset error:", src);
          finishWait();
        };

        // type detection
        if (/\.(mp4|webm)$/i.test(src)) {
          element = document.createElement("video");
          element.preload = "auto";
          element.crossOrigin = "anonymous";

          element.onloadeddata = onSuccess;
          element.onerror = onError;
          element.src = src;
        } else if (/\.(mp3|wav|ogg)$/i.test(src)) {
          element = new Audio();
          element.preload = "auto";
          element.crossOrigin = "anonymous";

          element.addEventListener("canplaythrough", onSuccess, { once: true });
          element.addEventListener("error", onError, { once: true });
          element.src = src;
        } else {
          element = new Image();
          element.crossOrigin = "anonymous";

          element.onload = onSuccess;
          element.onerror = onError;
          element.src = src;
        }

        // IMPORTANT :
        // Even after timeout, the browser CONTINUES to download the element.
        // When it finishes, onSuccess will populate PRELOADED.
      });
    };

    return Promise.all(assets.map(loadAsset));
  }

  onLoaded() {
    return new Promise((resolve) => {
      this.emit("completed");

      this.animateOut = gsap.timeline({
        delay: 0.5,
        onComplete: () => {
          this.emit("animationCompleted");
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
        scale: 300,
        x: deltaX,
        y: deltaY,
        duration: 1,
        ease: "power4.in",
      });
      this.animateOut.to(
        this.element,
        {
          autoAlpha: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "-=0.3"
      );
    });
  }

  animateIn() {
    gsap.fromTo(
      [
        this.elements.title,
        this.elements.bar,
        this.elements.barOuter,
        this.elements.percent,
      ],
      {
        autoAlpha: 0,
      },
      {
        autoAlpha: 1,

        duration: 0.5,
        ease: "power2.inOut",
      }
    );
  }

  updateCounter(value) {
    const padded = value.toString().padStart(3, "0");
    this.elements.percent.innerText = padded;
    this.elements.bar.style.width = `${value}%`;
  }
  destroy() {
    this.element.remove(this.element);
  }
}
