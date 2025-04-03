import { each } from "lodash";
export class Navigation {
  constructor(displayed = true) {
    this.navigation = document.querySelector(".nav__wrapper");
    this.menuBtn = document.querySelector(".nav__menu__btn");
    this.menuWrapper = document.querySelector(".nav__menu__wrapper");
    this.links = document.querySelectorAll(".nav__menu__link");
    this.isNavigationDisplayed = displayed;
    this.isMenuOpen = false;

    if (this.isNavigationDisplayed) {
      this.display();
    }

    this.addEventListeners();
  }

  display() {
    this.navigation.classList.add("active");
  }

  remove() {
    this.navigation.classList.remove("active");
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      this.menuWrapper.style.height = "100%";
      each(this.links, (link) => {
        link.style.opacity = "1";
        link.style.pointerEvents = "all";
      });
    } else {
      this.menuWrapper.style.height = "0";
      each(this.links, (link) => {
        link.style.opacity = "0";
        link.style.pointerEvents = "none";
      });
    }
  }

  addEventListeners() {
    this.menuBtn.addEventListener("click", this.toggleMenu.bind(this));
  }
}
