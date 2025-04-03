import Page from "../../classes/Page";
import { TextCursor } from "../../animations/TextCrusor";
import { Parallax } from "../../animations/Parallax";
import { HomeScene } from "../../three/scenes/HomeScene";
import { Detection } from "../../classes/Detection";
import { Navigation } from "../../components/Navigation";
export default class Home extends Page {
  constructor() {
    super({
      element: ".home",
      elements: {
        wrapper: ".home__wrapper",
        mainWrapper: ".home__main__wrapper",
        videoWrapper: ".home__video__wrapper",
      },
    });

    if (!Detection.isMobile) {
      new TextCursor(this.elements.videoWrapper, "scroll ⚈ scroll ⚈ ");
    }

    new Navigation(this.smoothScroll.lenis);
    new Parallax(this.elements.videoWrapper, this.smoothScroll.lenis);
    new HomeScene(this.smoothScroll.lenis);
  }
}
