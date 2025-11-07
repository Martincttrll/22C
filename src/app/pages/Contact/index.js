import Page from "@classes/Page";

export class Contact extends Page {
  constructor() {
    super({
      element: ".contact",
      elements: {
        wrapper: ".contact__wrapper",
      },
    });
  }

  create() {
    super.create();
  }

  addEventListeners() {}
  show() {}
  hide() {}
}
