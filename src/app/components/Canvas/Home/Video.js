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
    this.addEventListeners();
    this.onResize(this.sizes);
  }

  createTextures() {
    this.video = window.PRELOADED[this.element.dataset.src];
    this.video.muted = true;
    this.video.playsInline = true;
    this.video.loop = true;
    this.video.play();

    this.texture = new THREE.VideoTexture(this.video);
  }

  createMesh() {
    this.uniforms = {
      uTexture: { value: this.texture },
      uMouse: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      uZoom: { value: 1.0 },
      uAmpliture: 30,
      uSpeed: 10,
      uFrequence: 40,
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

  onResize(sizes) {
    this.sizes = sizes;
    const meshWidth = this.sizes.width;
    const meshHeight = this.sizes.height;

    const videoRatio = this.video.videoWidth / this.video.videoHeight;
    const containerRatio = meshWidth / meshHeight;

    if (containerRatio < videoRatio) {
      this.mesh.scale.y = meshHeight;
      this.mesh.scale.x = meshHeight * videoRatio;
    } else {
      this.mesh.scale.x = meshWidth;
      this.mesh.scale.y = meshWidth / videoRatio;
    }
    this.baseScale = this.mesh.scale.clone();
  }

  updateY(y = 0) {
    const normalizedScroll = -y / window.innerHeight;
    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      normalizedScroll * this.sizes.height;
  }

  update(scroll) {
    this.uniforms.uTime.value += 0.01;
    //Zoom
    const targetZoom = 1.0 + scroll * 0.001;
    if (!this.currentZoom) this.currentZoom = 1.0;

    this.currentZoom += (targetZoom - this.currentZoom) * 0.1;

    this.uniforms.uZoom.value = this.currentZoom;

    this.updateY(scroll);

    const mouseX = this.mouseAbsolute.x / window.innerWidth;
    const mouseY = 1 - (this.mouseAbsolute.y + scroll) / window.innerHeight;

    this.uniforms.uMouse.value.set(
      Math.max(0, Math.min(1, mouseX)),
      Math.max(0, Math.min(1, mouseY))
    );
  }

  show() {}
  hide() {}

  addEventListeners() {
    window.addEventListener("mousemove", (event) => {
      this.mouseAbsolute.x = event.clientX;
      this.mouseAbsolute.y = event.clientY;
    });
  }
}
