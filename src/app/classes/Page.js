import EventEmitter from "events";
import { each } from "lodash";
import { SmoothScroll } from "../animations/SmoothScroll";
import Separator from "../animations/Separator";
import Title from "../animations/Title";
import Image from "../animations/Image";
import Reels from "../animations/Reels";
export default class Page extends EventEmitter {
  constructor({ element, elements, isScrollable = true }) {
    super();

    this.selectors = {
      element,
      ...elements,
      animationsSeparators: "[data-animation='separator']",
      animationsTitles: "[data-animation='title']",
      animationsImages: "[data-animation='image']",
      animationsReels: "[data-animation='reels']",
    };

    this.isScrollable = isScrollable;
    this.smoothScroll = null;
  }

  create() {
    this.element = document.querySelector(this.selectors.element);
    this.elements = {};

    each(this.selectors, (selector, key) => {
      if (
        selector instanceof window.HTMLElement ||
        selector instanceof window.NodeList
      ) {
        this.elements[key] = selector;
      } else if (Array.isArray(selector)) {
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

    if (this.isScrollable) {
      this.smoothScroll = new SmoothScroll(this.element, this.elements.wrapper);
    }

    this.createAnimations();
  }

  createAnimations() {
    this.animationsSeparators = each(
      this.elements.animationsSeparators,
      (element) => {
        return new Separator({
          element,
        });
      }
    );
    this.animationsTitles = each(this.elements.animationsTitles, (element) => {
      return new Title({
        element,
      });
    });
    this.animationsImages = each(this.elements.animationsImages, (element) => {
      return new Image({
        element,
      });
    });
    this.animationsReels = each(this.elements.animationsReels, (element) => {
      return new Reels({
        element,
      });
    });
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
