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

  /**
   * Initializes the World after resources are loaded.
   * The method is automatically called by the Experience when the asset loading is complete.
  */
 init() {
   if (!Experience.instance) throw new Error("World initialization failed: Experience.instance is not available. Make sure Experience is initialized before creating the World.");
   
   this.experience = Experience.instance;
   this.scene = this.experience.scene;
   this.resources = this.experience.resources;
  }

  destroy() {}

  update() {}
}
