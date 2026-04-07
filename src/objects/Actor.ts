import Experience from "../experience/Experience";
import * as THREE from "three"
import type Resources from "../utils/Resources";
import type { GLTF } from "three/examples/jsm/Addons.js";
import type Time from "../utils/Time";
import type Debug from "../utils/Debug";
import type GUI from "lil-gui";
import { Animation } from "./Animation";

/**
 * Base class for animated 3D objects. Auto creates a debug folder to play animations.
 */
export default class Actor
{
    declare experience: Experience
    declare scene: THREE.Scene
    declare resources: Resources
    declare resource: GLTF
    declare model: THREE.Object3D
    declare animation: Animation
    declare time: Time
    declare debug: Debug
    declare debugFolder: GUI
    declare name: string

    constructor(name: string, resource: GLTF) 
    {
        if (!Experience.instance) throw new Error("can't instantiate actor, Experience.instance is not valid");

        this.experience = Experience.instance
        this.debug = this.experience.debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder(name)
            this.debugFolder.close()
        }

        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        // Setup
        this.resource = resource

        this.setModel()
        this.setAnimation()
        this.setDebugObject()
    }

    setModel() {
        this.model = this.resource.scene
        this.scene.add(this.model)

        this.model.traverse((child: any) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
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