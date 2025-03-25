import Home from "./pages/Home";

class App {
  constructor() {
    console.log("App running");

    this.createPages();
  }

  createPages() {
    this.home = new Home();
  }
}

new App();
