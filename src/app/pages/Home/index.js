import Page from "../../classes/Page";
import { TextCursor } from "../../components/TextCrusor";
import { Parallax } from "../../animations/Parallax";
import { MembersScene } from "./MembersScene";
import { Reels } from "./Reels";

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
        reelsWrapper: ".home__reels__video__wrapper",
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
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24px" height="24px">
          <path d="M12 3v18c-4.97 0-9-4.03-9-9s4.03-9 9-9zm0-2c-6.08 0-11 4.92-11 11s4.92 11 11 11 11-4.92 11-11-4.92-11-11-11zm-1 14h2v-2h-2v2zm0-4h2v-6h-2v6z"/>
        </svg>`,
        animated: true,
        onClickIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="24px" height="24px">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v-2h-2v2zm0-4h2V7h-2v5z"/>
    </svg>`,
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
    // new Reels(this.elements.reelsWrapper);
  }
}
