import { Inspector } from 'three/addons/inspector/Inspector.js';
import Experience from "../experience/Experience";
import { WebGPURenderer } from "three/webgpu";

export default class Debug {
	declare active: boolean;
  declare inspector: Inspector
	declare experience: Experience

	constructor() {
    this.active = window.location.hash === "#debug";

    if (!Experience.instance) throw new Error ("Experience is not valid, can't create Debug!")
		this.experience = Experience.instance
  }

  init() {
    if (this.active && this.experience.renderer.instance instanceof WebGPURenderer) {
      this.inspector = this.experience.renderer.instance.inspector = new Inspector();
    }
  }
}
