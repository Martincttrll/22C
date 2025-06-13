import { each } from "lodash";
import Media from "./Media.js";
import * as THREE from "three";
import gsap from "gsap";

export default class Discography {
  constructor({ scene, sizes, camera }) {
    this.scene = scene;
    this.camera = camera;
    this.sizes = sizes;
    this.group = new THREE.Group();
    this.createMedia();
    this.createGallery();
    this.createRaycaster();
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

  createRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(
        this.mediaInstances.map((media) => media.mesh)
      );
      if (intersects.length > 0) {
        document.body.style.cursor = "pointer";
      } else {
        document.body.style.cursor = "";
      }
    });
    window.addEventListener("click", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(
        this.mediaInstances.map((media) => media.mesh)
      );
      if (intersects.length > 0) {
        const mesh = intersects[0].object;
        const media = this.mediaInstances.find((m) => m.mesh === mesh);
        //Animate trasition to the album page
        this.onClick(mesh);
      }
    });
  }

  onScroll(next) {
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

  onClick(mesh) {
    let targetHeight, targetWidth;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      targetWidth = this.sizes.width * 0.8;
      targetHeight = targetWidth * (this.bounds.height / this.bounds.width);
    } else {
      targetHeight = this.sizes.height * 0.8;
      targetWidth = targetHeight * (this.bounds.width / this.bounds.height);
    }

    gsap.to(mesh.position, {
      y: 2,
      z: -2,
      duration: 0.7,
      ease: "power2.inOut",
    });
    gsap.to(mesh.rotation, {
      x: 0,
      duration: 0.4,
      ease: "power2.inOut",
    });
    gsap.to(mesh.scale, {
      x: targetWidth,
      y: targetHeight,
      duration: 0.7,
      ease: "power2.inOut",
    });

    this.mediaInstances.forEach((media) => {
      if (media.mesh !== mesh) {
        gsap.to(media.mesh.position, {
          y: media.mesh.position.y - 8,
          z: -0.2,
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
    });
    // window.app.onChange({ url: `/discography/${media.slug}/` });
  }

  onResize(sizes) {
    each(this.mediaInstances, (media) => {
      media.onResize(sizes);
    });
  }

  show() {
    this.scene.add(this.group);
    this.mediaInstances.forEach((media, i) => {
      media.mesh.position.set(0, 0, 0);
    });
  }

  hide() {
    this.scene.remove(this.group);
  }
}
