import * as THREE from "three"

export interface Source {
  name: string
  type: string
  path: string[] | string
}

/**
 * Lifetime interface. Enables to call specific function when the experience inits, updates and destroys an object.
 */
export interface LifeTimeObject {
  init: () => void
  update: () => void
  destroy: () => void
}

export interface Textures {
    color: THREE.Texture;
    normal?: THREE.Texture;
    displacement?: THREE.Texture;
    roughness?: THREE.Texture;
    aoMap?: THREE.Texture;
    metalness?: THREE.Texture;
  };