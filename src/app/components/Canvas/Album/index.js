import Transition from "../Transition.js";
import * as THREE from "three";
import gsap from "gsap";
import vertexShader from "@shaders/audio-vertex.glsl";
import fragmentShader from "@shaders/audio-fragment.glsl";

export default class Album {
  constructor({ scene, sizes, camera, group, transition }) {
    this.scene = scene;
    this.camera = camera;
    this.sizes = sizes;
    this.group = group;
    this.transition = transition;
  }

  onClickBack() {
    if (!this.transition.meshCopy) {
      this.transition.animateFallbackMesh(this.fakeMesh);
    } else {
      this.transition.playFromAlbum();
    }
  }

  onAudioPlay(audio) {
    if (!this.audioListener) {
      this.audioListener = new THREE.AudioListener();
    }
    if (this.camera && !this.camera.children.includes(this.audioListener)) {
      this.camera.add(this.audioListener);
    }

    const threeAudio = new THREE.Audio(this.audioListener);

    // 4. Connecte la source audio
    const audioContext = this.audioListener.context;
    const source = audioContext.createMediaElementSource(audio);
    threeAudio.setNodeSource(source);

    this.analyser = new THREE.AudioAnalyser(threeAudio, 64);
    const size = this.analyser.analyser.frequencyBinCount;

    const data = new Uint8Array(size);
    const audioDataTex = new THREE.DataTexture(
      data,
      size,
      1,
      THREE.RedFormat,
      THREE.UnsignedByteType
    );
    audioDataTex.needsUpdate = true;

    this.audioData = data;

    this.uniforms = {
      uTime: { value: 0 },
      uAudioData: { value: audioDataTex },
      uAudioTextureSize: { value: size },
    };

    this.audioMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader,
        fragmentShader,
      })
    );

    this.audioMesh.position.set(0, 0, 0);

    this.scene.add(this.audioMesh);
  }

  update() {
    if (this.analyser && this.audioMesh) {
      this.analyser.getFrequencyData(this.audioData);

      // Met à jour la texture pour le shader
      this.uniforms.uAudioData.value.needsUpdate = true;

      this.uniforms.uTime.value += 0.05;

      this.audioMesh.rotation.x += 0.01;
      this.audioMesh.rotation.y += 0.01;
    }
  }

  show() {
    if (this.transition.meshCopy) return; //Si on a déjà un mesh de transition
    //arrivé direct sur album,
    const coverUrl = document.querySelector(".album__wrapper").dataset.cover;

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
    const texture = new THREE.TextureLoader().load(coverUrl);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    this.fakeMesh = new THREE.Mesh(geometry, material);
    this.fakeMesh.material.side = THREE.DoubleSide;
    this.fakeMesh.rotation.y = Math.PI;

    const cameraZ = this.camera.position.z;
    const distance = Math.abs(cameraZ - this.fakeMesh.position.z);
    const fov = this.camera.fov * (Math.PI / 180);
    const heightAtDistance = 2 * Math.tan(fov / 2) * distance;
    const widthAtDistance = heightAtDistance * this.camera.aspect;
    const scaleTarget = Math.max(widthAtDistance, heightAtDistance);
    this.fakeMesh.scale.set(scaleTarget, scaleTarget, 1);
    this.fakeMesh.material.transparent = true;
    this.fakeMesh.material.opacity = 0;

    this.fakeMesh.position.set(0, 0, 0);

    this.scene.add(this.fakeMesh);
  }

  hide() {
    this.group.clear();
    this.scene.remove(this.group);
  }
}
