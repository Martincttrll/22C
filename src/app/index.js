import "../styles/style.scss";
import Home from "./pages/Home";

class App {
  constructor() {
    console.log("©2025 - 22Carbone by MartinCtrl");
    this.createPages();
  }

  createPages() {
    this.home = new Home();
  }
}

new App();
