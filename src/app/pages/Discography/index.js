import Page from "../../classes/Page";
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
    this.fetchDiscographyData();
  }

  async fetchDiscographyData() {
    const data = await fetch("albums.json");
    if (data.ok) {
      console.log(data);
      const response = data.response;
      this.albums = response.json();
      console.log(this.albums);
    } else {
      console.error("Error during albums fetching.");
    }
  }
}
