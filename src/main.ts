import "./reset.css";
import "./style.css";
import Experience from "./experience/Experience";
import templateSources from "./template/templateSources";
import OrbitCamera from "./template/OrbitCamera";
import TemplateWorld from "./template/TemplateWorld";

const canvas: HTMLCanvasElement = document.getElementById(
  "three",
) as HTMLCanvasElement;
if (!canvas) {
  throw new Error(
    "Canvas not found: no element with id 'three' exists in the DOM.",
  );
}

canvas.style.width = "100%";
canvas.style.height = "100%";
const camera = new OrbitCamera();
const world = new TemplateWorld();
const experience = new Experience(canvas, templateSources, camera, world);
await experience.init();
