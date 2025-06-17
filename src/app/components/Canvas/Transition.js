import gsap from "gsap";
import * as THREE from "three";
export default class Transition {
  constructor({ mesh, mediaInstaces, url, sizes }) {
    this.mediaInstances = mediaInstaces;
    this.sizes = sizes;
    this.mesh = mesh;
    this.url = url;
    this.createTimeline(mesh);
  }

  createTimeline(mesh) {
    let targetScale;
    mesh.material.side = THREE.DoubleSide;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      targetScale = this.sizes.width * 0.8;
    } else {
      targetScale = this.sizes.height * 0.8;
    }

    this.tl = gsap.timeline();

    this.tl
      .to(mesh.position, {
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
    // this.mediaInstances.forEach((media) => {
    //   if (media.mesh !== mesh) {
    //     this.tl.to(
    //       media.mesh.position,
    //       {
    //         y: media.mesh.position.y - 8,
    //         z: -0.2,
    //         duration: 0.5,
    //         ease: "power2.inOut",
    //       },
    //       "<"
    //     );
    //   }
    // });

    this.tl
      .to(mesh.scale, {
        x: 32,
        y: 32,
        delay: 0.4,
        duration: 0.6,
        ease: "power2.inOut",
      })
      .call(() => {
        window.app.onChange({ url: this.url });
      });
    this.tl.to(
      mesh.material,
      {
        opacity: 0,
        delay: 0.2,
        duration: 0.6,
        ease: "power2.inOut",
      },
      "<"
    );
  }

  playFromDiscography() {
    this.tl.play();
  }
  playFromAlbum() {
    this.tl.reverse();
  }
}
