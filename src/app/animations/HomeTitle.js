import gsap from "gsap";
import SplitText from "gsap/SplitText";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";
import Animation from "@classes/Animation.js";

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

export default class HomeTitle extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
  }

  animateIn() {}

  animateOut() {}
}
