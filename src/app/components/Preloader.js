import gsap from "gsap";
import Component from "@classes/Component";
export class Preloader extends Component {
  constructor() {
    super({
      element: ".preloader",
      elements: {
        container: ".preloader__barcode__wrapper",
      },
    });
    this.totalBars = 26;
    this.keyword = "22CARBONE";
    this.bars = [];
    this.minDisplayTime = 1000;
    this.entryStartTime = performance.now();

    this.createLoader();

    this.loadAssets().then(() => {
      const elapsed = performance.now() - this.entryStartTime;
      const delay = Math.max(0, this.minDisplayTime - elapsed);
      setTimeout(() => {
        this.onLoaded();
      }, delay);
    });
  }

  createLoader() {
    this.generateBars();
    this.displayPercentageLabels();
    this.addKeywordToBars();
    this.animatePreloader();
  }

  generateBars() {
    const windowWidth = window.innerWidth;
    const minWidth = windowWidth * 0.0005;
    const maxWidth = windowWidth * 0.025;
    const minSpacing = 10;

    const usedZones = [];

    let attempts = 0;
    let maxAttempts = this.totalBars * 10; // pour éviter une boucle infinie
    let created = 0;

    while (created < this.totalBars && attempts < maxAttempts) {
      const width = Math.random() * (maxWidth - minWidth) + minWidth;
      const x = Math.random() * (windowWidth - width);
      const overlaps = usedZones.some((zone) => {
        return !(
          x + width + minSpacing < zone.x ||
          x > zone.x + zone.width + minSpacing
        );
      });

      if (overlaps) {
        attempts++;
        continue;
      }

      const bar = document.createElement("div");
      bar.classList.add("preloader__bar");

      const line = document.createElement("div");
      line.classList.add("preloader__bar__line");
      line.style.width = `${width}px`;

      bar.style.position = "absolute";
      bar.style.left = `${x}px`;
      bar.style.top = "0";

      bar.appendChild(line);
      this.elements.container.appendChild(bar);

      this.bars.push({ bar, line });
      usedZones.push({ x, width });
      created++;
    }
  }

  displayPercentageLabels() {
    let lastBars = this.bars
      .slice()
      .sort(
        (a, b) => parseFloat(b.bar.style.left) - parseFloat(a.bar.style.left)
      );

    lastBars = lastBars.slice(0, 3);

    lastBars.forEach((barObj, i) => {
      const { bar } = barObj;
      const label = document.createElement("div");
      if (i === 0) {
        label.classList.add("preloader__bar__percent", "unit");
        this.percentageUnit = label;
      } else if (i === 1) {
        label.classList.add("preloader__bar__percent", "ten");
        this.percentageTen = label;
      } else if (i === 2) {
        label.classList.add("preloader__bar__percent", "hundred");
        this.percentageHundred = label;
      }
      label.innerText = "0";
      const line = bar.querySelector(".preloader__bar__line");
      const lineRect = line.getBoundingClientRect();
      label.style.bottom = lineRect.bottom;
      label.style.left = lineRect.left;
      bar.appendChild(label);
    });
  }
  addKeywordToBars() {
    const keywordLength = this.keyword.length;
    const sortedBars = this.bars.sort(
      (b, a) => parseFloat(b.bar.style.left) - parseFloat(a.bar.style.left)
    );

    const availableBars = sortedBars.slice(0, this.bars.length - 3);

    const randomBars = [];
    while (randomBars.length < keywordLength) {
      const randomBar =
        availableBars[Math.floor(Math.random() * availableBars.length)];
      if (!randomBars.includes(randomBar)) {
        randomBars.push(randomBar);
      }
    }

    randomBars.sort(
      (b, a) => parseFloat(b.bar.style.left) - parseFloat(a.bar.style.left)
    );

    randomBars.forEach((barObj, index) => {
      const { bar } = barObj;
      const char = this.keyword[index];

      const textElement = document.createElement("div");
      textElement.classList.add("preloader__bar__text");
      textElement.innerText = char;

      const line = bar.querySelector(".preloader__bar__line");
      line.appendChild(textElement);
    });
  }

  animatePreloader() {
    const randomBars = [...this.bars];
    gsap.utils.shuffle(randomBars);

    randomBars.forEach((barObj, index) => {
      const { bar } = barObj;
      const line = bar.querySelector(".preloader__bar__line");

      gsap.to(line, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        delay: index * 0.1,
        ease: "power2.out",
      });
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

      this.animateOut.to(document.querySelectorAll(".preloader__bar__line"), {
        width: 0,
        duration: 1,
        ease: "power2.inOut",
        stagger: 0.01,
      });

      this.animateOut.to(
        [
          ...document.querySelectorAll(".preloader__bar__text"),
          ...document.querySelectorAll(".preloader__bar__percent"),
        ],
        {
          y: "100%",
          autoAlpha: 0,
          duration: 1,
          ease: "power2.inOut",
        },
        "-=0.8"
      );

      this.animateOut.to(this.element, {
        height: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    });
  }
  updateCounter(value) {
    const padded = value.toString().padStart(3, "0");

    if (this.percentageHundred) this.percentageHundred.innerText = padded[0];
    if (this.percentageTen) this.percentageTen.innerText = padded[1];
    if (this.percentageUnit) this.percentageUnit.innerText = padded[2];
  }
  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}
