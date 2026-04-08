import * as THREE from "three";
import Camera from "./Camera";
import Renderer from "../Renderer";
import { type LifeTimeObject, type Source } from "../types/types";
import Resources from "../utils/Resources";
import Sizes from "../utils/Sizes";
import Time from "../utils/Time";
import World from "../world/World";
import Debug from "../utils/Debug";
import InputSystem from "../inputs/InputSystem";
import Stats from 'three/addons/libs/stats.module.js';

export default class Experience implements LifeTimeObject {
  declare canvas: HTMLCanvasElement;
  declare sizes: Sizes;
  declare time: Time;
  declare scene: THREE.Scene;
  declare resources: Resources;
  declare camera: Camera;
  declare renderer: Renderer;
  declare world: World;
  declare debug: Debug;
  declare inputSystem: InputSystem

  static instance: Experience | null = null

  constructor(canvas: HTMLCanvasElement, sources: Source[], camera: Camera, world: World) {
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
    this.inputSystem = new InputSystem();
    
    /**
     * constructor parameter values
    */
   this.camera = camera
   this.world = world
   
   this.renderer = new Renderer();
   
   // Sizes resize event
   this.sizes.on("resize", () => {
     this.resize();
    });
    
    this.resources.on("ready", () => this.onResourcesLoaded());
    
    this.displayPerformances()
    console.log("Experience class instantiated");
  }

  displayPerformances() {
    // if (this.debug.active)
    return;
  }
  
  /**
   * Init classes only when the resources are loaded
  */
 onResourcesLoaded() {
    this.time.on("tick", () => {
      this.update();
    });
    // Time tick event
    this.camera.init()
    this.world.init()
  }

  init = () => {}

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.update();
    this.world.update();
    this.renderer.update();
    this.inputSystem.update();
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    this.world.destroy();
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
    this.renderer.instance.dispose();
    if (this.debug.active) {
      this.debug.ui.destroy()
    }

    this.inputSystem.destroy();
    console.log("Experience class destroyed");
  }
}
