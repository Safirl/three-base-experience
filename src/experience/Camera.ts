import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/Addons.js";
import Experience from "./Experience";
import type { LifeTimeObject } from "../types/types";

export default class Camera implements LifeTimeObject {
  declare experience: Experience;
  declare sizes: Experience["sizes"];
  declare scene: Experience["scene"];
  declare canvas: Experience["canvas"];
  //@TODO do we want to keep a perspective camera or give the opportunity to change it ?
  declare instance: THREE.PerspectiveCamera; //or THREE.Camera
  // declare controls: OrbitControls

  /**
   * Called by the experience when the scene has been initialized
   */
  init() {
    if (!Experience.instance) {
      return;
    }
    this.experience = Experience.instance;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
  
    this.setInstance();
    // this.setControls();
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

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {}

  destroy() {}
}
