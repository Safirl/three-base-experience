import Experience from "../experience/Experience";
import Environment from "./Environment";
import Floor from "../template/Floor";
import type { GLTF } from "three/examples/jsm/Addons.js";
import Actor from "../actor/Actor";


/**
 * Base class to add objects to the world.
 */
export default class World {
  declare experience: Experience;
  declare scene: Experience["scene"];
  declare environment: Environment;
  declare resources: Experience["resources"];
  declare floor: Floor;
  declare fox: Actor

  constructor() {
    if (!Experience.instance) {
      return;
    }
    this.experience = Experience.instance;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => this.onResourcesLoaded());
  }

  onResourcesLoaded() {
    this.floor = new Floor();
    this.fox = new Actor("fox", this.resources.items.foxModel as GLTF)
    this.fox.model.scale.set(0.02, 0.02, 0.02)
    this.environment = new Environment();
  }

  update() {
    if (this.fox) {
      this.fox.update()
    }
  }
}
