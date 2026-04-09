import type { Source } from "../types/types";

const templateSources: Source[] = [
  {
    name: "environmentMapTexture",
    type: "cubeTexture",
    path: [
      "textures/environmentMap/px.jpg",
      "textures/environmentMap/nx.jpg",
      "textures/environmentMap/py.jpg",
      "textures/environmentMap/ny.jpg",
      "textures/environmentMap/pz.jpg",
      "textures/environmentMap/nz.jpg",
    ],
  },
  {
    name: "environmentMapTexture1",
    type: "cubeTexture",
    path: [
      "textures/environmentMap/1/px.png",
      "textures/environmentMap/1/nx.png",
      "textures/environmentMap/1/py.png",
      "textures/environmentMap/1/ny.png",
      "textures/environmentMap/1/pz.png",
      "textures/environmentMap/1/nz.png",
    ],
  },
  {
    name: "grassColorTexture",
    type: "texture",
    path: "textures/dirt/color.jpg",
  },
  {
    name: "grassNormalTexture",
    type: "texture",
    path: "textures/dirt/normal.jpg",
  },
  {
    name: "foxModel",
    type: "gltfModel",
    path: "models/Fox/glTF/Fox.gltf",
  },
];

export default templateSources;