import Experience from "../experience/Experience";
import Environment from "../world/Environment";
import Floor from "./Floor";
import type { GLTF } from "three/examples/jsm/Addons.js";
import Actor from "../objects/Actor";
import World from "../world/World";

export default class TemplateWorld extends World{
  declare experience: Experience;
  declare scene: Experience["scene"];
  declare environment: Environment;
  declare resources: Experience["resources"];
  declare floor: Floor;
  declare fox: Actor
  declare fox1: Actor

  init() {
    super.init()
    this.floor = new Floor();
    //Fox is just an actor because it doesn't have any logic in it.
    this.fox = new Actor("fox", this.resources.items.foxModel as GLTF, true)
    this.fox.model.scale.set(0.02, 0.02, 0.02)
    this.fox1 = new Actor("fox", this.resources.items.foxModel as GLTF, true)
    this.fox1.model.scale.set(0.02, 0.02, 0.02)
    this.environment = new Environment();
  }

  update() {
    if (this.fox) {
      this.fox.update()
      this.fox1.update()
    }
  }
}
