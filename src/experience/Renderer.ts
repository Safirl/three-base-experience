import * as THREE from "three";
import Experience from "./Experience";
import {
  EffectComposer,
  OutputPass,
  RenderPass,
  type Pass,
} from "three/examples/jsm/Addons.js";

export default class Renderer {
  declare experience: Experience;
  declare canvas: Experience["canvas"];
  declare sizes: Experience["sizes"];
  declare scene: Experience["scene"];
  declare camera: Experience["camera"];
  declare instance: THREE.WebGLRenderer;
  declare protected composer: EffectComposer | null;
  declare private renderPass: RenderPass;
  declare private outputPass: OutputPass;

  constructor() {
    if (!Experience.instance)
      throw new Error(
        "Renderer initialization failed: Experience.instance is not available. Ensure Experience is initialized before creating the Renderer.",
      );

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
      //@TODO Unfortunately, we can't remove the antialias after intializing the instance.
      // We should add a way to rebuild the webgltarget when we are using the composer.
      // antialias: true,
    });

    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFShadowMap;
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
    this.instance.setClearColor(0x000000);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);

    this.experience.renderer = this;
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    if (this.composer) {
      this.composer.setSize(this.sizes.width, this.sizes.height);
      this.composer.setPixelRatio(Math.min(this.sizes.pixelRatio, 1.5));
    }
  }

  addComposerPass(
    pass: Pass,
    afterGammaCorrectionPass?: boolean,
    index?: number,
  ) {
    if (!this.composer) {
      this.initializeComposer();
    }
    if (typeof index === "number") {
      this.composer?.insertPass(pass, index);
    } else if (!afterGammaCorrectionPass) {
      this.composer?.insertPass(pass, this.composer.passes.length - 1);
    } else {
      this.composer?.addPass(pass);
    }
  }

  removeComposerPass(pass: Pass) {
    if (!this.composer) return;
    this.composer.removePass(pass);
  }

  initializeComposer() {
    if (this.composer) {
      console.warn("the composer has already been initialized");
      return;
    }
    const renderTarget = new THREE.WebGLRenderTarget(800, 600, {
      type: THREE.HalfFloatType,
      samples: this.experience.sizes.pixelRatio < 2 ? 2 : 1,
    });
    this.composer = new EffectComposer(this.instance, renderTarget);
    //@TODO we should add a way to have quality presets and switch between them.
    // It will avoid to manually have to decrease the pixel ratio
    this.composer.setPixelRatio(
      Math.min(this.experience.sizes.pixelRatio, 1.5),
    );
    this.composer.setSize(
      this.experience.sizes.width,
      this.experience.sizes.height,
    );

    this.renderPass = new RenderPass(this.scene, this.camera.instance);
    this.composer.addPass(this.renderPass);
    this.outputPass = new OutputPass();
    this.composer.addPass(this.outputPass);
  }

  getRenderPass = () => {
    if (!this.composer) {
      this.initializeComposer();
    }
    return this.renderPass;
  };

  getOutputPass = () => {
    if (!this.composer) {
      this.initializeComposer();
    }
    return this.outputPass;
  };

  update() {
    if (this.composer) {
      this.composer.render();
    } else {
      this.instance.render(this.scene, this.camera.instance);
    }
  }
}
