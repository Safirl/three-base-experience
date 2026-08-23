import { positionLocal } from "three/tsl";
import type { Material } from "../materials/types";
import { MeshStandardNodeMaterial } from "three/webgpu";

/**
 * I tried to think materials in a sperate class than the object itself.
 * Maybe seperate the compute vertex part and **** part is a mistake as we could want to do both at the same type.
 * Howewever we can still sore nodes or computes values in the class variables.
 * Also, maybe having a higher level of abstraction would be better, as THREE JS doesn't talk about Vertex or Fragment node but directly in opacity, color etc.
 */

/**
 * Material template. Override it to have a quickstart
 */
export default class MaterialTemplate implements Material {
  declare material: MeshStandardNodeMaterial
  createMaterial = (): MeshStandardNodeMaterial => {
    this.material = new MeshStandardNodeMaterial()
    this.computeVertex();
    this.computeFragment();
    return this.material;
  };

  computeVertex = () => {
  }

  computeFragment = () => {
    //create shader here
    const TransformedPositionNode = positionLocal.add(1).mul(.5);

    //assign output here
    this.material.colorNode = TransformedPositionNode
  };

  destroy = () => {

  };
  update = () => {

  };
}
