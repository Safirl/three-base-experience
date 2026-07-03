import * as THREE from "three";

import { EventEmitter } from "./EventEmitter";
import type { Source } from "../types/types";
import {
  DRACOLoader,
  type GLTF,
  GLTFLoader,
} from "three/examples/jsm/Addons.js";

export default class Resources extends EventEmitter {
  declare sources: Source[];
  declare items: { [key: string]: GLTF | THREE.Texture | THREE.CubeTexture };
  declare toLoad: number;
  declare loaded: number;
  declare loaders: {
    gltfLoader?: GLTFLoader;
    textureLoader?: THREE.TextureLoader;
    cubeTextureLoader?: THREE.CubeTextureLoader;
  };

  constructor(sources: Source[]) {
    super();

    // Options
    this.sources = sources;
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
  }

  setLoaders() {
    this.loaders = {};
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.gltfLoader.setDRACOLoader(dracoLoader);
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
  }

  async startLoading() {
    const promises = this.sources.map(async (source) => {
      if (source.type === "gltfModel" && this.loaders.gltfLoader) {
        const file = await this.loaders.gltfLoader.loadAsync(
          source.path as string,
        );
        this.sourceLoaded(source, file);
      } else if (source.type === "texture" && this.loaders.textureLoader) {
        const file = await this.loaders.textureLoader.loadAsync(
          source.path as string,
        );
        this.sourceLoaded(source, file);
      } else if (
        source.type === "cubeTexture" &&
        this.loaders.cubeTextureLoader
      ) {
        const file = await this.loaders.cubeTextureLoader.loadAsync(
          source.path as string[],
        );
        this.sourceLoaded(source, file);
      }
    });

    await Promise.all(promises);
  }

  sourceLoaded(source: Source, file: GLTF | THREE.Texture | THREE.CubeTexture) {
    this.items[source.name] = file;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
