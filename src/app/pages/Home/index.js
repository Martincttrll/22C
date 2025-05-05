import Page from "../../classes/Page";
import { TextCursor } from "../../animations/TextCrusor";
import { Parallax } from "../../animations/Parallax";
import { MembersScene } from "./MembersScene";
import { Detection } from "../../classes/Detection";

export default class Home extends Page {
  constructor({ navigation }) {
    super({
      element: ".home",
      elements: {
        wrapper: ".home__wrapper",
        mainWrapper: ".home__main__wrapper",
        videoWrapper: ".home__video__wrapper",
        h1: ".home__title",
        logoNav: document.querySelector(".nav__logo"),
      },
      navigation,
    });
  }
  create() {
    super.create();
    if (!Detection.isMobile) {
      new TextCursor(this.elements.videoWrapper, "scroll ⚈ scroll ⚈ ");
    }

    // new HeadingShrink(
    //   this.smoothScroll.smoother,
    //   this.elements.h1,
    //   this.elements.logoNav
    // );
    // new Parallax(this.elements.videoWrapper, this.smoothScroll.smoother);
    new MembersScene(".home__three__wrapper");
    this.show();
  }
  show() {
    super.show();
  }
}
