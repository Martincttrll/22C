import Page from "../../classes/Page";
import { DiscographyScene } from "../../components/Canvas/Discography";
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
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  create() {
    super.create();
    this.onLinkOver();
    this.discographyScene = new DiscographyScene({
      container: this.elements.wrapper,
      sizes: this.sizes,
    });
    this.addEventListeners();
  }

  onLinkOver() {
    each(this.elements.albums, (album) => {
      album.addEventListener("mouseover", () => {
        this.elements.cover.src = album.dataset.cover;
      });
    });
  }

  onResize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    this.discographyScene.onResize();
  }

  onLinkClick() {
    each(this.elements.albums, (album) => {
      album.addEventListener("click", () => {
        console.log("");
      });
    });
  }

  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
  }
}
