import type { InputProfile } from "../inputs/inputInterfaces"

export const BitControllerProfile: InputProfile = {
    id: "8BitDo Ultimate 2C Wireless (Vendor: 2dc8 Product: 301b)",
    buttons: [
        {
            physicalInput: "A",
            index: 0,
            event: "jump"
        },
        {
            physicalInput: "X",
            index: 3,
            event: "interact"
        },
        {
            physicalInput: "B",
            index: 1,
            event: "cancel"
        },
        {
            physicalInput: "Y",
            index: 4,
            event: "inventory"
        }
    ],
    axes: [
        // {
        //     physicalInput: "leftStickX+",
        //     index: -1,
        //     event: "moveRight"
        // },
        // {
        //     physicalInput: "leftStickX-",
        //     index: -1,
        //     event: "moveLeft"
        // },
        // {
        //     physicalInput: "leftStickY+",
        //     index: -1,
        //     event: "moveForward"
        // },
        // {
        //     physicalInput: "leftStickY-",
        //     index: -1,
        //     event: "moveBackward"
        // },
        // {
        //     physicalInput: "rightStickX+",
        //     index: -1,
        //     event: "lookRight"
        // },
        // {
        //     physicalInput: "rightStickX-",
        //     index: -1,
        //     event: "lookLeft"
        // },
        // {
        //     physicalInput: "rightStickY+",
        //     index: -1,
        //     event: "lookUp"
        // },
        // {
        //     physicalInput: "rightStickY-",
        //     index: -1,
        //     event: "lookDown"
        // }
    ]
}

export const keyboardProfile = {
    id: "keyboard",
    buttons: [
        {
            physicalInput: "Spacebar",
            index: "Space",
            event: "jump"
        }
    ],
}