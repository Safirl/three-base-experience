/**
 * Checkout https://luser.github.io/gamepadtest/ to find informations about your controller
 * @param id The id of your controller. Used to find a matching controller profile when a new controller is connected.
 */
export interface InputProfile {
    id: string
    buttons: InputAction[]
    axes?: InputAxis[]
}

/**
 * Used by InputProfiles to provide events to inputs. 
 * When a gamepad triggers and event, 
 * the inputSystem finds the corresponding index and triggers the user event.
 * @param physicalInput The corresponding input on your controller. Usefull to display UI informations.
 * @param index The index on the controller.
 */
export interface InputAction {
    physicalInput: string
    index: number | string
    event: string
} 

/**
 * Used by InputProfiles to provide events to inputs. 
 * @param deadzone The event won't be called if the axis value is inferior to the deadzone value.
 * @param sign Possible values: -1 or 1. The sign of the axis. If it doesn't matches the sign of the value of the axis, the event won't be called. 
 */
export interface InputAxis extends InputAction {
    sign: number
    deadzone: number
}
export interface InputEventArgs {
    type: string
    controller: Gamepad | string
}

// /**
//  * The value range is from 0 to 1.
//  * Some controllers are using button values for triggers (RT and LT) so their value can range between 0 and 1.
//  */
// export interface ButtonAction extends InputAction {
//     value: number
//     pressed: boolean
//     touched: boolean
// }

// /**
//  * Axis interface. For triggers (RT and LT), the range is from -1 and 0. 
//  * However, if the Trigger is completly pressed, the value is 1.
//  */
// export interface AxisAction extends InputAction {
//     value: number
// }