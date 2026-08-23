import * as THREE from "three";
import Camera from "./Camera";
import Renderer from "./Renderer";
import { type LifeTimeObject, type Source } from "../types/types";
import Resources from "../utils/Resources";
import Sizes from "../utils/Sizes";
import Time from "../utils/Time";
import World from "../world/World";
import Debug from "../utils/Debug";
import InputSystem from "../inputs/InputSystem";
import CollisionManager from "../world/CollisionManager";
import Stats from "three/addons/libs/stats.module.js";
import GPURenderer from "./WebGPURenderer";

export default class Experience implements LifeTimeObject {
  declare canvas: HTMLCanvasElement;
  declare sizes: Sizes;
  declare time: Time;
  declare scene: THREE.Scene;
  declare sources: Source[];
  declare resources: Resources;
  declare camera: Camera;
  declare renderer: Renderer | GPURenderer;
  declare world: World;
  declare debug: Debug;
  declare inputSystem: InputSystem;
  declare collisionManager: CollisionManager;
  public areResourcesLoaded: boolean = false;
  declare public stats: Stats;

  static instance: Experience | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    sources: Source[],
    camera: Camera,
    world: World,
    useWebGPU: boolean = true,
  ) {
    //Singleton. That means you can't instantiate multiple experiences.
    if (Experience.instance) {
      return;
    }

    Experience.instance = this;

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
    this.sources = sources;
    this.inputSystem = new InputSystem();
    this.collisionManager = new CollisionManager();

    /**
     * constructor parameter values
     */
    this.camera = camera;
    this.world = world;
    if (useWebGPU) {
      this.renderer = new GPURenderer();
    } else {
      this.renderer = new Renderer();
    }

    // Sizes resize event
    this.sizes.on("resize", () => {
      this.resize();
    });
    if (this.debug.active) {
      this.displayPerformances();
    }
    console.log("Experience class instantiated");
  }

  loadAsync = async (sources: Source[]) => {
    this.resources = new Resources(sources);
    await this.resources.startLoading();
  };

  displayPerformances() {
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  }

  /**
   * Load the sources and init classes.
   */
  init = async () => {
    if (this.renderer instanceof GPURenderer) {
      await this.renderer.instance.init();
    }
    await this.loadAsync(this.sources);
    this.camera.init();
    this.world.init();
    this.time.on("tick", () => {
      this.update();
    });
    this.areResourcesLoaded = true;
  };

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.stats?.update();
    this.camera.update();
    this.world.update();
    this.inputSystem.update();
    this.renderer.update();
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
      this.debug.ui.destroy();
    }

    this.inputSystem.destroy();
    console.log("Experience class destroyed");
  }
}
