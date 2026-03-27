export interface InputProfile {
    id: string
    buttons: InputAction[]
    axes?: InputAction[]
}

/**
 * Used by InputProfiles to provide events to inputs. 
 * When a gamepad triggers and event, 
 * the inputSystem finds the corresponding index and triggers the user event. 
 */
export interface InputAction {
    physicalInput: string
    index: number | string
    event: string
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