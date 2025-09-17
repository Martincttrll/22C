import { each } from "lodash";
import Media from "./Media.js";
import * as THREE from "three";
import gsap from "gsap";
export default class Discography {
  constructor({ scene, sizes, camera, transition }) {
    this.scene = scene;
    this.camera = camera;
    this.sizes = sizes;
    this.transition = transition;
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
    // console.log(this.sizes);
    const spacing = this.mediaInstances[0].mesh.scale.y * (1 / 18);
    this.mediaInstances.forEach((media, i) => {
      media.mesh.position.z = -i * 0.5;
      media.mesh.position.y = i * spacing;
      media.mesh.rotation.x = 0.1;
    });
    const groupHeight =
      this.mediaInstances.length -
      1 * spacing +
      this.mediaInstances[0].mesh.scale.y;
    this.group.position.y = -groupHeight / 2;
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
        this.onMouseOver(intersects[0].object);
      } else {
        document.body.style.cursor = "";
        this.onMouseOut();
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
        this.onClick(intersects[0].object);
      }
    });
  }

  update() {}

  onScroll(next) {
    if (window.location.pathname !== "/discography/") return;
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
      edgeMedia.material,
      {
        opacity: 0,
        duration: 0.4,
        ease: "power2.inOut",
      },
      "<"
    );
    tl.to(edgeMedia.material, {
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
    this.transition.playFromDiscography(mesh);
  }

  onMouseOver(mesh) {
    this.mediaInstances.forEach((media) => {
      if (media != mesh) {
        gsap.to(media.mesh.rotation, {
          z: 0,
          duration: 0.3,
          ease: "power4.inOut",
        });
      }
    });

    gsap.to(mesh.rotation, {
      z: 0.03,
      duration: 0.3,
      ease: "power2.inOut",
    });
  }

  onMouseOut() {
    this.mediaInstances.forEach((media) => {
      gsap.to(media.mesh.rotation, {
        z: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    });
  }

  onResize(sizes) {
    this.sizes = sizes;
    if (!this.mediaInstances) return;
    this.mediaInstances.forEach((media, i) => {
      media.onResize(this.sizes);
    });
    this.createGallery();
  }

  show(isPreloaded, isAlbumToDiscography) {
    if (!this.mediaInstances) {
      this.createMedia();
      this.createGallery();
      this.createRaycaster();
      this.scene.add(this.group);
    }
    if (this.mediaInstances) {
      let delay = 0;
      if (isPreloaded) {
        delay = 2.5;
      } else if (isAlbumToDiscography) {
        delay = 1.4;
      }
      this.mediaInstances.forEach((media, i) => media.show(delay + i * 0.05));
    }
  }

  hide() {
    this.group.clear();
    this.scene.remove(this.group);
    if (this.mediaInstances) {
      this.mediaInstances.forEach((media) => media.hide());
    }
  }

  //debug
  addDebug() {
    window.addEventListener("keydown", (event) => {
      if (event.key === "d") {
        console.log(this.scene);
        if (!this.mediaInstances) return;
        this.mediaInstances.forEach((media) => {
          media.mesh.material.wireframe = !media.mesh.material.wireframe;
          console.log(media.mesh.position);
        });
      }
    });
  }
}
