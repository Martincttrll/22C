import Page from "@classes/Page";
import TextScramble from "./TextScramble";
import { Detection } from "@classes/Detection";
import { each } from "lodash";

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
    if (this.audio) {
      if (this.audio === audio) {
        if (!audio.paused) {
          audio.pause();
          btn.textContent = "▶";
        } else {
          audio.play();
          btn.textContent = "⏸";
        }
        return;
      }

      // Stop l'audio précédent
      this.audio.pause();
      this.audio.currentTime = 0;
      if (this.currentBtn) this.currentBtn.textContent = "▶";
    }

    // Play le nouvel audio
    this.audio = audio;
    this.currentBtn = btn;
    audio.play();
    btn.textContent = "⏸";
  }

  showLoader(btn) {
    // Si tu veux un simple loader CSS :
    btn.dataset.originalText = btn.textContent;
    btn.textContent = "…"; // ou mettre un SVG inline
    btn.disabled = true;
  }

  hideLoader(btn) {
    btn.textContent = btn.dataset.originalText || "▶";
    btn.disabled = false;
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
