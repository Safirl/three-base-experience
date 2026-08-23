import { positionLocal, sin, time, uniform, vec3 } from "three/tsl";
import type { Material } from "../materials/types";
import { MeshStandardNodeMaterial } from "three/webgpu";

/**
 * Material template. Override it to have a quickstart. Use it when you need to separate the material from the rest of the code for a cleaner oraganization.
 */
export default class MaterialTemplate implements Material {
  declare material: MeshStandardNodeMaterial
  randomUniform = uniform(0.);
  //or declare randomUniform: Uniform<number|"float"> but it overcomplicates it.

  createMaterial = (): MeshStandardNodeMaterial => {
    this.material = new MeshStandardNodeMaterial()
    this.computeVertex();
    this.computeFragment();
    return this.material;
  };

  computeVertex = () => {
    if (!this.material) throw new Error("Material is not valid. Call 'createMaterial' first before calling this function.")

    //create shader here
    const oscY = sin(time.add(positionLocal.x))

    //assign output here
    this.material.positionNode = vec3(positionLocal.x, positionLocal.y.add(oscY), positionLocal.z)
  }

  computeFragment = () => {
    if (!this.material) throw new Error("Material is not valid. Call 'createMaterial' first before calling this function.")

    //create shader here
    const TransformedPositionNode = positionLocal.add(1).mul(.5);

    //assign output here
    this.material.colorNode = TransformedPositionNode
  };

  destroy = () => {

  };

  update = () => {
    this.randomUniform.value += 1.;
  };
}
