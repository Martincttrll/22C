import Page from "../../classes/Page";
import { TextCursor } from "../../animations/TextCrusor";
import { Parallax } from "../../animations/Parallax";
import { HomeScene } from "../../three/scenes/HomeScene";
import { Detection } from "../../classes/Detection";
import { Navigation } from "../../components/Navigation";
import { HeadingShrink } from "./HeadingShrink";
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
      },
    });

    if (!Detection.isMobile) {
      new TextCursor(this.elements.videoWrapper, "scroll ⚈ scroll ⚈ ");
    }

    new Navigation(this.smoothScroll.lenis);
    new HeadingShrink(
      this.smoothScroll.lenis,
      this.elements.h1,
      this.elements.logoNav
    );
    new Parallax(this.elements.videoWrapper, this.smoothScroll.lenis);
    new HomeScene(this.smoothScroll.lenis);
  }
}
