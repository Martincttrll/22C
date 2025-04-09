import gsap from "gsap";

export class Preloader {
  constructor() {
    this.container = document.querySelector(".preloader__barcode__wrapper");
    this.totalBars = 26;
    this.keyword = "22CARBONE";
    this.bars = [];

    this.create();
  }

  create() {
    this.generateBars();
    this.displayPercentageLabels();
    this.addKeywordToBars();
    this.animatePreloader();
  }

  generateBars() {
    const windowWidth = window.innerWidth;
    const minWidth = windowWidth * 0.0005; // 0.5%
    const maxWidth = windowWidth * 0.025; // 2%
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
      this.container.appendChild(bar);

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
      if ((i = 0)) {
        label.classList.add("preloader__bar__percent", "unit");
        this.percentageUnit = label;
      } else if ((i = 1)) {
        label.classList.add("preloader__bar__percent", "ten");
        this.percentageTen = label;
      } else if ((i = 2)) {
        label.classList.add("preloader__bar__percent", "hundred");
        this.percentageHundred = label;
      }
      label.innerText = "0";
      console.log(bar);
      const line = bar.querySelector(".preloader__bar__line");
      line.appendChild(label);
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
    this.bars.forEach((barObj) => {
      const { bar } = barObj;
      const line = bar.querySelector(".preloader__bar__line");

      gsap.set(line, { opacity: 0, filter: "blur(10px)" });
    });

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

    this.animatePercentageLabels();
  }

  animatePercentageLabels() {
    const duration = 5;

    gsap.to(this.percentageUnit, {
      innerText: 9,
      duration: duration,
      ease: "none",
      snap: { innerText: 1 },
    });

    gsap.to(this.percentageTen, {
      innerText: 9,
      duration: duration,
      ease: "none",
      snap: { innerText: 10 },
    });

    gsap.to(this.percentageHundred, {
      innerText: 1,
      duration: duration,
      ease: "none",
      snap: { innerText: 100 },
    });
  }
}
