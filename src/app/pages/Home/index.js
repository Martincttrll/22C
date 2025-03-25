import Page from "../../classes/Page";
import { BackgroundGradient } from "../../animations/BackgroundGradient";
export default class Home extends Page {
  constructor() {
    super({
      element: ".home",
      elements: { wrapper: ".home__wrapper", links: ".home__background__link" },
    });
    const backgroundGradient = new BackgroundGradient(this.selectors.element);
  }
}
