import * as THREE from "three"

export interface Action {
    name: string
    action: THREE.AnimationAction
}

export class Animation {
    declare mixer: THREE.AnimationMixer
    declare actions: Action[]
    declare currentAction: Action | undefined
    
    play(name: string) {
        const newAction = this.actions.find(action => action.name === name)?.action
        const oldAction = this.currentAction?.action
        if (!newAction) throw new Error(`Invalid action: no action found for name "${name}".`);
            
        newAction.reset()
        newAction.play()
        
        //Only crossFade if we are already playing an animation
        if (oldAction)
            newAction.crossFadeFrom(oldAction, 1)
        this.currentAction = {name: name, action: newAction}
    }
}
