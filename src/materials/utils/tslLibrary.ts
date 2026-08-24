import { Fn, If, abs, blendDodge, clamp, cross, dFdx, dFdy, dot, float, max, mix, normalize, select, sign, smoothstep} from "three/tsl";
import * as THREE from "three/webgpu"

export const pingPong = Fn(({value, scale}: {value: THREE.Node<"float">, scale:THREE.Node<"float">}) => {
  return scale.sub(abs(value.mod(scale.mul(2)).sub(scale)));
})

/**
* Réplique le node "Bump" de Blender en TSL (Three Shading Language).
*
* Principe (identique au shader GLSL/OSL de Blender) :
* on reconstruit un repère tangent local à partir de la normale et des
* dérivées écran de la position (dFdx/dFdy), puis on projette le
* gradient de la hauteur sur ce repère pour perturber la normale.
*
* @param {Node<float>}       height     - Hauteur scalaire (texture ou procédural)
* @param {Node<float>}       strength   - Intensité du bump
* @param {Node<float>}       dist       - Distance / échelle du déplacement
* @param {Node<vec3>}        normal     - Normale de base (ex: normalView)
* @param {Node<vec3>}        surfacePos - Position de surface pour dFdx/dFdy (ex: positionView)
* @param {Node<float|bool>}  invert     - Inverse la direction du bump (0 ou 1)
* @returns {Node<vec3>} la normale perturbée (normalisée)
*/

export const bump = Fn(({ height, strength, dist, normal, surfacePos, invert }: { height: THREE.Node<"float">, strength: THREE.Node<"float">, dist: THREE.Node<"float">, normal: THREE.Node<"vec3">, surfacePos: THREE.Node<"vec3">, invert: THREE.Node<"float">}): THREE.Node<"vec3"> => {
  // Comme dans Blender : si "invert", on inverse la distance
  const signedDist = select(invert.greaterThan(0.0), dist.negate(), dist);

  // Dérivées écran de la position de surface -> tangentes locales
  const dPdx = dFdx(surfacePos);
  const dPdy = dFdy(surfacePos);

  // Reconstruction des tangentes à partir de la normale
  const Rx = cross(dPdy, normal);
  const Ry = cross(normal, dPdx);

  // Déterminant du repère local (mesure la "taille"/orientation)
  const det = dot(dPdx, Rx);
  const absDet = abs(det);

  // Gradient de la hauteur projeté sur le repère tangent
  const dHdx = dFdx(height);
  const dHdy = dFdy(height);
  const surfaceGradient = dHdx.mul(Rx).add(dHdy.mul(Ry));

  const strengthClamped = max(strength, 0.0);

  // Normale perturbée finale
  const bumpedNormal = normalize(
    absDet.mul(normal).sub(
      signedDist.mul(sign(det)).mul(strengthClamped).mul(surfaceGradient)
    )
  );

  return bumpedNormal;
});

/**
 * Remap smoothly the values in the given ranges.
 * @param smoother uncheck to use the default remap.
 */
export const smoothRemap = Fn(({smoother, x, inLow, inHigh, outLow, outHigh}: {smoother: THREE.Node<boolean>, x: any, inLow: any, inHigh: any, outLow: any, outHigh: any}) => {
  const t = smoothstep(inLow, inHigh, x).toVar();

  If(smoother, () => {
    const tLinear = clamp(x.sub(inLow).div(inHigh.sub(inLow)), 0.0, 1.0);
    t.assign(
      tLinear.mul(tLinear).mul(tLinear).mul(
        tLinear.mul(tLinear.mul(float(6)).sub(float(15))).add(float(10))
      ) // 6t⁵ - 15t⁴ + 10t³
    );
  });

  return mix(outLow, outHigh, t);
});

/**
 * Returns the min value between two inputs, smoothed in the output.
 * Note: Use its opposite sign to have the max value.
 * @returns the min value smoothed
 */
export const smoothMin = Fn(({a, b, k }: {a: any, b:any, k:THREE.Node<"float">}) => {
    const h = clamp(
      float(0.5).add(float(0.5).mul(b.sub(a)).div(k)),
      0.0,
      1.0
    );

    return mix(b, a, h).sub(k.mul(h).mul(float(1).sub(h)));
  }
);
