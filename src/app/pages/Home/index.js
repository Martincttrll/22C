import Page from "../../classes/Page";
import { BackgroundGradient } from "../../animations/BackgroundGradient";
export default class Home extends Page {
  constructor() {
    super({
      element: ".home",
      elements: {
        wrapper: ".home__wrapper",
        links: ".home__background__link",
        mainWrapper: ".home__main__wrapper",
      },
    });
    const backgroundGradient = new BackgroundGradient(this.element);
  }
}
