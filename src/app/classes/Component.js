import EventEmitter from "events";
import { each } from "lodash";

export default class Component extends EventEmitter {
  constructor({ element, elements }) {
    super();
    this.selectors = {
      element,
      ...elements,
    };
    this.create();

    this.addEventListeners();
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
  }

  addEventListeners() {}

  removeEventListeners() {}
}
