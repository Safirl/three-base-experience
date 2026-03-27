import './reset.css'
import './style.css'
import Experience from './experience/Experience'
import sources from './template/sources'
import OrbitCamera from './template/OrbitCamera'
import TemplateWorld from './template/TemplateWorld'

const init = () => {
  const canvas: HTMLCanvasElement = document.getElementById("three") as HTMLCanvasElement
  if (!canvas) {
    console.error('no canvas found with three identifier')
    return;
  }
  
  canvas.style.width = "100%"
  canvas.style.height = "100%"
  const camera = new OrbitCamera()
  const world = new TemplateWorld()
  const experience = new Experience(canvas, sources, camera, world)
  // const profiles: InputProfile[] = [keyboardProfile, BitControllerProfile]

  // experience.inputSystem.addInputProfiles(profiles)
  // experience.inputSystem.on("jump", (args: InputEventArgs) => {
  //   const gamepad = args.controller as Gamepad
  //   console.log("controller: ", gamepad.id, " triggered: ", args.type)
  // })
}  

init()