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
    this.speed = 0.05;

    this.createMeshes();
    this.createBounds();
    this.updateScale();
    this.createRaycaster();
    this.addEventListeners();
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
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.material.side = THREE.DoubleSide;

      this.planesGroup.add(plane);
      plane.userData.isHovered = false;
      this.planes.push(plane);
    }

    this.elements.forEach((element) => {
      // element.style.visibility = "hidden";
    });
  }

  createRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  updateMeshesPosition(offset) {
    const meshWidth = this.planes[0].scale.x;
    if (!this.guiFolder) {
      this.guiFolder = this.gui.addFolder("Carousel");
      this.guiFolder
        .add(this, "radius", 0, 5)
        .step(0.001)
        .name("Radius")
        .onChange(() => this.updateMeshesPosition(offset));
      this.guiFolder.add(this.planesGroup.position, "z", 0, 5, 0.0001).name;
    }
    const meshAngle = meshWidth / this.radius;
    const arcAngle = meshAngle * this.planes.length - 1;
    const startAngle = -arcAngle / 2; //centre

    this.planes.forEach((plane, i) => {
      const angle = startAngle + (i + offset) * meshAngle;
      plane.material.uniforms.uRadius.value = this.radius;
      plane.userData.angle = angle;

      plane.position.x = Math.sin(angle) * this.radius;
      plane.position.z = -Math.cos(angle) * this.radius;

      const tangentX = Math.cos(angle);
      const tangentZ = Math.sin(angle);

      const target = new THREE.Vector3(
        plane.position.x,
        plane.position.y,
        plane.position.z + tangentZ
      );

      plane.lookAt(target);
    });

    this.planesGroup.position.set(0, 0, 3.7);
  }

  createBounds() {
    const { width, height, x, y } = this.elements[0].getBoundingClientRect();
    this.bounds = { width, height, x, y };
    this.updateY();
  }

  updateScale() {
    const meshHeight =
      this.sizes.height * (this.bounds.height / window.innerHeight) * 0.5;
    const meshWidth = meshHeight * (9 / 16); // ratio 9/16
    this.planes.forEach((plane) => {
      plane.scale.set(meshWidth, meshHeight, 1);
    });
  }

  updateY() {
    //A faire
  }

  onResize(sizes) {
    this.sizes = sizes;
    this.createBounds();
    this.updateScale();
  }

  update(scroll) {
    this.planes.forEach((plane) => {
      plane.userData.isHovered = false;
    });

    this.offset = this.offset + (this.speed % 1);

    this.updateMeshesPosition(this.offset);

    this.updateY();

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
        this.planes.forEach((plane) => {
          console.log(plane);
          plane.position.y = -2;
        });
        this.camera.lookAt(this.planes[0].position);
      }
    });
  }
}
