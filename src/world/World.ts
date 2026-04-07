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
   * World is initialized only when the resources are loaded
   */
  init() {
    if (!Experience.instance) {
      return;
    }
    this.experience = Experience.instance;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    new Environment();
  }

  destroy() {}

  update() {}
}
