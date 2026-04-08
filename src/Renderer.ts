import * as THREE from "three";
import Experience from "./experience/Experience";
import type { EffectComposer } from "three/examples/jsm/Addons.js";

export default class Renderer {
  declare experience: Experience;
  declare canvas: Experience["canvas"];
  declare sizes: Experience["sizes"];
  declare scene: Experience["scene"];
  declare camera: Experience["camera"];
  declare instance: THREE.WebGLRenderer;
  declare composer: EffectComposer | null

  constructor() {
    if (!Experience.instance) throw new Error("Renderer initialization failed: Experience.instance is not available. Ensure Experience is initialized before creating the Renderer.");

    this.experience = Experience.instance;
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.camera = this.experience.camera;

    this.setInstance();
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFShadowMap;
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    this.instance.setClearColor(0x211d20);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    if (this.composer) {
      this.composer.setSize(this.sizes.width, this.sizes.height);
      this.composer.setPixelRatio(this.sizes.pixelRatio);
    }
  }

  setComposer(composer: EffectComposer | null) {
    this.composer = composer
  }

  update() {
    if (this.composer) {
      this.composer.render()
    } 
    else {
      this.instance.render(this.scene, this.camera.instance);
    }
  }
}
