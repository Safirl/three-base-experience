import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/Addons.js";
import Experience from "./Experience";
import type { LifeTimeObject } from "../types/types";
import type Debug from "../utils/Debug";
import type GUI from "lil-gui";

export default class Camera implements LifeTimeObject {
  declare experience: Experience;
  declare sizes: Experience["sizes"];
  declare scene: Experience["scene"];
  declare canvas: Experience["canvas"];
  declare debug: Debug
  declare debugFolder: GUI
  //@TODO do we want to keep a perspective camera or give the opportunity to change it ?
  declare instance: THREE.PerspectiveCamera; //or THREE.Camera
  // declare controls: OrbitControls

  /**
   * Called by the experience when the scene has been initialized
   */
  init() {
    if (!Experience.instance) {
      throw new Error("can't instantiate camera, Experience.instance is not valid")
    }
    this.experience = Experience.instance;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('camera')
    }
  
    this.setInstance();
    this.setControls();
    this.setDebugObject();
  }

  setInstance() {
    // this.instance = new THREE.PerspectiveCamera(
    //   35,
    //   this.sizes.width / this.sizes.height,
    //   0.1,
    //   100,
    // );
    // this.instance.position.set(6, 4, 8);
    this.scene.add(this.instance);
  }

  /**
   * Override to add controls to the camera
   * @TODO The Camera should be attached to an actor and not directly passed to the experience ?
   */
  setControls() {}

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  update() {}

  destroy() {}

  setDebugObject() {
    if(this.debug.active)
    {
      this.debugFolder
        .add(this.instance, 'fov')
        .name('fov')
        .min(5)
        .max(120)
        .step(1)
        .onChange(() => this.instance.updateProjectionMatrix())
    }
  }
}
