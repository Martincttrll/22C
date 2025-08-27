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
    const PlaneGeometry = new THREE.PlaneGeometry(1, 1, 32, 32);
    this.radius =
      (PlaneGeometry.parameters.width * videoEl.length * 2) / (Math.PI * 2);
    for (let i = 0; i < videoEl.length * 2; i++) {
      const currentVideo = videoEl[i % videoEl.length];
      const texture = new THREE.VideoTexture(currentVideo);

      const plane = new THREE.Mesh(
        PlaneGeometry,
        new THREE.ShaderMaterial({
          uniforms: {
            uTexture: { value: texture },
            uCount: { value: videoEl.length },
            uRadius: { value: this.radius },
            uAlpha: { value: 0.5 },
          },
          vertexShader,
          fragmentShader,
        })
      );
      this.planesGroup.add(plane);
      plane.userData.isHovered = false;
      this.planes.push(plane);
    }

    this.elements.forEach((element) => {
      element.style.visibility = "hidden";
    });
  }

  createRaycaster() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  updateMeshesPosition() {
    const meshWidth = this.planes[0].scale.x;
    this.radius = (meshWidth * this.planes.length) / (Math.PI * 2);
    this.gui
      .add({ angle: this.radius }, "angle", 0, Math.PI * 2)
      .step(0.01)
      .onChange((value) => {
        this.planes.forEach((plane, i) => {
          plane.material.uniforms.uRadius.value = value;
        });
      });
    this.planes.forEach((plane, i) => {
      plane.material.side = THREE.DoubleSide;
      const angle = i * ((Math.PI * 2) / this.planes.length);
      plane.material.uniforms.uRadius.value = this.radius;

      plane.userData.angle = angle;
      plane.position.x = Math.cos(angle) * this.radius;
      plane.position.z = Math.sin(angle) * this.radius;

      const lookAtIndex = (this.planes.length / 2 + i) % this.planes.length;
      plane.lookAt(this.planes[lookAtIndex].position);
    });

    this.planesGroup.position.z += this.camera.position.z - this.radius / 2;
    console.log(this.planes[0].material.uniforms.uRadius.value);
    console.log(this.radius);
  }

  createBounds() {
    const { width, height, x, y } = this.elements[0].getBoundingClientRect();
    this.bounds = { width, height, x, y };
    this.updatePosition();
  }

  updateScale() {
    const meshHeight =
      this.sizes.height * (this.bounds.height / window.innerHeight) * 0.5;
    const meshWidth = meshHeight * (9 / 16); // ratio 9/16
    this.planes.forEach((plane) => {
      plane.scale.set(meshWidth, meshHeight, 1);
    });

    this.updateMeshesPosition();
  }

  updatePosition() {
    if (!document.body.contains(this.elements[0])) return;
    const centerY = this.bounds.y + this.bounds.height / 2;

    const yScene =
      -(centerY / window.innerHeight) * this.sizes.height +
      this.sizes.height / 2;

    this.planes.forEach((plane) => {
      plane.position.y = yScene;
    });
  }

  onResize(sizes) {
    this.sizes = sizes;
    this.createBounds();
    this.updateScale();
  }

  update(scroll) {
    this.createBounds();
    this.planes.forEach((plane) => {
      plane.userData.isHovered = false;
    });

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.planes);
    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        intersects[i].object.userData.isHovered = true;
      }
    }

    this.planes.forEach((plane) => {
      //Rotation
      // const angle = plane.userData.angle + 0.01;
      // plane.userData.angle = angle;
      // plane.position.x = Math.cos(angle) * this.radius;
      // plane.position.z = Math.sin(angle) * this.radius;

      //Alpha
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
  }
}
