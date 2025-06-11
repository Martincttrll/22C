import Page from "../../classes/Page";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { Detection } from "../../classes/Detection";

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
  }

  create() {
    super.create();
    this.currentIndex = 0;
    this.currentAlbum = this.elements.albums[this.currentIndex];
    this.currentAlbum.style.visibility = "visible";
    this.addEventListeners();
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

  animateCurrentAlbum(next = true) {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const newAlbum = next ? this.nextAlbum : this.previousAlbum;
    const oldElems = [
      this.currentAlbum.querySelector(".discography__album__title"),
      this.currentAlbum.querySelector(".discography__album__info"),
      this.currentAlbum.querySelector(".discography__album__date"),
    ];
    const newElems = [
      newAlbum.querySelector(".discography__album__title"),
      newAlbum.querySelector(".discography__album__info"),
      newAlbum.querySelector(".discography__album__date"),
    ];

    [...oldElems, ...newElems].forEach((el) => {
      if (el && el._splitText) el._splitText.revert();
    });

    const oldSplits = oldElems.map((el) =>
      SplitText.create(el, { type: "chars" })
    );
    const newSplits = newElems.map((el) =>
      SplitText.create(el, { type: "chars" })
    );
    this.wrapWithOverflowHidden(oldElems[0]);
    this.wrapWithOverflowHidden(newElems[0]);
    [1, 2].forEach((i) => {
      this.wrapWithOverflowHidden(oldSplits[i].chars);
      this.wrapWithOverflowHidden(newSplits[i].chars);
    });
    oldElems.forEach((el, i) => {
      if (el) el._splitText = oldSplits[i];
    });
    newElems.forEach((el, i) => {
      if (el) el._splitText = newSplits[i];
    });

    gsap.set(newSplits[0].chars, { y: next ? "-100%" : "100%" });
    gsap.set([newSplits[1].chars, newSplits[2].chars], {
      x: next ? "100%" : "-100%",
    });

    const tl = gsap.timeline({
      onStart: () => {
        this.canvasPage.scrollToIndex(next);
      },
      onComplete: () => {
        this.isAnimating = false;
      },
    });

    tl.to(oldSplits[0].chars, {
      y: next ? "100%" : "-100%",
      duration: 0.3,
      ease: "power2.inOut",
      stagger: 0.04,
    });
    tl.to(
      [oldSplits[1].chars, oldSplits[2].chars],
      {
        x: next ? "-100%" : "100%",
        duration: 0.3,
        ease: "power2.inOut",
        stagger: 0.04,
      },
      "<"
    );

    tl.add(() => {
      this.currentAlbum.style.visibility = "hidden";
      this.currentAlbum = newAlbum;
      this.currentIndex = next ? this.nextIndex : this.previousIndex;
      this.currentAlbum.style.visibility = "visible";
    });

    tl.to(
      newSplits[0].chars,
      {
        y: "0%",
        duration: 0.3,
        ease: "power2.inOut",
        stagger: 0.04,
      },
      "+=0.05"
    );
    tl.to(
      [newSplits[1].chars, newSplits[2].chars],
      {
        x: "0%",
        duration: 0.3,
        ease: "power2.inOut",
        stagger: 0.04,
      },
      "<"
    );
  }

  addEventListeners() {
    super.addEventListeners();
    if (!Detection.isMobile) {
      window.addEventListener(
        "wheel",
        (e) => {
          this.direction = e.deltaY < 0 ? "up" : "down";
          this.handleWheel();
        },
        {
          passive: true,
        }
      );
    } else {
      let startY = 0;
      window.addEventListener("touchstart", (e) => {
        startY = e.touches[0].clientY;
      });
      window.addEventListener("touchend", (e) => {
        const endY = e.changedTouches[0].clientY;
        if (endY > startY + 10) {
          this.direction = "down";
        } else if (endY < startY - 10) {
          this.direction = "up";
        }
        this.handleWheel();
      });
    }
  }

  handleWheel() {
    if (this.direction === "down") {
      if (this.currentIndex === this.elements.albums.length - 1) {
        this.nextIndex = 0;
      } else {
        this.nextIndex = this.currentIndex + 1;
      }
      this.nextAlbum = this.elements.albums[this.nextIndex];
      this.next();
    } else if (this.direction === "up") {
      if (this.currentIndex === 0) {
        this.previousIndex = this.elements.albums.length - 1;
      } else {
        this.previousIndex = this.currentIndex - 1;
      }
      this.previousAlbum = this.elements.albums[this.previousIndex];
      this.previous();
    }
  }

  next() {
    this.animateCurrentAlbum(true);
  }
  previous() {
    this.animateCurrentAlbum(false);
  }
}
