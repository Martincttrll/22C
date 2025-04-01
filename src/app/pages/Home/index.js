import Page from "../../classes/Page";
import { BackgroundGradient } from "../../animations/BackgroundGradient";
import { TextCursor } from "../../animations/TextCrusor";
import { Parallax } from "../../animations/Parallax";
import { HomeScene } from "../../three/scenes/HomeScene";
import { Detection } from "../../classes/Detection";

export default class Home extends Page {
  constructor() {
    super({
      element: ".home",
      elements: {
        wrapper: ".home__wrapper",
        links: ".home__background__link",
        mainWrapper: ".home__main__wrapper",
        videoWrapper: ".home__video__wrapper",
      },
    });

    new BackgroundGradient(this.elements.mainWrapper);

    if (!Detection.isMobile) {
      new TextCursor(this.elements.videoWrapper, "scroll ⚈ scroll ⚈ ");
    }

    new Parallax(this.elements.videoWrapper, this.smoothScroll.lenis);
    new HomeScene(this.smoothScroll.lenis);
  }
}
