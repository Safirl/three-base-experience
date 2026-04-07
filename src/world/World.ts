import Experience from "../experience/Experience";
import Environment from "./Environment";
import type { LifeTimeObject } from "../types/types";


/**
 * Base class to add objects to the world.
 */
export default class World implements LifeTimeObject {
  declare experience: Experience;
  declare scene: Experience["scene"];
  declare environment: Environment;
  declare resources: Experience["resources"];

  onResourcesLoaded() {
    this.environment = new Environment();
  }

  init() {
    if (!Experience.instance) throw new Error("World initialization failed: Experience.instance is not available. Make sure Experience is initialized before creating the World.");
    
    this.experience = Experience.instance;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    
    this.resources.on("ready", () => this.onResourcesLoaded());
  }

  destroy() {}

  update() {}
}
