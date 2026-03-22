import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import Camera from "../experience/Camera";

export default class OrbitCamera extends Camera{
  declare controls: OrbitControls;

  init(): void {
    super.init()
    this.setControls()
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(
      35,
      this.sizes.width / this.sizes.height,
      0.1,
      100,
    );
    this.instance.position.set(6, 4, 8);
    super.setInstance()
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
  }

  update() {
    this.controls.update();
  }

  destroy(): void {
    this.controls.dispose();
  }
}
