import Page from "../../classes/Page";
import { TextCursor } from "../../components/TextCrusor";
import { Parallax } from "../../animations/Parallax";
import { MembersScene } from "./MembersScene";

export default class Home extends Page {
  constructor() {
    super({
      element: ".home",
      elements: {
        wrapper: ".home__wrapper",
        mainWrapper: ".home__main__wrapper",
        videoWrapper: ".home__video__wrapper",
        h1: ".home__title",
        logoNav: document.querySelector(".nav__logo"),
        reelsWrapper: ".home__reels__wrapper",
      },
    });
  }

  createTextCursor() {
    const elementsConfig = [
      {
        element: this.elements.videoWrapper,
        text: "scroll ⚈ scroll ⚈ ",
        icon: null,
      },
      {
        element: this.elements.reelsWrapper,
        text: "click ⚈ click ⚈ ",
        icon: `<svg width="24px" height="24px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ffff"><path d="M1.5 5h2.79l3.86-3.83.85.35v13l-.85.33L4.29 11H1.5l-.5-.5v-5l.5-.5zm3.35 5.17L8 13.31V2.73L4.85 5.85 4.5 6H2v4h2.5l.35.17zm9.381-4.108l.707.707L13.207 8.5l1.731 1.732-.707.707L12.5 9.207l-1.732 1.732-.707-.707L11.793 8.5 10.06 6.77l.707-.707 1.733 1.73 1.731-1.731z"/></svg>`,
        animated: true,
        onClickIcon: () => {
          const soundBars = [];
          for (let i = 0; i < 3; i++) {
            const soundBar = document.createElement("div");
            soundBar.classList.add("sound__bar");
            soundBars.push(soundBar);
          }
          return soundBars;
        },
      },
    ];

    this.textCursor = new TextCursor({
      elementsConfig,
    });
  }

  create() {
    super.create();
    new Parallax(this.elements.videoWrapper, this.smoothScroll.lenis);
    new MembersScene(".home__three__wrapper");
  }
}
