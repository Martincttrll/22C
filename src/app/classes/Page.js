import EventEmitter from "events";
import { each } from "lodash";
import { SmoothScroll } from "@animations/SmoothScroll";
import Separator from "@animations/Separator";
import Title from "@animations/Title";
import Image from "@animations/Image";
import Reels from "@animations/Reels";
import Paragraph from "@animations/Paragraph";

export default class Page extends EventEmitter {
  constructor({ element, elements }) {
    super();

    this.selectors = {
      element,
      ...elements,
      animationsSeparators: "[data-animation='separator']",
      animationsTitles: "[data-animation='title']",
      animationsImages: "[data-animation='image']",
      animationsParagraphs: "[data-animation='paragraph']",
      animationsReels: "[data-animation='reels']",
    };
  }

  create() {
    this.element = document.querySelector(this.selectors.element);
    this.elements = {};

    each(this.selectors, (selector, key) => {
      if (
        selector instanceof window.HTMLElement ||
        selector instanceof window.NodeList ||
        Array.isArray(selector)
      ) {
        this.elements[key] = selector;
      } else {
        this.elements[key] = this.element.querySelectorAll(selector);
        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(selector);
        }
      }
    });
    this.createSmoothScroll();
    this.createAnimations();
  }

  createAnimations() {
    const toArray = (elements) => {
      if (!elements) return [];
      return elements instanceof NodeList || Array.isArray(elements)
        ? Array.from(elements)
        : [elements];
    };

    this.animationsSeparators = toArray(this.elements.animationsSeparators).map(
      (element) => new Separator({ element })
    );

    this.animationsTitles = toArray(this.elements.animationsTitles).map(
      (element) => new Title({ element })
    );

    this.animationsImages = toArray(this.elements.animationsImages).map(
      (element) => new Image({ element })
    );
    this.animationsParagraphs = toArray(this.elements.animationsParagraphs).map(
      (element) => new Paragraph({ element })
    );

    this.animationsReels = toArray(this.elements.animationsReels).map(
      (element) =>
        new Reels({
          element,
          elements: { reels: "video" },
        })
    );
  }

  createSmoothScroll() {
    this.smoothScroll = new SmoothScroll(this.element, this.elements.wrapper);
  }

  setCanvasPage(canvasPage) {
    this.canvasPage = canvasPage;
  }

  show(_url) {
    this.isVisible = true;
    this.addEventListeners();

    return Promise.resolve();
  }

  hide(_url) {
    this.isVisible = false;
    this.removeEventListeners();
    return Promise.resolve();
  }

  addEventListeners() {}
  removeEventListeners() {}
}
