import Page from "@classes/Page";
import gsap from "gsap";
import TextScramble from "./TextScramble";
import { Detection } from "@classes/Detection";
import { each } from "lodash";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export class Album extends Page {
  constructor() {
    super({
      element: ".album",
      elements: {
        albumTitle: ".album__title",
        wrapper: ".album__wrapper",
        tableRow: "tbody tr",
        backBtn: ".album__back__link",
        playBtn: ".album__track__listen",
        duration: ".album__track__duration",
        trackName: ".album__track__name",
      },
    });
  }

  create() {
    super.create();
    this.tracks = new Map();
    this.loadTracks(this.elements.albumTitle.innerText);

    Array.from(this.elements.tableRow).forEach((element) => {
      new TextScramble(element);
    });
    this.createBackground();
    this.formatForMobile();
    const rows = document.querySelectorAll(".album__tracklist__table tbody tr");
    let maxHeight = 0;

    // trouver la hauteur maximale
    rows.forEach((row) => {
      const height = row.offsetHeight;
      if (height > maxHeight) maxHeight = height;
    });

    // appliquer la même hauteur à toutes
    rows.forEach((row) => {
      row.style.height = maxHeight + "px";
    });
  }

  createBackground() {
    this.cover = this.elements.wrapper.dataset.cover;
    const oldBg = this.elements.wrapper.querySelector(".bg-mirror");
    if (oldBg) oldBg.remove();
    const bg = document.createElement("div");
    bg.className = "bg-mirror";
    bg.style.position = "absolute";
    bg.style.inset = "0";
    bg.style.background = `url(${this.cover}) center/cover no-repeat`;
    bg.style.transform = "scaleX(-1)";
    bg.style.zIndex = "0";
    bg.style.pointerEvents = "none";
    bg.style.filter = "brightness(0.5) grayscale(1)";
    this.elements.wrapper.style.position = "relative";
    this.elements.wrapper.prepend(bg);
  }

  formatForMobile() {
    if (Detection.isMobile) {
      each(this.elements.duration, (duration) => {
        duration.innerText = duration.innerText.substr(3);
      });
      each(this.elements.tableRow, (tr) => {
        tr.querySelector(".album__track__album").remove();
      });

      const wrappers = [...document.querySelectorAll(".scroll-wrapper")];

      if (!wrappers.length) return;
      const heights = wrappers.map((w) => {
        const txt = w.querySelector(".scroll-text");
        return txt.getBoundingClientRect().height;
      });
      const minHeight = Math.min(...heights.filter((h) => h > 0));

      wrappers.forEach((wrapper, i) => {
        const text = wrapper.querySelector(".scroll-text");
        const h = heights[i];
        wrapper.style.width = "";
        text.style.whiteSpace = "";
        text.style.animation = "";
        text.classList.remove("scroll-animate");

        if (h <= minHeight) return;
        const width = wrapper.offsetWidth;
        wrapper.style.width = width + "px";
        text.classList.add("scroll-animate");

        const fullWidth = text.scrollWidth;
        const duration = Math.max(6, fullWidth / 50);
        text.style.animationDuration = duration + "s";
      });
    }
  }

  loadTracks(albumName) {
    const tracks = window.ASSETS.lazy[albumName.toLowerCase()];
    if (!tracks) {
      console.warn(`Aucun track trouvé pour l'album "${albumName}"`);
      return;
    }
    tracks.forEach(({ item_title, mp3_url }) => {
      const audio = new Audio(mp3_url);
      audio.crossOrigin = "anonymous";
      audio.preload = "auto";
      this.tracks.set(item_title, audio);
    });
  }

  async playTrack(btn) {
    const trackName = btn.parentElement
      .querySelector(".album__track__name")
      .getAttribute("data-track-name");

    const audio = this.tracks.get(trackName);

    if (!audio) {
      console.warn(`Track "${trackName}" non trouvé dans this.tracks`);
      return;
    }

    this.toggleAudio(audio, btn);
  }

  toggleAudio(audio, btn) {
    Array.from(this.elements.playBtn).forEach((otherBtn) => {
      if (otherBtn !== btn && otherBtn.dataset.text === "PAUSE") {
        this.animateBtnText(otherBtn, "PLAY");
      }
    });
    if (this.audio) {
      if (this.audio === audio) {
        if (!audio.paused) {
          audio.pause();
          this.animateBtnText(btn, "PLAY");
        } else {
          audio.play();
          this.animateBtnText(btn, "PAUSE");
        }
        return;
      }

      // Stop l'audio précédent
      this.audio.pause();
      this.audio.currentTime = 0;
      if (this.currentBtn) this.animateBtnText(btn, "PLAY");
    }

    // Play le nouvel audio
    this.audio = audio;
    this.currentBtn = btn;
    audio.play();
    this.animateBtnText(btn, "PAUSE");
  }

  animateBtnText(btn, newText) {
    btn.dataset.text = newText;
    const oldSplit = new SplitText(btn.querySelector("div"), {
      type: "chars",
      mask: "chars",
      smartWrap: true,
    });

    const wrapper = btn.querySelector(".album__track__btn");

    const temp = document.createElement("div");
    temp.textContent = newText;
    temp.style.visibility = "hidden";
    temp.style.position = "absolute";
    temp.style.top = "0";

    wrapper.appendChild(temp);

    const newSplit = new SplitText(temp, {
      type: "chars",
      smartWrap: true,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        oldSplit.chars?.forEach((c) => (c.style.visibility = "hidden"));
      },
    });

    tl.to(
      oldSplit.chars,
      {
        yPercent: 100,
        duration: 0.35,
        ease: "power2.in",
        stagger: 0.03,
      },
      0
    );

    tl.to(newSplit.chars, {
      visibility: "visible",
      yPercent: 100,
      duration: 0.35,
      ease: "power2.out",
      stagger: 0.03,
    });
  }

  addEventListeners() {
    super.addEventListeners();
    this.elements.backBtn.addEventListener(
      "click",
      (e) => {
        e.stopPropagation();
        this.canvasPage.onClickBack();
      },
      { once: true }
    );

    Array.from(this.elements.playBtn).forEach((btn) => {
      btn.addEventListener("click", () => {
        this.playTrack(btn);
      });
    });
  }

  show() {
    super.show();
  }

  hide() {
    super.hide();
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    //Fake background to avoid content flash when AJAX taking too long
    const bg = document.createElement("div");
    bg.className = "transition-bg";
    bg.style.position = "absolute";
    bg.style.inset = "0";
    bg.style.zIndex = "1";
    bg.style.backgroundColor = "#000000";
    bg.style.pointerEvents = "none";
    this.elements.wrapper.style.position = "relative";
    this.elements.wrapper.prepend(bg);
  }
}
