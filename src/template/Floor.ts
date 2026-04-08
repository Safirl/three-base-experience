import * as THREE from "three";
import StaticObject from "../objects/StaticObject";

export default class Floor extends StaticObject {
  setGeometry() {
    this.geometry = new THREE.CircleGeometry(5, 64);
  }

  setTextures() {
    this.textures = {
      color: this.resources.items.grassColorTexture as THREE.Texture,
      normal: this.resources.items.grassNormalTexture as THREE.Texture,
    };
    if (this.textures.color) {
      this.textures.color.colorSpace = THREE.SRGBColorSpace;
      this.textures.color.repeat.set(1.5, 1.5);
      this.textures.color.wrapS = THREE.RepeatWrapping;
      this.textures.color.wrapT = THREE.RepeatWrapping;
    }

    if (this.textures.normal) {
      this.textures.normal.colorSpace = THREE.SRGBColorSpace;
      this.textures.normal.repeat.set(1.5, 1.5);
      this.textures.normal.wrapS = THREE.RepeatWrapping;
      this.textures.normal.wrapT = THREE.RepeatWrapping;
    }
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
