import * as THREE from "three";
import Experience from "../experience/Experience";
import type Debug from "../utils/Debug";
import type GUI from "lil-gui";
import EnvironmentMap from "./EnvironmentMap";

export default class Environment {
  declare experience: Experience;
  declare scene: Experience["scene"];
  declare sunLight: THREE.DirectionalLight;
  declare resources: Experience["resources"];
  declare environmentMap: {
    texture: THREE.CubeTexture;
    intensity: number;
    updateMaterials: () => void;
  };
  declare debug: Debug
  declare debugFolder: GUI

  constructor(environmentMap?: THREE.CubeTexture) {
    if (!Experience.instance) throw new Error("Environment initialization failed: Experience.instance is not available. Make sure Experience is initialized before creating the Environment.");

    this.experience = Experience.instance;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.debug = this.experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('environment')
    }

    this.setSunlight();
    this.setEnvironmentMap();
    this.setDebugObject();
  }

  setSunlight() {
    this.sunLight = new THREE.DirectionalLight("#ffffff", 3);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.camera.far = 25;
    this.sunLight.shadow.mapSize.set(1024, 1024);
    this.sunLight.shadow.normalBias = 0.05;
    this.sunLight.position.set(3, 3, 2);
    this.scene.add(this.sunLight);
  }

  setEnvironmentMap() {
    if (!this.resources.items.environmentMapTexture) return;
    this.environmentMap = new EnvironmentMap(.5, this.resources.items.environmentMapTexture as THREE.CubeTexture, this.scene)
    this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;

    this.environmentMap.updateMaterials();
  }
  
  setDebugObject() {
    if(this.debug.active)
    {
      this.debugFolder
        .add(this.environmentMap, 'intensity')
        .name('envMapIntensity')
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(this.environmentMap.updateMaterials)

      this.debugFolder
        .add(this.sunLight, 'intensity')
        .name('sunLightIntensity')
        .min(0)
        .max(10)
        .step(0.001)
      
      this.debugFolder
        .add(this.sunLight.position, 'x')
        .name('sunLightX')
        .min(- 5)
        .max(5)
        .step(0.001)
      
      this.debugFolder
        .add(this.sunLight.position, 'y')
        .name('sunLightY')
        .min(- 5)
        .max(5)
        .step(0.001)
      
      this.debugFolder
        .add(this.sunLight.position, 'z')
        .name('sunLightZ')
        .min(- 5)
        .max(5)
        .step(0.001)
    }
  }
}
