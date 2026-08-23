import World from "../world/World";
import Experience from "../experience/Experience";
import Environment from "../world/Environment";
import * as THREE from "three/webgpu"
import MaterialTemplate from "./MaterialTemplate";
import type { Material } from "../materials/types";

/**
 * A template world setup with a simple sphere. Use it when you need to quickly work on a material
 */

export default class TemplateMaterialWorld extends World {
  declare private sphere: THREE.Mesh
  declare experience: Experience;
  declare scene: Experience["scene"];
  declare environment: Environment;
  declare resources: Experience["resources"];
  declare private material: Material

  init(): void {
    super.init()
    this.environment = new Environment(
      this.resources.items.environmentMapTexture1 as THREE.CubeTexture,
      false,
    );
    this.createSphere()
    this.scene.add(this.sphere);
  }

  createSphere = () => {
    this.createMaterial();
    this.sphere = new THREE.Mesh(this.createGeometry(), this.createMaterial())
  }

  createGeometry = () => {
    return new THREE.SphereGeometry()
  }

  createMaterial = () => {
    this.material = new MaterialTemplate();
    return this.material.createMaterial()
  }

  update(): void {
    super.update()
    this.material.update()
  }
}
