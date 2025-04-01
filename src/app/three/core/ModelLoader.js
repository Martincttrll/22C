import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export class ModelLoader {
  constructor(url) {
    this.loader = new GLTFLoader();
    this.model = null;
  }

  load(url) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          this.model = gltf.scene;
          resolve(this.model);
        },
        undefined,
        (error) => {
          console.error("Erreur lors du chargement du modèle :", error);
          reject(error);
        }
      );
    });
  }
}
