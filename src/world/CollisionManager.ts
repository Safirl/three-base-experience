import type { LifeTimeObject } from "../types/types";
import { Octree } from "three/examples/jsm/Addons.js";
import Experience from "../experience/Experience";
import type Resources from "../utils/Resources";
import type Actor from "../objects/Actor";

export default class CollisionManager implements LifeTimeObject {
    declare worldOctree: Octree;
    declare currentCollisionObjects: Actor[]
    declare experience: Experience
    declare resources: Resources
    constructor() {
        if (!Experience.instance) throw new Error("Environment initialization failed: Experience.instance is not available. Make sure Experience is initialized before creating the Environment.");
        this.experience = Experience.instance
        this.resources = this.experience.resources
        this.worldOctree = new Octree();
    }

    init = () => {};
    update = () => {};
    destroy = () => {};

    addCollisionObject(objects: Actor[]) {
        const addedObjects: Actor[] = []
        objects.forEach(object => {
            if (!object.collisionResource) {
                console.warn("Invalid object collision found for: ", object)
                return;
            }
            addedObjects.push(object)
            this.worldOctree.fromGraphNode(object.collisionResource.scene)
        });
        this.currentCollisionObjects = this.currentCollisionObjects.concat(addedObjects)
    }

    removeCollisionObject(objects: Actor[]) {
        objects.forEach((object => {
            if (!object.collisionResource) {
                console.warn("Invalid object collision found for: ", object)
                return;
            }
            const index = this.currentCollisionObjects.findIndex((o) => o.getId() === object.getId());
            if (index > -1) { 
                this.currentCollisionObjects.splice(index, 1); 
            }
        }))
        this.worldOctree.clear()
        this.currentCollisionObjects.forEach((object) => {
            this.worldOctree.fromGraphNode(object.collisionResource.scene)
        })
    }
}