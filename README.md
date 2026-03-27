# three-base-experience
Base classes for quickly bootstrapping a Three.js experience.

## Installation

```bash
npm i https://github.com/Safirl/three-base-experience.git
```

Make sure your project also has the required peer dependencies:

```bash
npm i three lil-gui
```

> **Note:** Add a `<canvas id="three">` to your HTML and a `reset.css` that sets `html, body { margin: 0; width: 100%; height: 100%; }` to avoid unwanted scrollbars.

## Quick start

The snippet below spins up a scene with an orbit-control camera using the built-in template classes.

```ts
import { Experience, OrbitCamera, TemplateWorld, templateSources } from 'base-experience'

const canvas = document.getElementById('three') as HTMLCanvasElement
canvas.style.width = '100%'
canvas.style.height = '100%'

const world = new TemplateWorld()
const camera = new OrbitCamera()
const experience = new Experience(canvas, templateSources, camera, world)
```

## Creating a sources file

Sources tell the `Resources` loader which assets to fetch before the world initialises. Each entry maps a name (used later as `resources.items.<name>`) to a loader type and a path.

Supported types: `"texture"`, `"cubeTexture"`, `"gltfModel"`.

```ts
// src/sources.ts
import type { Source } from 'base-experience'

const sources: Source[] = [
  {
    name: 'environmentMapTexture',  // accessed as resources.items.environmentMapTexture
    type: 'cubeTexture',
    path: [
      'textures/env/px.jpg',
      'textures/env/nx.jpg',
      'textures/env/py.jpg',
      'textures/env/ny.jpg',
      'textures/env/pz.jpg',
      'textures/env/nz.jpg',
    ],
  },
  {
    name: 'floorColor',
    type: 'texture',
    path: 'textures/floor/color.jpg',
  },
  {
    name: 'characterModel',
    type: 'gltfModel',
    path: 'models/character/character.gltf',
  },
]

export default sources
```

Then pass the array when creating the experience:

```ts
import { Experience, OrbitCamera, TemplateWorld } from 'base-experience'
import sources from './sources'

const experience = new Experience(canvas, sources, new OrbitCamera(), new TemplateWorld())
```

Inside a `World` subclass you can access loaded assets after the `ready` event fires:

```ts
import { World, Actor } from 'base-experience'
import type { GLTF } from 'three/examples/jsm/Addons.js'

export default class MyWorld extends World {
  onResourcesLoaded() {
    const character = new Actor('Character', this.resources.items.characterModel as GLTF)
  }
}
```

## Input profiles

An `InputProfile` maps physical inputs to named game events. Pass one or more profiles to `experience.inputSystem.addInputProfiles()`, then listen for events with `.on()`.

### Keyboard

The profile `id` **must** be `"keyboard"`. Button `index` values are [`KeyboardEvent.code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) strings.

```ts
import type { InputProfile } from 'base-experience'

const keyboardProfile: InputProfile = {
  id: 'keyboard',
  buttons: [
    { physicalInput: 'Space',   index: 'Space',   event: 'jump'     },
    { physicalInput: 'KeyE',    index: 'KeyE',    event: 'interact' },
    { physicalInput: 'Escape',  index: 'Escape',  event: 'pause'    },
  ],
}
```

### Gamepad

The profile `id` must match the `id` string reported by the browser's [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad/id) for your controller. Button `index` values are the numeric indices in `gamepad.buttons[]`. Axis `index` values are the numeric indices in `gamepad.axes[]`.

```ts
import type { InputProfile } from 'base-experience'

const gamepadProfile: InputProfile = {
  id: 'Xbox 360 Controller (XInput STANDARD GAMEPAD)',
  buttons: [
    { physicalInput: 'A', index: 0, event: 'jump'     },
    { physicalInput: 'X', index: 2, event: 'interact' },
    { physicalInput: 'B', index: 1, event: 'cancel'   },
  ],
  axes: [
    { physicalInput: 'leftStickX+', index: 0, event: 'moveRight'   },
    { physicalInput: 'leftStickX-', index: 0, event: 'moveLeft'    },
    { physicalInput: 'leftStickY+', index: 1, event: 'moveForward' },
    { physicalInput: 'leftStickY-', index: 1, event: 'moveBackward'},
  ],
}
```

### Registering profiles and listening to events

```ts
import type { InputEventArgs } from 'base-experience'

experience.inputSystem.addInputProfiles([keyboardProfile, gamepadProfile])

experience.inputSystem.on('jump', (args: InputEventArgs) => {
  console.log(`jump triggered by ${args.controller}, type: ${args.type}`)
  // args.type is "pressed" or "released"
  // args.controller is "keyboard" or a Gamepad object
})
```

## Extending base classes

Every major class (`Camera`, `World`, `Actor`) is designed to be subclassed. Override only what you need — the base implementations handle the Three.js boilerplate.

| Base class | What to override |
|---|---|
| `Camera` | `setInstance()`, `setControls()`, `update()` |
| `World` | `onResourcesLoaded()`, `update()` |
| `Actor` | `update()` |

See the `src/template/` directory for complete working examples of each.
