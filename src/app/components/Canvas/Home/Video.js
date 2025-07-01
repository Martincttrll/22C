import * as THREE from "three";
import vertexShader from "@shaders/video-vertex.glsl";
import fragmentShader from "@shaders/video-fragment.glsl";
import { mouse } from "@utils/mousePos";

export default class Video {
  constructor({ element, group, sizes }) {
    this.mouse = mouse;
    this.element = element;
    this.group = group;
    this.sizes = sizes;
    this.mouseAbsolute = { x: 0, y: 0 };

    this.createTextures();
    this.createMesh();
    this.createBounds();
    this.addEventListeners();
  }

  createTextures() {
    this.texture = new THREE.VideoTexture(this.element);
  }

  createMesh() {
    this.uniforms = {
      uTexture: { value: this.texture },
      uMouse: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      uAmpliture: 0.5,
      uSpeed: 1,
      uFrequence: 3,
    };
    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);
    this.group.add(this.mesh);

    this.element.style.visibility = "hidden";
  }

  createBounds() {
    requestAnimationFrame(() => {
      const { width, height, x, y } = this.element.getBoundingClientRect();
      this.bounds = { width, height, x, y };
      this.updateScale();
      this.updatePosition();
    });
  }
  updateScale() {
    if (!document.body.contains(this.element)) return;

    const meshWidth =
      this.sizes.width * (this.bounds.width / window.innerWidth);
    const meshHeight =
      this.sizes.height * (this.bounds.height / window.innerHeight);

    const videoRatio = this.element.videoWidth / this.element.videoHeight;
    const containerRatio = meshWidth / meshHeight;

    if (containerRatio < videoRatio) {
      this.mesh.scale.y = meshHeight;
      this.mesh.scale.x = meshHeight * videoRatio;
    } else {
      this.mesh.scale.x = meshWidth;
      this.mesh.scale.y = meshWidth / videoRatio;
    }
  }

  updatePosition() {
    if (!document.body.contains(this.element)) return;
    this.x = (this.bounds.x + this.bounds.width / 2) / window.innerWidth;
    this.y = (this.bounds.y + this.bounds.height / 2) / window.innerHeight;
    this.mesh.position.x = this.x * this.sizes.width - this.sizes.width / 2;
    this.mesh.position.y = -this.y * this.sizes.height + this.sizes.height / 2;
  }

  onResize(sizes) {
    this.sizes = sizes;
    this.createBounds();
  }

  update(scroll) {
    this.uniforms.uTime.value += 0.5;

    this.createBounds();
    if (this.bounds) {
      const mouseX = this.mouseAbsolute.x / window.innerWidth;

      const elementTop = this.bounds.y;
      const elementHeight = this.bounds.height;

      const mouseYRelativeToElement =
        (this.mouseAbsolute.y - elementTop) / elementHeight;

      const mouseY = 1 - mouseYRelativeToElement;

      this.uniforms.uMouse.value.set(mouseX, mouseY);
    }
  }

  show() {}
  hide() {}

  addEventListeners() {
    window.addEventListener("mousemove", (event) => {
      this.mouseAbsolute.x = event.clientX + window.scrollX;
      this.mouseAbsolute.y = event.clientY + window.scrollY;
    });
  }
}
