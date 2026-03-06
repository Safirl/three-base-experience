import * as THREE from "three";
import type Resources from "../utils/Resources";
import Experience from "../experience/Experience";

export default class Floor {
  declare experience: Experience
  declare scene: THREE.Scene;
  declare resources: Resources;
  declare geometry: THREE.CircleGeometry;
  declare textures: {
    color: THREE.Texture;
    normal: THREE.Texture;
  };
  declare material: THREE.MeshStandardMaterial;
  declare mesh: THREE.Mesh<THREE.CircleGeometry, THREE.MeshStandardMaterial>;

  constructor() {
    if (!Experience.instance) {
      return
    }
    this.scene = Experience.instance.scene;
    this.resources = Experience.instance.resources;

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.CircleGeometry(5, 64);
  }

  setTextures() {
    this.textures = {
      color: this.resources.items.grassColorTexture as THREE.Texture,
      normal: this.resources.items.grassNormalTexture as THREE.Texture,
    };
    this.textures.color.colorSpace = THREE.SRGBColorSpace;
    // this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    this.textures.normal.colorSpace = THREE.SRGBColorSpace;
    // this.textures.normal.repeat.set(1.5, 1.5);
    // this.textures.normal.wrapS = THREE.RepeatWrapping;
    // this.textures.normal.wrapT = THREE.RepeatWrapping;
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.position.y = -0.001;
    this.mesh.receiveShadow = true;
    this.scene.add(this.mesh);
  }
}
