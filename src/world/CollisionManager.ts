import type { LifeTimeObject } from "../types/types";
import { Octree } from "three/examples/jsm/Addons.js";
import Experience from "../experience/Experience";
import Actor from "../objects/Actor";
import StaticObject from "../objects/StaticObject";

export default class CollisionManager implements LifeTimeObject {
    declare worldOctree: Octree;
    declare currentCollisionObjects: (StaticObject | Actor)[]
    declare experience: Experience
    constructor() {
        if (!Experience.instance) throw new Error("Environment initialization failed: Experience.instance is not available. Make sure Experience is initialized before creating the Environment.");
        this.experience = Experience.instance
        this.worldOctree = new Octree();
        this.currentCollisionObjects = []
    }

    init = () => {};
    update = () => {};
    destroy = () => {};

    addCollisionObject(objects: (StaticObject | Actor)[]) {
        const addedObjects: (StaticObject | Actor)[] = []
        objects.forEach(object => {
            if (object instanceof StaticObject) {
                this.worldOctree.fromGraphNode(object.mesh)
            }
            else {
                if (!object.collisionResource) {
                    console.warn("Invalid object collision found for: ", object)
                    return;
                }
                this.worldOctree.fromGraphNode(object.colliderModel)
            }
            addedObjects.push(object)
        });
        this.currentCollisionObjects = this.currentCollisionObjects.concat(addedObjects)
    }

    removeCollisionObject(objects: (StaticObject | Actor)[]) {
        objects.forEach((object => {
            if (object instanceof Actor) {
                if (!object.collisionResource) {
                    console.warn("Invalid object collision found for: ", object)
                    return;
                }
            }
            const index = this.currentCollisionObjects.findIndex((o) => o.getId() === object.getId());
            if (index > -1) { 
                this.currentCollisionObjects.splice(index, 1); 
            }
        }))
        this.worldOctree.clear()
        this.currentCollisionObjects.forEach((object) => {
            if (object instanceof Actor) {
                this.worldOctree.fromGraphNode(object.colliderModel)
            }
            else {
                this.worldOctree.fromGraphNode(object.mesh)
            }
        })
    }
}