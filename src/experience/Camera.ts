import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Experience from "./Experience";

export default class Camera {
  declare experience: Experience;
  declare sizes: Experience["sizes"];
  declare scene: Experience["scene"];
  declare canvas: Experience["canvas"];
  declare instance: THREE.PerspectiveCamera;
  declare controls: OrbitControls;

  constructor() {
    if (!Experience.instance) {
      return;
    }
    this.experience = Experience.instance;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.setInstance();
    this.setOrbitControls();
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100,
    );
    this.instance.position.set(6, 4, 8);
    this.scene.add(this.instance);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
