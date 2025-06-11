import { each } from "lodash";
import Media from "./Media.js";
import * as THREE from "three";
import gsap from "gsap";

export default class Discography {
  constructor({ scene, sizes }) {
    this.scene = scene;
    this.sizes = sizes;
    this.group = new THREE.Group();
  }

  createMedia() {
    const mediaElements = document.querySelectorAll(
      ".discography__album__cover"
    );
    this.mediaInstances = [];
    each(mediaElements, (element) => {
      const media = new Media({
        element,
        group: this.group,
        sizes: this.sizes,
      });
      this.mediaInstances.push(media);
    });
  }

  createGallery() {
    this.mediaInstances.forEach((media, i) => {
      media.mesh.position.z -= i * 0.5;
      media.mesh.position.y += i * 0.5;
      media.mesh.rotation.x = 0.1;
    });

    this.group.position.y -= 1;
  }

  scrollToIndex(next) {
    const tl = gsap.timeline();
    const total = this.mediaInstances.length;
    if (total < 2) return;

    if (next) {
      const first = this.mediaInstances.shift();
      this.mediaInstances.push(first);
    } else {
      const last = this.mediaInstances.pop();
      this.mediaInstances.unshift(last);
    }

    const targetPositions = this.mediaInstances.map((media) => ({
      x: media.mesh.position.x,
      y: media.mesh.position.y,
      z: media.mesh.position.z,
    }));

    const edgeMedia = next
      ? this.mediaInstances[total - 1]
      : this.mediaInstances[0];
    tl.to(
      edgeMedia.mesh.position,
      {
        y: edgeMedia.mesh.position.y - 8,
        duration: 0.4,
        ease: "power2.inOut",
      },
      "<"
    );
    tl.to(
      edgeMedia.mesh.material,
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      },
      "<"
    );
    tl.to(edgeMedia.mesh.material, {
      opacity: 1,
      duration: 0.3,
      ease: "power2.inOut",
    });
    this.mediaInstances.forEach((media, i) => {
      let targetIndex = next ? (i - 1 + total) % total : (i + 1) % total;
      const target = targetPositions[targetIndex];
      tl.to(
        media.mesh.position,
        {
          x: target.x,
          y: target.y,
          z: target.z,
          duration: 0.7,
          ease: "power2.inOut",
        },
        "<"
      );
    });
  }

  onResize(sizes) {
    each(this.mediaInstances, (media) => {
      media.onResize(sizes);
    });
  }

  show() {
    this.createMedia();
    this.createGallery();
    this.scene.add(this.group);
  }

  hide() {
    this.scene.remove(this.group);
  }
}
