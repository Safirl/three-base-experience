# Threejs base experience
Threejs base classes to easily instantiate a new three experience.

## How to install
You can install this repository from npm directly in your project node_modules subdirectory by running `npm i https://github.com/Safirl/three-base-experience.git`.

## Example
Here is a code snippet to instantiate an Orbit control camera in a scene. **Don't forge to add a canvas to your experience and a proper reset.css**

```
import {Experience, OrbitCamera, TemplateWorld} from "base-experience"
//Example sources, replace it with your own. Check the example file at
//https://github.com/Safirl/three-base-experience/blob/main/src/template/sources.ts
import { sources } from 'base-experience'

const init = () => {
  const canvas: HTMLCanvasElement = document.getElementById("three") as HTMLCanvasElement
  if (!canvas) {
    console.error('no canvas found with three identifier')
    return;
  }
  
  canvas.style.width = "100%"
  canvas.style.height = "100%"
  const world = new TemplateWorld()
  const camera = new OrbitCamera()
  const experience = new Experience(canvas, sources, camera, world)
}
```

## How to use
Create a class that extends the base class that you want to override. 
