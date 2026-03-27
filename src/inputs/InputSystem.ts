import Experience from "../experience/Experience";
import type { LifeTimeObject } from "../types/types";
import { EventEmitter } from "../utils/EventEmitter";
import type { InputProfile } from "./inputInterfaces";

export default class InputSystem extends EventEmitter implements LifeTimeObject {
    private profiles: InputProfile[]
    declare gamepads: Gamepad[]
    private previousState = new Map<number, boolean[]>();
    declare experience: Experience
    private debug

    constructor() {
        super()
        this.gamepads = [];
        this.profiles = [];

        if (!Experience.instance) return;

        this.experience = Experience.instance;
        this.debug = this.experience.debug

        window.addEventListener("gamepadconnected", this.onGamepadConnected);
        window.addEventListener("gamepaddisconnected", this.onGamepadDisconnected);

        document.addEventListener( 'keydown', this.onKeyDown );
        document.addEventListener( 'keyup', this.onKeyUp );
    }

    init = () => {}
    destroy = () => {
        window.removeEventListener("gamepadconnected", this.onGamepadConnected)
        window.removeEventListener("gamepaddisconnected", this.onGamepadDisconnected);

        document.removeEventListener( 'keydown', this.onKeyDown );
        document.removeEventListener( 'keyup', this.onKeyUp );
    }

    addInputProfiles(inputProfiles: InputProfile[]) {
        this.profiles = this.profiles.concat(inputProfiles)
    }

    removeInputProfiles(inputProfiles: InputProfile[]) {
        this.profiles = this.profiles.concat(inputProfiles)
    }

    onGamepadConnected = (e: GamepadEvent) => {
        const gp = e.gamepad
        if (this.debug?.active) {
            console.log(
                "Gamepad connected at index %d: %s. %d buttons, %d axes.",
                e.gamepad.index,
                e.gamepad.id,
                e.gamepad.buttons.length,
                e.gamepad.axes.length,
            );
        }
        this.previousState.set(
            gp.index,
            gp.buttons.map(b => b.pressed)
        );
        this.gamepads.push(gp)
    }

    onGamepadDisconnected = (e: GamepadEvent) => {
        if (this.debug?.active) {
            console.log(
                "Gamepad disconnected at index %d: %s.",
                e.gamepad.index,
                e.gamepad.id,
            );
        }

        const index = this.gamepads.findIndex((gamepad) => gamepad.id === e.gamepad.id);
        if (index > -1) { 
            this.gamepads.splice(index, 1); 
        }
        this.previousState.delete(index)
    }

    onKeyUp = (event: KeyboardEvent) => {
        const profile = this.profiles.find((p) => p.id === "keyboard")
        if (!profile) return;

        const mapping = profile.buttons.find(b => event.code === b.index)
        if (!mapping) return;

        this.trigger(mapping.event, [{type: "released", controller: "keyboard"}])
    }

    onKeyDown = (event: KeyboardEvent) => {
        const profile = this.profiles.find((p) => p.id === "keyboard")
        if (!profile) return;

        const mapping = profile.buttons.find(b => event.code === b.index)
        if (!mapping) return;

        this.trigger(mapping.event, [{type: "pressed", controller: "keyboard"}])
    }

    update() {
        this.gamepads.forEach((gamepad) => {
            const profile = this.profiles.find((p) => p.id === gamepad.id)
            if (!profile) return;
            
            const prevButtons = this.previousState.get(gamepad.index)
            if (!prevButtons) return;

            gamepad.buttons.forEach((button, index) => {
                const mapping = profile.buttons.find(b => index === b.index)
                if (!mapping) return;
                
                const wasPressed = prevButtons[index]
                const isPressed = button.pressed

                if (!wasPressed && isPressed) {
                    this.trigger(mapping.event, [{type: "pressed", controller: gamepad }])
                }

                if (wasPressed && !isPressed) {
                    this.trigger(mapping.event, [{type: "released", controller: gamepad }])
                }

                prevButtons[index] = isPressed ? true : false
            })

            gamepad.axes.forEach((axis, index) => {
                if (!profile.axes) return;

                const mapping = profile.axes.find(a => index === a.index)
                if (!mapping) return;
                
                this.trigger(mapping.event, [axis])
            })
        })
        this.gamepads = navigator.getGamepads().filter(Boolean) as Gamepad[];
    }
}