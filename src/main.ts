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
}  

init()