import Experience from "../experience/Experience";
import Environment from "../world/Environment";
import Floor from "./Floor";
import type { GLTF } from "three/examples/jsm/Addons.js";
import Actor from "../actor/Actor";

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

    // test mesh
    // const testMesh = new THREE.Mesh(
    //   new THREE.BoxGeometry(1, 1, 1),
    //   new THREE.MeshStandardMaterial({
    //     color: 0xf3f3f3,
    //     roughness: 0.5,
    //     metalness: 0.5,
    //   }),
    // );
    // testMesh.castShadow = true;
    // this.scene.add(testMesh);

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
