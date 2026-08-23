import { abs, length, max, min } from "three/tsl";
import * as THREE from "three/webgpu"

/**
 *
 * @param p position node
 * @param halfSize
 * @param radius
 * @returns
 */
export const roundedBoxSDF = (
  p: THREE.Node<"vec2">,
  halfSize: THREE.Node<"vec2">,
  radius: THREE.Node<"float">
): THREE.Node<"float"> => {
  const q = abs(p).sub(halfSize).add(radius);

  return length(max(q, 0))
    .add(min(max(q.x, q.y), 0))
    .sub(radius);
};
