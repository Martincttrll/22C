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
    return new Promise((resolve) => {
      const assets = window.ASSETS.critical || "[]";

      const totalSteps = assets.length;
      let loaded = 0;

      if (totalSteps === 0) {
        this.updateCounter(100);
        resolve();
        return;
      }

      const onAssetLoad = () => {
        loaded++;
        const progress = Math.round((loaded / totalSteps) * 100);
        gsap.to(this, {
          dummy: progress,
          duration: 0.3,
          onUpdate: () => this.updateCounter(Math.round(this.dummy)),
        });
        if (loaded >= totalSteps) {
          resolve();
        }
      };

      assets.forEach((src) => {
        if (src.match(/\.(mp3|wav|ogg)$/)) {
          console.log(src);
          const audio = new Audio();
          audio.src = src;
          audio.crossOrigin = "anonymous";
          audio.preload = "auto";
          audio.addEventListener(
            "canplaythrough",
            () => {
              window.PRELOADED[src] = audio;
              onAssetLoad();
            },
            { once: true }
          );
          audio.addEventListener("error", onAssetLoad, { once: true });
        } else if (src.match(/\.(mp4|webm)$/)) {
          const video = document.createElement("video");
          video.src = src;
          video.preload = "auto";
          video.crossOrigin = "anonymous";
          video.addEventListener(
            "loadeddata",
            () => {
              window.PRELOADED[src] = video;
              onAssetLoad();
            },
            { once: true }
          );
          video.addEventListener("error", onAssetLoad, { once: true });
        } else {
          const img = new Image();
          img.src = src;
          img.crossOrigin = "anonymous";
          (img.onload = () => {
            window.PRELOADED[src] = img;
            onAssetLoad();
          }),
            { once: true };
          img.onerror = onAssetLoad;
        }
      });
    });
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
