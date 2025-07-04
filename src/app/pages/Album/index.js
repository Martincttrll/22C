import Page from "@classes/Page";
import TextScramble from "./textScramble";
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
    this.audio = null;
  }

  create() {
    super.create();
    this.elements.tableRow.forEach((element) => {
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

  async fetchTrack(btn) {
    const trackName = btn.parentElement.querySelector(
      ".album__track__name"
    ).innerText;

    const query = `22carbone+${trackName}`;
    const url = `https://api.deezer.com/search?q=${query}`;

    try {
      const res = await fetch(`https://proxy.corsfix.com/?${url}`);
      const data = await res.json();

      if (data?.data?.length > 0 && data.data[0].preview) {
        this.audio = new Audio(data.data[0].preview);
        this.audio.crossOrigin = "anonymous";
      } else {
        console.warn("Aucun extrait trouvé");
      }
    } catch (err) {
      console.error("Erreur lors de la récupération de l'extrait :", err);
    }
  }

  async playTrack(btn) {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    await this.fetchTrack(btn);
    this.canvasPage.onAudioPlay(this.audio);
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
}
