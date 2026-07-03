import * as THREE from "three";
import Experience from "../experience/Experience";
import type Debug from "../utils/Debug";
import type GUI from "lil-gui";
import EnvironmentMap from "./EnvironmentMap";
import type { LifeTimeObject } from "../types/types";

export default class Environment implements LifeTimeObject {
	declare shadowHelper: THREE.CameraHelper;
	declare experience: Experience;
	declare scene: Experience["scene"];
	declare sunLight: THREE.DirectionalLight;
	declare resources: Experience["resources"];
	declare environmentMap: EnvironmentMap;
	declare debug: Debug;
	declare debugFolder: GUI;
	declare protected sunlightDebugFolder: GUI;

	constructor(
		lightingEnvironmentMap?: THREE.CubeTexture,
		useAsBackground: boolean = false,
		backgroundEnvironmentMap?: THREE.CubeTexture
	) {
		if (!Experience.instance)
			throw new Error(
				"Environment initialization failed: Experience.instance is not available. Make sure Experience is initialized before creating the Environment."
			);

		this.experience = Experience.instance;
		this.scene = this.experience.scene;
		this.resources = this.experience.resources;

		this.debug = this.experience.debug;

		if (this.debug.active) {
			this.debugFolder = this.debug.ui.addFolder("environment");
		}

		this.setSunlight();
		if (lightingEnvironmentMap)
			this.setEnvironmentMap(
				lightingEnvironmentMap,
				useAsBackground,
				backgroundEnvironmentMap
			);

		this.setDebugObject();
	}

	init = () => {};
	destroy = () => {};

	update() {
		this.shadowHelper.update();
	}

	setSunlight() {
		this.sunLight = new THREE.DirectionalLight("#ffffff", 3);
		this.sunLight.castShadow = true;
		this.sunLight.shadow.camera.far = 25;
		this.sunLight.shadow.mapSize.set(1024, 1024);
		this.sunLight.shadow.normalBias = 0.05;
		this.sunLight.position.set(3, 3, 2);
		this.scene.add(this.sunLight);
	}

	setEnvironmentMap(
		lightingEnvironmentMap: THREE.CubeTexture,
		useAsBackground: boolean = false,
		backgroundEnvironmentMap?: THREE.CubeTexture
	) {
		this.environmentMap = new EnvironmentMap(
			0.5,
			lightingEnvironmentMap,
			this.scene,
			useAsBackground
		);
		if (useAsBackground && backgroundEnvironmentMap) {
			this.environmentMap.setBackgroundEnvironment(backgroundEnvironmentMap);
		}
		this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;

		//materials are not all created so this needs to be updated manually
		setTimeout(() => {
			this.environmentMap.updateMaterials();
		}, 200);
	}

	setEnvironmentMapIntensity(intensity: number) {
		this.environmentMap.intensity = intensity;
		this.environmentMap.updateMaterials();
	}

	setDebugObject() {
		if (this.debug.active) {
			this.debugFolder
				.add(this.environmentMap, "intensity")
				.name("envMapIntensity")
				.min(0)
				.max(4)
				.step(0.001)
				.onChange(this.environmentMap.updateMaterials);

			this.sunlightDebugFolder = this.debugFolder.addFolder("☀️ sunlight");
			this.shadowHelper = new THREE.CameraHelper(this.sunLight.shadow.camera);
			this.shadowHelper.layers.set(2);
			this.scene.add(this.shadowHelper);
		}
	}
}
