import Page from "../../classes/Page";
export class Album extends Page {
  constructor() {
    super({
      element: ".album",
      elements: {
        wrapper: ".album__wrapper",
      },
    });
  }

  create() {
    super.create();
  }
}
