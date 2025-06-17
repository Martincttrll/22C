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

    this.group.position.y = -1;
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
        const mesh = intersects[0].object;
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
        const url = `/discography/${media.slug}/`;
        //Animate trasition to the album page
        this.onClick(mesh, url);
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

  onClick(mesh, url) {
    let targetScale;
    mesh.material.side = THREE.DoubleSide;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      targetScale = this.sizes.width * 0.8;
    } else {
      targetScale = this.sizes.height * 0.8;
    }

    const tl = gsap.timeline();

    tl.to(mesh.position, {
      y: 2,
      z: -2,
      duration: 0.7,
      ease: "power2.inOut",
    })

      .to(
        mesh.scale,
        {
          x: targetScale,
          y: targetScale,
          duration: 0.7,
          ease: "power2.inOut",
        },
        "<"
      )
      .to(
        mesh.rotation,
        {
          y: Math.PI,
          duration: 0.8,
          ease: "power2.inOut",
        },
        "+=0.4"
      );
    this.mediaInstances.forEach((media) => {
      if (media.mesh !== mesh) {
        tl.to(
          media.mesh.position,
          {
            y: media.mesh.position.y - 8,
            z: -0.2,
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<"
        );
      }
    });

    tl.to(mesh.scale, {
      x: 32,
      y: 32,
      delay: 0.4,
      duration: 0.6,
      ease: "power2.inOut",
    }).call(() => {
      window.app.onChange({ url });
    });
    tl.to(
      mesh.material,
      {
        opacity: 0,
        delay: 0.2,
        duration: 0.6,
        ease: "power2.inOut",
      },
      "<"
    );

    //FLIP, tracklist (tableau de la page album), ZOOM-IN, FADE-OUT, il reste que le tableau des tracks !!!!!!
  }

  onResize(sizes) {
    each(this.mediaInstances, (media) => {
      media.onResize(sizes);
    });
  }

  show(isPreloaded) {
    this.createMedia();
    this.createGallery();
    this.createRaycaster();
    this.scene.add(this.group);
    if (this.mediaInstances) {
      const delay = isPreloaded ? 2 : 0;

      this.mediaInstances.forEach((media, i) => media.show(delay + i * 0.2));
    }
  }

  hide() {
    this.group.clear();
    this.scene.remove(this.group);
    if (this.mediaInstances) {
      this.mediaInstances.forEach((media) => media.hide());
    }
  }
}
