import Page from "@classes/Page";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { Detection } from "@classes/Detection";

gsap.registerPlugin(SplitText);
export class Discography extends Page {
  constructor() {
    super({
      element: ".discography",
      elements: {
        wrapper: ".discography__wrapper",
        cover: ".discography__album__cover",
        albums: ".discography__album",
        title: ".discography__album__title",
        date: ".discography__album__date",
        info: ".discography__album__info",
      },
    });
    this.isAnimating = false;
    this.isDisplayUI = true;

    this.scrollInfo = {
      position: 0,
      velocity: 0,
      friction: 0.94,
      sensitivity: 0.00015,
      delta: 0,
    };
  }

  create() {
    super.create();
    this.currentIndex = 0;
    this.currentAlbum = this.elements.albums[this.currentIndex];
    this.currentAlbum.style.visibility = "visible";
  }

  wrapWithOverflowHidden(target) {
    if (Array.isArray(target)) {
      target.forEach((char) => {
        if (
          char.parentNode &&
          char.parentNode.classList &&
          char.parentNode.classList.contains("splittext-mask-char")
        )
          return;
        const container = document.createElement("span");
        container.classList.add("splittext-mask-char");
        container.style.display = "inline-block";
        container.style.overflow = "hidden";
        container.style.verticalAlign = "middle";
        char.parentNode.insertBefore(container, char);
        container.appendChild(char);
      });
      return;
    }

    // Sinon, on wrap l'élément complet (pour le titre)
    if (target._splitText) target._splitText.revert();
    if (target.parentNode.classList.contains("splittext-mask"))
      return target.parentNode;

    const container = document.createElement("div");
    container.classList.add("splittext-mask");
    container.style.overflow = "hidden";
    target.parentNode.insertBefore(container, target);
    container.appendChild(target);
    return container;
  }

  addEventListeners() {
    super.addEventListeners();
    if (!Detection.isMobile) {
      window.addEventListener(
        "wheel",
        (e) => {
          this.scrollInfo.velocity += e.deltaY * this.scrollInfo.sensitivity;
        },
        { passive: true }
      );
      this.handleScroll();
    }
  }

  handleScroll() {
    requestAnimationFrame(() => this.handleScroll());

    const movingDetection = 0.01;
    const wasMoving = Math.abs(this.scrollInfo.velocity) >= movingDetection;

    this.scrollInfo.position += this.scrollInfo.velocity;
    this.scrollInfo.velocity *= this.scrollInfo.friction;

    const total = this.elements.albums.length;
    if (this.scrollInfo.position < 0) this.scrollInfo.position += total;
    if (this.scrollInfo.position >= total) this.scrollInfo.position -= total;

    if (this.canvasPage) {
      const isNowMoving = Math.abs(this.scrollInfo.velocity) >= movingDetection;
      const isNowStopped =
        wasMoving && Math.abs(this.scrollInfo.velocity) < movingDetection;

      this.canvasPage.onScroll(this.scrollInfo);

      if (isNowMoving) {
        this.hideUI();
      }

      if (isNowStopped) {
        const current = this.canvasPage.getCurrentAlbum();
        this.showUI(current);
      }
    }
  }

  showUI(albumData) {
    if (this.isAnimating || this.isDisplayUI) return;
    this.isAnimating = true;
    this.currentAlbum = Array.from(this.elements.albums).find(
      (album) => album.dataset.title === albumData.title
    );
    this.currentAlbum.style.visibility = "visible";

    const elements = [
      this.currentAlbum.querySelector(".discography__album__title"),
      this.currentAlbum.querySelector(".discography__album__info"),
      this.currentAlbum.querySelector(".discography__album__date"),
    ];

    elements.forEach((el) => {
      if (el && el._splitText) el._splitText.revert();
    });

    const splits = elements.map((el) =>
      SplitText.create(el, { type: "chars" })
    );

    this.wrapWithOverflowHidden(elements[0]);
    [1, 2].forEach((i) => {
      this.wrapWithOverflowHidden(splits[i].chars);
    });

    elements.forEach((el, i) => {
      if (el) el._splitText = splits[i];
    });

    gsap.set(splits[0].chars, { y: "-100%" });
    gsap.set([splits[1].chars, splits[2].chars], { x: "100%" });

    const tl = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
        this.isDisplayUI = true;
      },
    });

    tl.to(
      splits[0].chars,
      {
        y: "0%",
        duration: 0.3,
        ease: "power2.inOut",
        stagger: 0.04,
      },
      "+=0.05"
    );
    tl.fromTo(
      this.currentAlbum.querySelector(".separator"),
      {
        scaleX: 0,
      },
      {
        scaleX: 1,
        duration: 0.2,
        ease: "power2.inOut",
      },
      "<"
    );

    tl.to(
      [splits[1].chars, splits[2].chars],
      {
        x: "0%",
        duration: 0.3,
        ease: "power2.inOut",
        stagger: 0.04,
      },
      "<"
    );
  }

  hideUI() {
    if (!this.currentAlbum || this.isAnimating || !this.isDisplayUI) return;
    this.isAnimating = true;

    const elements = [
      this.currentAlbum.querySelector(".discography__album__title"),
      this.currentAlbum.querySelector(".discography__album__info"),
      this.currentAlbum.querySelector(".discography__album__date"),
    ];

    elements.forEach((el) => {
      if (el && el._splitText) el._splitText.revert();
    });

    const splits = elements.map((el) =>
      SplitText.create(el, { type: "chars" })
    );

    this.wrapWithOverflowHidden(elements[0]);
    [1, 2].forEach((i) => {
      this.wrapWithOverflowHidden(splits[i].chars);
    });

    elements.forEach((el, i) => {
      if (el) el._splitText = splits[i];
    });

    const tl = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
        this.isDisplayUI = false;
      },
    });

    tl.to(splits[0].chars, {
      y: "100%",
      duration: 0.3,
      ease: "power2.inOut",
      stagger: 0.04,
    });

    tl.to(
      this.currentAlbum.querySelector(".separator"),
      {
        scaleX: 0,
        duration: 0.2,
        ease: "power2.inOut",
      },
      "<"
    );

    tl.to(
      [splits[1].chars, splits[2].chars],
      {
        x: "-100%",
        duration: 0.3,
        ease: "power2.inOut",
        stagger: 0.04,
      },
      "<"
    );
  }

  show() {
    super.show();
    this.addEventListeners();
  }
}
