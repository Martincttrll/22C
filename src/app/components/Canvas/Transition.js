import gsap from "gsap";
import * as THREE from "three";
export default class Transition {
  constructor({ scene, sizes, camera }) {
    this.scene = scene;
    this.sizes = sizes;
    this.camera = camera;
    this.meshCopy = null;
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
        if (this.tl.reversed() && this.shouldCallCallbacks) {
          window.app.onChange({ url: "/discography/" });
        } else if (this.shouldCallCallbacks) {
          window.app.onChange({
            url: "/discography/" + this.meshCopy.userData.url + "/",
          });
        }
      })
      .to(
        //////FIX OPACITY ON MATERIAL (CUZ BOX GEOMETRY)
        this.meshCopy.material,
        {
          opacity: 0,
          delay: 0.2,
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: function () {
            this.targets().forEach((mat) => {
              mat.depthWrite = false;
              mat.needsUpdate = true;
            });
          },
        },
        "<"
      );
  }

  animateFallbackMesh(mesh) {
    const tl = gsap.timeline({
      onComplete: () => {
        this.scene.remove(mesh);
        tl.kill();
      },
    });

    tl.to(
      mesh.material.map((mat) => mat),
      {
        opacity: 1,
        delay: 0.2,
        duration: 0.6,
        ease: "power2.inOut",
      }
    )
      .call(() => {
        window.app.onChange({ url: "/discography/" });
      })
      .to(mesh.position, {
        y: 0,
        z: -3,
        delay: 0.2,
        duration: 0.6,
        ease: "power2.inOut",
      })
      .to(
        mesh.rotation,
        {
          y: 0,
          duration: 0.8,
          ease: "power2.inOut",
        },
        "+=0.2"
      )
      .to(mesh.position, {
        y: -5,
        duration: 0.7,
        ease: "power2.inOut",
      })
      .to(
        mesh.material.map((mat) => mat),
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "<"
      );

    tl.play();
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
    this.meshCopy = mesh.clone();

    this.meshCopy.position.y = mesh.parent.position.y + mesh.position.y; //Apply group y displacement too
    this.meshCopy.rotation.z = 0;
    this.meshCopy.material = mesh.material.map((mat) => {
      const cloned = mat.clone();
      cloned.side = THREE.DoubleSide;
      cloned.transparent = true;
      return cloned;
    });
    mesh.material.forEach((mat) => {
      mat.transparent = true;
      mat.depthWrite = false;
      mat.opacity = 0;
    });
  }

  destroyCopyMesh() {
    if (this.meshCopy) {
      this.scene.remove(this.meshCopy);
      this.meshCopy.geometry.dispose();

      this.meshCopy.material.forEach((mat) => mat.dispose());

      this.meshCopy = null;
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
      album.material.forEach((material) => {
        material.depthWrite = false;
        gsap.to(material, {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        });
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
      this.createTimeline();
    }
    this.shouldCallCallbacks = false;
    this.tl.progress(1);
    this.shouldCallCallbacks = true;
    this.tl.reverse();
  }
}
