import gsap from "gsap";
import * as THREE from "three";
export default class Transition {
  constructor({ scene, sizes, camera }) {
    this.scene = scene;
    this.sizes = sizes;
    this.camera = camera;
    this.meshCopy = null;
    this.mesh = null;
    this.shouldCallCallbacks = true;
  }

  createTimeline() {
    this.tl = gsap.timeline({
      onReverseComplete: () => {
        this.destroyCopyMesh();
        this.tl.kill();
        this.tl = null;
      },
    });
    this.tl
      .call(() => {
        if (!this.tl.reversed()) {
          this.hideAlbums();
        }
      })
      .to(this.meshCopy.rotation, {
        x: 0,
        duration: 0.4,
        ease: "power2.inOut",
      })
      .to(
        this.meshCopy.position,
        {
          y: 0,
          z: -2,
          duration: 0.7,
          ease: "power2.inOut",
        },
        "<"
      )
      .call(() => {
        if (this.tl.reversed()) {
          this.showAlbums();
        }
      })

      .to(
        this.meshCopy.rotation,
        {
          y: Math.PI,
          duration: 0.8,
          ease: "power2.inOut",
        },
        "+=0.2"
      )
      .to(this.meshCopy.scale, {
        x: () => this.getTargetScale(),
        y: () => this.getTargetScale(),
        delay: 0.2,
        duration: 0.6,
        ease: "power2.inOut",
      })
      .call(() => {
        console.log("Transition complete is reversed: ", this.tl.reversed());
        if (this.tl.reversed() && this.shouldCallCallbacks) {
          window.app.onChange({ url: "/discography/" });
        } else if (this.shouldCallCallbacks) {
          window.app.onChange({
            url: "/discography/" + this.meshCopy.userData.url + "/",
          });
        }
      })
      .to(
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

  getTargetScale() {
    const cameraZ = this.camera.position.z;
    const meshZ = this.meshCopy.position.z;
    const distance = Math.abs(cameraZ - meshZ);

    const fov = this.camera.fov * (Math.PI / 180);
    const heightAtDistance = 2 * Math.tan(fov / 2) * distance;
    const widthAtDistance = heightAtDistance * this.camera.aspect;

    return Math.max(widthAtDistance, heightAtDistance);
  }

  createMeshCopy(mesh) {
    this.mesh = mesh;
    this.meshCopy = mesh.clone();
    this.meshCopy.material = mesh.material.clone();
    this.meshCopy.material.side = THREE.DoubleSide;
    mesh.material.transparent = true;
    mesh.material.opacity = 0;
  }

  destroyCopyMesh() {
    if (this.meshCopy) {
      this.scene.remove(this.meshCopy);
      this.meshCopy.geometry.dispose();
      this.meshCopy.material.dispose();
      this.meshCopy = null;
    }
    if (this.mesh) {
      this.mesh.material.transparent = false;
      this.mesh.material.opacity = 1;
      this.mesh = null;
    }
  }

  hideAlbums() {
    this.scene.traverse((album) => {
      if (!album.isMesh || album === this.meshCopy) return;
      gsap.to(album.position, {
        y: album.position.y - this.sizes.height * 0.5,
        duration: 1,
        ease: "power2.inOut",
      });
    });
  }

  showAlbums() {
    this.scene.traverse((album) => {
      if (!album.isMesh || album === this.meshCopy) return;
      gsap.to(album.position, {
        y: album.position.y + this.sizes.height * 0.5,
        duration: 1,
        ease: "power2.inOut",
      });
    });
  }

  playFromDiscography(mesh) {
    this.createMeshCopy(mesh);
    this.scene.add(this.meshCopy);

    if (!this.tl) {
      this.createTimeline();
    }
    this.tl.play();
  }

  playFromAlbum() {
    if (!this.tl) {
      console.log("1");
      this.createTimeline();
    }
    console.log("2");
    this.shouldCallCallbacks = false;
    this.tl.progress(1);
    this.shouldCallCallbacks = true;
    console.log("3");
    this.tl.reverse();
    console.log("Playing from album (transition.js)");
  }
}
