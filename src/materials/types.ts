import { NodeMaterial } from "three/webgpu";

export interface Material {
  material: NodeMaterial;
  createMaterial: () => NodeMaterial;
  computeVertex: () => void;
  computeFragment: () => void;
	update: () => void;
	destroy: () => void;
}
