import * as THREE from "three";
import type Resources from "../utils/Resources";
import Experience from "../experience/Experience";
import type { LifeTimeObject, Textures } from "../types/types";

/**
 * Base class to create static object, such as floor or walls. It uses a Mesh standard material
 */
export default abstract class StaticObject implements LifeTimeObject {
  declare experience: Experience
  declare scene: THREE.Scene;
  declare resources: Resources;
  declare geometry: THREE.BufferGeometry;
  declare textures: Textures
  declare material: THREE.MeshStandardMaterial;
  declare mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  declare receiveShadows: boolean
  declare castShadow: boolean
  private Id: string = crypto.randomUUID()


  constructor(textures?: Textures, receiveShadows: boolean = false, castShadow: boolean = false) {
    if (!Experience.instance) throw new Error("StaticObject initialization failed: Experience.instance is not available. Make sure Experience is initialized before creating a StaticObject."  
    );
    
    if (textures) {
      this.textures = textures
    }
    this.receiveShadows = receiveShadows
    this.castShadow = castShadow
    

    this.scene = Experience.instance.scene;
    this.resources = Experience.instance.resources;
  
    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
  }
  
  getId(): string {
      return this.Id
  }

  init(){};
  update() {};
  destroy() {};

  /**
   * Override this function to set the geometry
   */
  setGeometry() {}

  /**
   * Called when the textures are set. If the texture object is valid, it will set the corresponding texture for the object.
   * Otherwise it is possible de override this function and set other textures.
   */
  setTextures() {
    if (!this.textures) {
      return;
    }
    this.textures.color.colorSpace = THREE.SRGBColorSpace;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = THREE.RepeatWrapping;
    this.textures.color.wrapT = THREE.RepeatWrapping;

    if (this.textures.normal) {
      this.textures.normal.colorSpace = THREE.SRGBColorSpace;
      this.textures.normal.repeat.set(1.5, 1.5);
      this.textures.normal.wrapS = THREE.RepeatWrapping;
      this.textures.normal.wrapT = THREE.RepeatWrapping;
    }

    if (this.textures.displacement) {
      // this.textures.displacement.colorSpace = THREE.SRGBColorSpace;
      this.textures.displacement.repeat.set(1.5, 1.5);
      this.textures.displacement.wrapS = THREE.RepeatWrapping;
      this.textures.displacement.wrapT = THREE.RepeatWrapping;
    }

    if (this.textures.roughness) {
      // this.textures.roughness.colorSpace = THREE.SRGBColorSpace;
      this.textures.roughness.repeat.set(1.5, 1.5);
      this.textures.roughness.wrapS = THREE.RepeatWrapping;
      this.textures.roughness.wrapT = THREE.RepeatWrapping;
    }


    if (this.textures.aoMap) {
      // this.textures.aoMap.colorSpace = THREE.SRGBColorSpace;
      this.textures.aoMap.repeat.set(1.5, 1.5);
      this.textures.aoMap.wrapS = THREE.RepeatWrapping;
      this.textures.aoMap.wrapT = THREE.RepeatWrapping;
    }

    if (this.textures.metalness) {
      // this.textures.metalness.colorSpace = THREE.SRGBColorSpace;
      this.textures.metalness.repeat.set(1.5, 1.5);
      this.textures.metalness.wrapS = THREE.RepeatWrapping;
      this.textures.metalness.wrapT = THREE.RepeatWrapping;
    }
  }

  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
      aoMap: this.textures.aoMap,
      metalnessMap: this.textures.metalness,
      roughnessMap: this.textures.roughness,
      displacementMap: this.textures.displacement
    });
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.position.y = -0.001;
    this.mesh.receiveShadow = this.receiveShadows;
    this.mesh.castShadow = this.castShadow;
    this.scene.add(this.mesh);
  }
}
