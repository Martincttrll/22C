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
    // this.fetchTracks();
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

  async playTrack(btn) {
    const trackName = btn.parentElement
      .querySelector(".album__track__name")
      .getAttribute("data-track-name");

    // Si l'audio est déjà chargé
    if (this.tracks.has(trackName)) {
      const audio = this.tracks.get(trackName);
      this.toggleAudio(audio, btn);
      return;
    }

    // Sinon, on affiche le loader
    this.showLoader(btn);

    const query = `22carbone+${trackName}`;
    const url = `https://api.deezer.com/search?q=${query}`;

    try {
      const res = await fetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
      );
      const data = await res.json();

      if (data?.data?.length > 0 && data.data[0].preview) {
        const audio = new Audio(data.data[0].preview);
        audio.crossOrigin = "anonymous";

        // On stocke l'audio pour ne pas le re-fetch
        this.tracks.set(trackName, audio);

        this.hideLoader(btn);
        this.toggleAudio(audio, btn);
      } else {
        this.hideLoader(btn);
        console.warn(`Aucun extrait trouvé pour "${trackName}"`);
      }
    } catch (err) {
      this.hideLoader(btn);
      console.error(`Erreur pour "${trackName}":`, err);
    }
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
