import Page from "../../classes/Page";
import { BackgroundGradient } from "../../animations/BackgroundGradient";
import { TextCursor } from "../../animations/TextCrusor";
import { Parallax } from "../../animations/Parallax";
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
    const textCursor = new TextCursor(
      this.elements.videoWrapper,
      "scroll ⚈ scroll ⚈ "
    );
    new Parallax(this.elements.videoWrapper, this.smoothScroll.lenis);
  }
}
