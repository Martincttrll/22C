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
    this.isDisplayUI = false;

    this.scrollInfo = {
      position: 0,
      velocity: 0,
      friction: Detection.isMobile ? 0.96 : 0.94,
      sensitivity: 0.00015,
      delta: 0,
      touchStartY: 0,
      isTouching: false,
    };
  }

  create() {
    super.create();
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
        container.style.whiteSpace = "pre";
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
    container.style.whiteSpace = "normal";
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
    } else {
      window.addEventListener(
        "touchstart",
        (e) => {
          this.scrollInfo.touchStartY = e.touches[0].clientY;
          this.scrollInfo.isTouching = true;
          this.scrollInfo.velocity = 0;
        },
        { passive: true }
      );

      window.addEventListener(
        "touchmove",
        (e) => {
          if (!this.scrollInfo.isTouching) return;

          const currentY = e.touches[0].clientY;
          const deltaY = this.scrollInfo.touchStartY - currentY;
          this.scrollInfo.touchStartY = currentY;

          // Ajuste la sensibilité pour le touch
          this.scrollInfo.velocity +=
            deltaY * (this.scrollInfo.sensitivity * 2);
        },
        { passive: true }
      );

      window.addEventListener(
        "touchend",
        () => {
          this.scrollInfo.isTouching = false;
        },
        { passive: true }
      );
    }
    this.handleScroll();
  }

  handleScroll() {
    requestAnimationFrame(() => this.handleScroll());

    const movingDetection = 0.005;
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
    const albums = Array.from(this.elements.albums);
    this.currentAlbum = albums.find(
      (album) => album.dataset.title === albumData.title
    );
    albums.forEach((album) => (album.style.visibility = "hidden"));
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
      SplitText.create(el, { type: "chars", smartWrap: true })
    );

    this.wrapWithOverflowHidden(elements[0]);
    [1, 2].forEach((i) => {
      this.wrapWithOverflowHidden(splits[i].chars);
    });

    elements.forEach((el, i) => {
      if (el) el._splitText = splits[i];
    });

    gsap.set(splits[0].chars, { yPercent: "-100" });
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
        yPercent: "0",
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
      SplitText.create(el, { type: "chars", smartWrap: true })
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
      y: "200%",
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
    const firstAlbum = document.querySelectorAll(".discography__album")[0];
    const firstAlbumData = {
      title: firstAlbum.getAttribute("data-title"),
      url: firstAlbum.querySelector("a").getAttribute("href"),
    };

    this.showUI(firstAlbumData);
    this.addEventListeners();
  }
}
