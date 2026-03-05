import * as THREE from "three";
import Camera from "./Camera";
import Renderer from "../Renderer";
import { type Source } from "../types/types";
import Resources from "../utils/Resources";
import Sizes from "../utils/Sizes";
import Time from "../utils/Time";
import World from "../world/World";
import Debug from "../utils/Debug";

export default class Experience {
  declare canvas: HTMLCanvasElement;
  declare sizes: Sizes;
  declare time: Time;
  declare scene: THREE.Scene;
  declare resources: Resources;
  declare camera: Camera;
  declare renderer: Renderer;
  declare world: World;
  declare debug: Debug

  static instance: Experience | null = null

  constructor(canvas: HTMLCanvasElement, sources: Source[]) {
    //Singleton. That means you can't instantiate multiple experiences. 
    if(Experience.instance)
    {
      return;
    }
    Experience.instance = this
    
    // Global access (replaced by the static instance property)
    //@ts-ignore
    window.experience = this;

    // Options
    this.canvas = canvas;

    // Setup
    this.debug = new Debug();
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new THREE.Scene();
    this.resources = new Resources(sources);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    // Sizes resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });

    console.log("Experience class instantiated");
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update()
    this.renderer.update();
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    // Traverse the whole scene
    this.scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();

        for (const key in child.material) {
          const value = child.material[key];
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.sizes.destroy();
    this.camera.controls?.dispose();
    this.renderer.instance.dispose();
    if (this.debug.active) {
      this.debug.ui.destroy()
    }

    console.log("Experience class destroyed");
  }
}
