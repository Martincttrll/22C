import EventEmitter from "events";
import { each } from "lodash";
import { SmoothScroll } from "../animations/SmoothScroll";
export default class Page extends EventEmitter {
  constructor({ element, elements, navigation, isScrollable = true }) {
    super();

    this.selectors = {
      element,
      ...elements,
    };

    this.isScrollable = isScrollable;
    this.smoothScroll = null;
    this.navigation = navigation;
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

  addEventListeners() {
    console.log(this.navigation);
    if (this.isScrollable && this.navigation) {
      this.navigation.on("menu:open", () => {
        console.log("menu:open");
        if (this.smoothScroll) {
          this.smoothScroll.smoother.paused(true);
        }
      });

      this.navigation.on("menu:close", () => {
        console.log("menu:close");
        if (this.smoothScroll) {
          this.smoothScroll.smoother.paused(false);
        }
      });
    }
  }
  removeEventListeners() {}
}
