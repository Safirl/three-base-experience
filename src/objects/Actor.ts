import Experience from "../experience/Experience";
import * as THREE from "three"
import type Resources from "../utils/Resources";
import { SkeletonUtils, type GLTF } from "three/examples/jsm/Addons.js";
import type Time from "../utils/Time";
import type Debug from "../utils/Debug";
import type GUI from "lil-gui";
import { Animation } from "./Animation";
import type { LifeTimeObject } from "../types/types";

/**
 * Base class for animated 3D objects. Auto creates a debug folder to play animations.
 */
export default class Actor implements LifeTimeObject
{
    declare experience: Experience
    declare scene: THREE.Scene
    declare resources: Resources
    declare resource: GLTF
    declare collisionResource: GLTF
    declare model: THREE.Object3D
    declare colliderModel: THREE.Object3D
    declare animation: Animation
    declare time: Time
    declare debug: Debug
    declare debugFolder: GUI
    declare name: string
    private Id: string = crypto.randomUUID()

    constructor(name: string, resource: GLTF, makeUnique: boolean = false, makeMaterialsUnique: boolean = false, collisionResource?: GLTF) 
    {
        if (!Experience.instance) throw new Error("Actor initialization failed: Experience.instance is not available. Ensure Experience is initialized before creating Actor.");        

        this.experience = Experience.instance
        this.debug = this.experience.debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(name)
            this.debugFolder.close()
        }
        this.name = name;
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        // Setup
        this.resource = resource
        
        this.setModel(makeUnique, makeMaterialsUnique)
        if (collisionResource) {
            this.collisionResource = collisionResource
            this.setColliderModel(makeUnique)
        }
        this.setAnimation()
        this.setDebugObject()
    }

    getId(): string {
        return this.Id
    }

    init = () => {};
    destroy = () => {
        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry.dispose();
                for (const key in child.material) {
                    const value = child.material[key];
                    if (value && typeof value.dispose === "function") {
                        value.dispose();
                    }
                }
            }
        })
    };

    setModel(makeUnique: boolean, makeMaterialsUnique: boolean) {
        if (makeUnique)
            this.model = SkeletonUtils.clone(this.resource.scene);
        else
            this.model = this.resource.scene

        this.scene.add(this.model)

        this.model.traverse((child: any) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
            if (makeMaterialsUnique && child instanceof THREE.Material)
            {
                child = child.clone()
            }
        })
    }

    setRotation(x: number, y: number, z: number) {
        this.model.rotation.set(x,y,z)
        if (this.colliderModel) {
            this.colliderModel.rotation.set(x,y,z)

            if (!this.experience.collisionManager) throw new Error(`Can't rebuild collisions after rotating: ${this.name}. Collision manager is not valid`)
            this.experience.collisionManager?.rebuildCollisions()
        }
    }

    setPosition(x: number, y: number, z: number) {
        this.model.position.set(x,y,z)
        if (this.colliderModel) {
            this.colliderModel.position.set(x,y,z)
            
            if (!this.experience.collisionManager) throw new Error(`Can't rebuild collisions after rotating: ${this.name}. Collision manager is not valid`)
            this.experience.collisionManager?.rebuildCollisions()
        }
    }

    setScale(x: number, y: number, z: number) {
        this.model.scale.set(x,y,z)
        if (this.colliderModel) {
            this.colliderModel.scale.set(x,y,z)

            if (!this.experience.collisionManager) throw new Error(`Can't rebuild collisions after rotating: ${this.name}. Collision manager is not valid`)

            this.experience.collisionManager?.rebuildCollisions()
        }
    }

    setColliderModel(makeUnique: boolean) {
        if (makeUnique)
            this.colliderModel = SkeletonUtils.clone(this.collisionResource.scene);
        else
            this.colliderModel = this.collisionResource.scene
    }

    setAnimation() {
        this.animation = new Animation()
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        this.animation.actions = []
        this.resource.animations.forEach((animation) => {
            this.animation.actions.push({name: animation.name, action: this.animation.mixer.clipAction(animation)})
        })
        this.animation.currentAction = this.animation.actions[0]
        this.animation.currentAction?.action.play()
    }

    setDebugObject() {
        if (!this.debug.active) return;

        const debugObject: { [key: string]: () => void } = {}
        this.animation.actions.forEach((action) => {
            const actionName = action.name
            debugObject[actionName] = () =>
            {
                this.animation.play(actionName)
            }
            this.debugFolder
                .add(debugObject, actionName)
                .name(`Play ${actionName}`)
        })
    }

    update() {
        this.animation.mixer.update(this.time.delta * .001)
    }
}
