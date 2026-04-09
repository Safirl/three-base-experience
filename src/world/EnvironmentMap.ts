import * as THREE from "three"

export default class EnvironmentMap {
    declare intensity: number
    declare texture: THREE.CubeTexture
    declare scene: THREE.Scene

    constructor(intensity: number, texture: THREE.CubeTexture, scene: THREE.Scene, useAsBackground: boolean = false) {
        if (!texture || !scene) {
            console.error("Invalid texture or scene when instantiating environment map")
            return;
        }
        this.intensity = intensity
        this.texture = texture
        this.scene = scene
        this.scene.environment = this.texture;
        if (useAsBackground) this.setBackgroundEnvironment(texture)
    }

    setBackgroundEnvironment(texture: THREE.CubeTexture) {
      this.scene.background = texture;
    }

    setEnvironmentMap(texture: THREE.CubeTexture) {
      this.texture = texture
      this.scene.environment = texture;
      this.updateMaterials()
    }

    updateMaterials = () => {
        this.scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.texture;
          child.material.envMapIntensity = this.intensity;
          child.material.needsUpdate = true;
        }
      });
    }
}