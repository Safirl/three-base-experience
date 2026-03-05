import * as THREE from "three";

import { EventEmitter } from "./EventEmitter";
import type { Source } from "../types/types";
import { type GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";

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
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    //@TODO add the draco loader
  }

  startLoading() {
    for (const source of this.sources) {
      if (source.type === "gltfModel" && this.loaders.gltfLoader) {
        const path = source.path as string
        this.loaders.gltfLoader.load(path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (source.type === "texture" && this.loaders.textureLoader) {
        const path = source.path as string
        this.loaders.textureLoader.load(path, (file) => {
          this.sourceLoaded(source, file);
        });
      } else if (
        source.type === "cubeTexture" &&
        this.loaders.cubeTextureLoader
      ) {
        const paths = source.path as string[]
        this.loaders.cubeTextureLoader.load(paths, (file) => {
          this.sourceLoaded(source, file);
        });
      }
    }
  }

  sourceLoaded(source: Source, file: GLTF | THREE.Texture | THREE.CubeTexture) {
    this.items[source.name] = file;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}
