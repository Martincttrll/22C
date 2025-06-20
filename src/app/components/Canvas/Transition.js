import gsap from "gsap";
import * as THREE from "three";
export default class Transition {
  constructor({ scene, sizes }) {
    // this.mediaInstances = mediaInstaces; /// Change to this.group.children ?
    this.scene = scene;
    this.sizes = sizes;
    this.meshCopy = null;
  }

  createTimeline() {
    let targetScale;
    this.meshCopy.material.side = THREE.DoubleSide;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      targetScale = this.sizes.width * 0.8;
    } else {
      targetScale = this.sizes.height * 0.8;
    }

    this.tl = gsap.timeline({
      onComplete: () => {
        window.app.onChange({
          url: "/discography/" + this.meshCopy.userData.url + "/",
        });
      },
      onReverseComplete: () => {
        window.app.onChange({
          url: "/discography/",
        });
      },
    });

    this.tl
      .to(this.meshCopy.position, {
        y: 2,
        z: -2,
        duration: 0.7,
        ease: "power2.inOut",
      })

      .to(
        this.meshCopy.scale,
        {
          x: targetScale,
          y: targetScale,
          duration: 0.7,
          ease: "power2.inOut",
        },
        "<"
      )
      .to(
        this.meshCopy.rotation,
        {
          y: Math.PI,
          duration: 0.8,
          ease: "power2.inOut",
        },
        "+=0.4"
      );

    this.tl.to(this.meshCopy.scale, {
      x: 32,
      y: 32,
      delay: 0.4,
      duration: 0.6,
      ease: "power2.inOut",
    });

    this.tl.to(
      this.meshCopy.material,
      {
        opacity: 0,
        delay: 0.2,
        duration: 0.6,
        ease: "power2.inOut",
      },
      "<"
    );
  }

  playFromDiscography(mesh) {
    this.meshCopy = mesh.clone();
    this.meshCopy.material = mesh.material.clone();
    this.meshCopy.material.map = null;
    this.meshCopy.material.color.set(0xff0000);
    this.meshCopy.material.needsUpdate = true;
    mesh.material.transparent = true;
    mesh.material.opacity = 0;
    //Cacher le mesh original dans discography
    this.scene.add(this.meshCopy);

    if (!this.tl) {
      this.createTimeline();
    }
    this.tl.play();
  }
  playFromAlbum() {
    if (!this.tl) {
      this.createTimeline();
      this.tl.progress(1);
    }
    this.tl.reverse();
  }
}

/////Supprimer les copy de mesh quand ???
