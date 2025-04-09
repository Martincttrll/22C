import Page from "../../classes/Page";
import { Navigation } from "../../components/Navigation";

export class Discography extends Page {
  constructor() {
    super({
      element: ".discography",
      elements: {
        wrapper: ".discography__wrapper",
        h1: ".discography__title",
      },
    });
  }

  create() {
    super.create();
  }
}
