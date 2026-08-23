import { NodeMaterial } from "three/webgpu";

export interface Material {
  material: NodeMaterial;
  /**
   * initialize the material by computing its vertex and fragment nodes.
   * @returns the created material
   */
  createMaterial: () => NodeMaterial;
  computeVertex: () => void;
  computeFragment: () => void;
  /**
   * Update uniforms etc.
   * @returns
   */
	update: () => void;
	destroy: () => void;
}
