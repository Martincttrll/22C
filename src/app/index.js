import "@styles/style.scss";
import Home from "@pages/Home";
import { Discography } from "@pages/Discography";
import { Album } from "@pages/Album";
import { Navigation } from "@components/Navigation";
import { each } from "lodash";
import { Preloader } from "@components/Preloader";
import Canvas from "@components/Canvas";
class App {
  constructor() {
    console.log("©2025 - 22Carbone by MartinCtrl");
    this.createContent();
    this.createPreloader();
    this.createNavigation();
    this.createPages();
    this.createCanvas();
    this.addEventListeners();
    this.addLinkListeners();
    this.onResize();
  }

  createContent() {
    this.content = document.querySelector(".content");
    this.template = this.content.getAttribute("data-template");
  }

  createNavigation() {
    this.navigation = new Navigation(this.template);
  }

  createPreloader() {
    this.preloader = new Preloader();

    this.preloader.once("completed", this.onPreloaded.bind(this));
  }

  createPages() {
    this.pages = {
      home: new Home(),
      discography: new Discography(),
      album: new Album(),
    };

    this.page = this.pages[this.template];
    this.page.create();
  }

  createCanvas() {
    this.canvas = new Canvas({ template: this.template });
  }

  /*
   * Events
   */

  onPreloaded() {
    this.onResize();

    this.canvas.onPreloaded();

    this.page.show();

    this.page.setCanvasPage(this.canvas.canvasPage);
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }
    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize();
    }
  }

  onPopState = () => {
    this.onChange({
      url: window.location.pathname,
      push: true,
    });
  };

  async onChange({ url, push = true }) {
    if (this.isFetching || this.url === url) return;

    this.isFetching = true;
    this.page.hide();

    const request = await window.fetch(url);
    if (request.status === 200) {
      const html = await request.text();
      const tempDom = document.createElement("div");
      tempDom.innerHTML = html;
      const newContent = tempDom.querySelector(".content");
      const newTemplate = newContent.getAttribute("data-template");
      const newTitle = tempDom.querySelector("title").innerText;

      if (!newContent || !this.pages[newTemplate]) {
        throw new Error("New page content or template not found");
      }

      this.content.replaceWith(newContent);
      this.content = newContent;
      this.template = newTemplate;
      document.title = newTitle;

      this.navigation.onChange(this.template);
      this.canvas.onChange(this.template);

      if (push) {
        window.history.pushState({}, "", url);
      }

      this.page = this.pages[this.template];
      this.page.create();

      this.page.setCanvasPage(this.canvas.canvasPage);

      this.onResize();
      this.page.show();
      this.isFetching = false;
      this.addLinkListeners();
    } else {
      console.log("Error fetching page");
    }
  }

  onContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
  addLinkListeners() {
    const links = document.querySelectorAll("a");

    each(links, (link) => {
      link.addEventListener("click", (e) => {
        if (!link.href.startsWith(window.location.origin)) return;
        e.preventDefault();
        const { href } = link;
        this.onChange({ url: href });
      });
    });
  }

  addEventListeners() {
    window.addEventListener("popstate", this.onPopState, { passive: true });
    window.addEventListener("resize", this.onResize.bind(this));
    // window.oncontextmenu = this.onContextMenu; Disable right click
  }
}

window.app = new App();
