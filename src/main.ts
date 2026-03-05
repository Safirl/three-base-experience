import './reset.css'
import './style.css'
import Experience from './experience/Experience'
import sources from './template/sources'

const init = () => {
  const canvas: HTMLCanvasElement = document.getElementById("three") as HTMLCanvasElement
  if (!canvas) {
    console.error('no canvas found with three identifier')
    return;
  }
  
  canvas.style.width = "100%"
  canvas.style.height = "100%"
  
  const experience = new Experience(canvas, sources)
}  

init()