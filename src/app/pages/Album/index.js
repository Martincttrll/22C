import Page from "@classes/Page";
import TextScramble from "./TextScramble";
import { Detection } from "@classes/Detection";
import { each } from "lodash";

export class Album extends Page {
  constructor() {
    super({
      element: ".album",
      elements: {
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
    this.elements.tableRow.forEach((element) => {
      new TextScramble(element);
    });
    this.createBackground();
    this.formatForMobile();

    this.tracks = new Map();
    this.fetchTracks();
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

  async fetchTracks() {
    const trackNames = Array.from(this.elements.tableRow).map(
      (tr) => tr.querySelector(".album__track__name").innerText
    );

    for (const name of trackNames) {
      const query = `22carbone+${name}`;
      const url = `https://api.deezer.com/search?q=${query}`;

      try {
        const res = await fetch(`https://proxy.corsfix.com/?${url}`);
        const data = await res.json();

        if (data?.data?.length > 0 && data.data[0].preview) {
          const audio = new Audio(data.data[0].preview);
          audio.crossOrigin = "anonymous";
          this.tracks.set(name, audio);
        } else {
          console.warn(`Aucun extrait trouvé pour "${name}"`);
        }
      } catch (err) {
        console.error(`Erreur pour "${name}":`, err);
      }
    }

    console.log("all tracks loaded");
  }

  async playTrack(btn) {
    const trackName = btn.parentElement
      .querySelector(".album__track__name")
      .getAttribute("data-track-name");

    const audio = this.tracks.get(trackName);

    if (!audio) {
      console.warn(`Aucun audio préchargé pour "${trackName}"`);
      return;
    }

    if (this.audio === audio) {
      if (!audio.paused) {
        audio.pause();
      } else {
        audio.play();
      }
      return;
    }

    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }

    this.audio = audio;
    console.log(this.audio);
    // this.canvasPage.onAudioPlay(this.audio);
    this.audio.play();
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

    this.elements.playBtn.forEach((btn) => {
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
  }
}
