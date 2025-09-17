import * as THREE from "three";
import vertexShader from "@shaders/reels-vertex.glsl";
import fragmentShader from "@shaders/reels-fragment.glsl";
import GUI from "lil-gui";

export default class Reels {
  constructor({ elements, group, sizes, camera }) {
    this.elements = elements;
    this.group = group;
    this.sizes = sizes;
    this.camera = camera;
    this.gui = new GUI();
    this.offset = 0;
    this.speed = 0.005;

    this.createCurve();
    this.createMeshes();
    this.createGUI();
    this.createBounds();
    this.updateScale();
    this.createRaycaster();
    this.addEventListeners();
  }

  createCurve() {
    this.curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(-5, 0, -5),
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(5, 0, -5)
    );
  }

  createMeshes() {
    this.planes = [];
    this.planesGroup = new THREE.Group();
    this.group.add(this.planesGroup);

    const videoEl = Array.from(this.elements);
    const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    this.radius = 3.7;

    for (let i = 0; i < videoEl.length * 2; i++) {
      const currentVideo = videoEl[i % videoEl.length];
      const texture = new THREE.VideoTexture(currentVideo);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: texture },
          uCount: { value: videoEl.length },
          uRadius: { value: this.radius },
          uAlpha: { value: 0.5 },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        side: THREE.DoubleSide,
      });

      const plane = new THREE.Mesh(geometry, material);
      this.planesGroup.add(plane);
      plane.userData.isHovered = false;
      this.planes.push(plane);
    }

    this.planesGroup.position.set(0, 0, 8.5);
    this.gui
      .add(this.planesGroup.position, "z", 0, 12, 0.001)
      .name("planesGroup.z");

    this.elements.forEach((element) => {
      element.style.visibility = "hidden";
    });
  }

  createGUI() {
    this.guiParams = {
      follow: true,
      y: this.planesGroup ? this.planesGroup.position.y : 0,
    };

    const folder = this.gui.addFolder("Reels position");
    folder.add(this.guiParams, "follow").name("Follow scroll");

    const range = Math.max(this.sizes.height, 1);
    this.yController = folder
      .add(this.guiParams, "y", -range, range, 0.01)
      .name("planesGroup.y")
      .onChange((v) => {
        this.planesGroup.position.y = v;
      });

    folder.open();
  }

  createRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  updateMeshesPosition(offset) {
    const count = this.planes.length;

    this.planes.forEach((plane, i) => {
      const t = ((i + offset) % count) / count;
      const pos = this.curve.getPointAt(t);

      plane.position.copy(pos);
    });
  }

  createBounds() {
    const { width, height, x, y } = this.elements[0].getBoundingClientRect();
    this.bounds = { width, height, x, y };
    this.updateY(); // met en place la position initiale
  }

  updateScale() {
    const meshHeight =
      this.sizes.height * (this.bounds.height / window.innerHeight) * 0.5;
    const meshWidth = meshHeight * (9 / 16); // ratio 9/16
    this.planes.forEach((plane) => {
      plane.scale.set(meshWidth, meshHeight, 1);
    });
  }

  updateY(y = 0) {
    if (!this.guiParams || !this.guiParams.follow) return;

    this.y = (this.bounds.y + 100 - y + 800 * 3) / window.innerHeight; //800 * 3 =  duration (px) of scroll animation component

    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    const distance = Math.abs(
      this.planesGroup.position.z - this.camera.position.z
    );
    const visibleHeight = 2 * Math.tan(fov / 2) * distance;

    this.planesGroup.position.y =
      visibleHeight / 2 - this.planes[0].scale.y / 2 - this.y * visibleHeight;

    if (this.yController) {
      this.yController.setValue(this.planesGroup.position.y);
      this.guiParams.y = this.planesGroup.position.y;
    }
  }

  onResize(sizes) {
    this.sizes = sizes;
    this.createBounds();
    this.updateScale();
    this.updateY();

    if (this.yController) {
      const range = Math.max(this.sizes.height, 1);
      const parent = this.yController.object;
      this.yController.remove();
      this.yController = this.gui.__folders["Reels position"]
        ? this.gui.__folders["Reels position"].controllers.find(
            (c) => c.property === "y"
          )
        : null;

      if (!this.yController) {
        const folder = this.gui.__folders
          ? this.gui.__folders["Reels position"]
          : null;
        if (folder) {
          this.yController = folder
            .add(this.guiParams, "y", -range, range, 0.01)
            .name("planesGroup.y")
            .onChange((v) => {
              this.planesGroup.position.y = v;
            });
        }
      }
    }
  }

  update(scroll) {
    this.planes.forEach((plane) => {
      plane.userData.isHovered = false;
    });

    this.offset = this.offset + (this.speed % 1);

    this.updateMeshesPosition(this.offset);

    this.updateY(scroll);

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.planes);
    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        intersects[i].object.userData.isHovered = true;
      }
    }

    this.planes.forEach((plane) => {
      const current = plane.material.uniforms.uAlpha.value;
      const target = plane.userData.isHovered ? 1 : 0.5;
      plane.material.uniforms.uAlpha.value = THREE.MathUtils.lerp(
        current,
        target,
        0.5
      );
    });
  }

  addEventListeners() {
    window.addEventListener("mousemove", (event) => {
      this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;
    });
    window.addEventListener("keydown", (event) => {
      if (event.key === "n") {
        // this.camera.lookAt(this.planesGroup.position);
      }
    });
  }
}
