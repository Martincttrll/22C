import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mouse } from "@utils/mousePos.js";
import { Detection } from "@classes/Detection";
import { Cave, PIPE_REST } from "./Cave";

const CAMERA_POSITION = new THREE.Vector3(0, 0.4, 5);
const PARALLAX = { x: 0.6, y: 0.3 };

export class Merch {
  constructor({ renderer }) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = new THREE.FogExp2(0x000000, 0.055);

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    this.camera.position.copy(CAMERA_POSITION);
    this.target = PIPE_REST.clone().add(new THREE.Vector3(0, 0.6, 0));
    this.camera.lookAt(this.target);

    this.isDebug = new URLSearchParams(window.location.search).has("orbit");
  }

  create() {
    this.cave = new Cave({ quality: Detection.isMobile ? "low" : "high" });
    this.scene.add(this.cave.group);

    this.createLights();

    if (!Detection.isMobile) {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    if (this.isDebug) this.createControls();
  }

  createLights() {
    this.scene.add(new THREE.HemisphereLight(0x3a4250, 0x050505, 0.5));

    const key = new THREE.SpotLight(0xdfe8ff, 60, 14, 0.55, 0.7, 1.6);
    key.position.set(PIPE_REST.x + 0.5, PIPE_REST.y + 6, PIPE_REST.z + 1);
    key.target.position.copy(PIPE_REST);
    key.castShadow = !Detection.isMobile;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.0005;
    this.scene.add(key, key.target);

    const depth = new THREE.PointLight(0x6fa8ff, 25, 18, 1.6);
    depth.position.set(-1, 1.5, -18);
    this.scene.add(depth);

    const glow = new THREE.PointLight(0xff7a3d, 6, 8, 2);
    glow.position.set(5, -3, -9);
    this.scene.add(glow);
  }

  createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.copy(this.target);
    this.controls.enableDamping = true;
  }

  show() {
    if (!this.cave) this.create();
    this.isVisible = true;

    if (this.isDebug) {
      this.renderer.domElement.style.pointerEvents = "auto";
      this.renderer.domElement.style.zIndex = 10;
    }
  }

  hide() {
    this.isVisible = false;

    if (this.isDebug) {
      this.renderer.domElement.style.pointerEvents = "none";
      this.renderer.domElement.style.zIndex = 1;
    }
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  update() {
    if (!this.isVisible) return;

    if (this.controls) {
      this.controls.update();
      return;
    }

    if (Detection.isMobile) return;

    const x = THREE.MathUtils.clamp((mouse.x / window.innerWidth) * 2 - 1, -1, 1);
    const y = THREE.MathUtils.clamp((mouse.y / window.innerHeight) * 2 - 1, -1, 1);

    this.camera.position.x += (CAMERA_POSITION.x + x * PARALLAX.x - this.camera.position.x) * 0.04;
    this.camera.position.y += (CAMERA_POSITION.y - y * PARALLAX.y - this.camera.position.y) * 0.04;
    this.camera.lookAt(this.target);
  }
}
