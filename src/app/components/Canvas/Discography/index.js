import { each, last } from "lodash";
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
      // media.mesh.material.opacity = 1 * (1 - i * 0.1);
    });
  }

  scrollToIndex(next) {
    const total = this.mediaInstances.length;
    if (total < 2) return;

    // Décale le tableau pour effet infini
    if (next) {
      const first = this.mediaInstances.shift();
      this.mediaInstances.push(first);
    } else {
      const last = this.mediaInstances.pop();
      this.mediaInstances.unshift(last);
    }

    // On stocke les positions cibles AVANT l'animation
    const targetPositions = this.mediaInstances.map((media) => ({
      x: media.mesh.position.x,
      y: media.mesh.position.y,
      z: media.mesh.position.z,
    }));

    // Anime chaque media vers la position du suivant/précédent
    this.mediaInstances.forEach((media, i) => {
      // Pour next: chaque media va à la position de celui qui le précède (i-1)
      // Pour prev: chaque media va à la position de celui qui le suit (i+1)
      let targetIndex = next ? (i - 1 + total) % total : (i + 1) % total;
      const target = targetPositions[targetIndex];

      gsap.to(media.mesh.position, {
        x: target.x,
        y: target.y,
        z: target.z,
        duration: 0.7,
        ease: "power2.inOut",
      });
    });

    // Pour l'effet de disparition/réapparition, on peut jouer sur l'opacité du media déplacé
    const edgeIndex = next ? 0 : this.mediaInstances.length - 1;
    const edgeMedia = this.mediaInstances[edgeIndex];

    gsap.fromTo(
      edgeMedia.mesh.material,
      { opacity: 0, y: 0 },
      {
        opacity: 1,
        y: edgeMedia.mesh.position.y,
        duration: 0.7,
        ease: "power2.inOut",
      }
    );
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
