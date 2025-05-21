import Page from "../../classes/Page";
import { each } from "lodash";
export class Discography extends Page {
  constructor() {
    super({
      element: ".discography",
      elements: {
        wrapper: ".discography__wrapper",
        cover: ".discography__album__cover",
        albums: ".discography__album",
      },
    });
  }

  create() {
    super.create();
    this.onLinkOver();

    this.addEventListeners();
  }

  onLinkOver() {
    each(this.elements.albums, (album) => {
      album.addEventListener("mouseover", () => {
        this.elements.cover.src = album.dataset.cover;
      });
    });
  }

  onLinkClick() {
    each(this.elements.albums, (album) => {
      album.addEventListener("click", () => {
        console.log("");
      });
    });
  }
}
