import EventEmitter from "events";
export default class Page extends EventEmitter {
  constructor({ element, elements }) {
    super();

    this.selectors = {
      element,
      ...elements,
    };

    this.create();
  }

  create() {
    //Initialisaton des animations basées sur "elements" etc..
    console.log(this.selectors.element, "Page loaded");
  }
}
