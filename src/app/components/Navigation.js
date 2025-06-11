import { each } from "lodash";
import gsap from "gsap";
export class Navigation {
  constructor(template, displayed = true) {
    this.navigation = document.querySelector(".nav__wrapper");
    this.menuBtn = document.querySelector(".nav__menu__btn");
    this.menuWrapper = document.querySelector(".nav__menu__wrapper");
    this.links = document.querySelectorAll(".nav__menu__link");
    this.isMenuOpen = false;

    this.menuTimeline = gsap.timeline({ paused: true, reversed: true });
    this.menuTimeline
      .add(() => {
        this.menuWrapper.style.display = "flex";
      })
      .to(this.menuWrapper, {
        duration: 0.5,
        autoAlpha: 1,
        y: 0,
        ease: "power2.out",
      })
      .fromTo(
        this.links,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
          pointerEvents: "all",
        },
        "-=0.4"
      );

    this.menuTimeline.eventCallback("onReverseComplete", () => {
      this.menuWrapper.style.display = "none";
    });

    if (displayed) {
      this.display();
    }
    this.onChange(template);
    this.addEventListeners();
  }

  display() {
    this.navigation.classList.add("active");
  }

  remove() {
    this.navigation.classList.remove("active");
  }

  onChange(template) {
    each(this.links, (link) => {
      const href = link.getAttribute("href");
      const isActive =
        href.includes(template) || (template === "home" && href === "/");

      link.classList.toggle("current", isActive);
    });
  }

  toggleMenu = () => {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuTimeline.reversed()
      ? this.menuTimeline.play()
      : this.menuTimeline.reverse();
  };
  addEventListeners() {
    this.menuBtn.addEventListener("click", this.toggleMenu);
    each(this.links, (link) => {
      link.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    });
    this.menuWrapper.addEventListener("click", this.toggleMenu);
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.toggleMenu();
      }
    });
  }
}
