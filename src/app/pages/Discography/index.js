import Page from "../../classes/Page";
import { each } from "lodash";
import gsap from "gsap";

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

    this.scrollAccumulator = 0;
    this.scrollThreshold = 1000;
  }

  create() {
    super.create();
    this.currentIndex = 0;
    this.currentAlbum = this.elements.albums[this.currentIndex];
    this.currentAlbum.style.visibility = "visible";
    this.onLinkOver();
    this.createFakePseudoElements();
    this.addEventListeners();
  }

  createFakePseudoElements() {
    each(this.elements.date, (date) => {
      let before = document.createElement("span");
      before.classList.add("before");
      date.appendChild(before);
    });
    each(this.elements.info, (info) => {
      let before = document.createElement("span");
      before.classList.add("before");
      info.appendChild(before);
    });
  }

  animateCurrentAlbum() {
    const tl = gsap.timeline();
    const before = this.currentAlbum.querySelectorAll(".before");
    if (before) {
      each(before, (el) => {
        tl.fromTo(
          el,
          { width: "100%" },
          { width: "100%", duration: 0.5, ease: "power2.inOut" }
        );
      });
    }
  }

  onLinkOver() {
    each(this.elements.albums, (album) => {
      album.addEventListener("mouseover", () => {
        this.elements.cover.src = album.dataset.cover;
      });
    });
  }

  onLinkClick() {
    each(this.elements.albums, (album) => {
      album.addEventListener("click", () => {
        console.log("");
      });
    });
  }

  addEventListeners() {
    super.addEventListeners();
    window.addEventListener("wheel", this.handleWheel.bind(this), {
      passive: true,
    });
  }

  handleWheel(e) {
    this.scrollAccumulator += Math.abs(e.deltaY);

    if (this.scrollAccumulator > this.scrollThreshold) {
      this.direction = e.deltaY < 0 ? "down" : "up";
      this.scrollAccumulator = 0;
      if (this.direction === "down") {
        if (this.currentIndex === this.elements.albums.length - 1) {
          this.nextIndex = 0;
        } else {
          this.nextIndex = this.currentIndex + 1;
        }
        this.nextAlbum = this.elements.albums[this.nextIndex];
        this.next();
      } else if (this.direction === "up") {
        this.scrollAccumulator = 0;
        if (this.currentIndex === 0) {
          this.previousIndex = this.elements.albums.length - 1;
        } else {
          this.previousIndex = this.currentIndex - 1;
        }
        this.previousAlbum = this.elements.albums[this.previousIndex];
        this.previous();
      }
    }
  }

  next() {
    this.animateCurrentAlbum();
    this.currentAlbum.style.visibility = "hidden";
    this.currentAlbum = this.nextAlbum;
    this.currentAlbum.style.visibility = "visible";
    this.currentIndex = this.nextIndex;
  }
  previous() {
    this.animateCurrentAlbum();
    this.currentAlbum.style.visibility = "hidden";
    this.currentAlbum = this.previousAlbum;
    this.currentAlbum.style.visibility = "visible";
    this.currentIndex = this.previousIndex;
  }
}
