<template>
  <div id="scene-container" ref="sceneContainer" />
</template>

<script>
import * as Three from 'three';
import * as dat from 'dat.gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { sRGBEncoding, LinearEncoding } from 'three';

export default {
  name: 'Demo',
  data() {
    return {
      container: null,
      scene: null,
      camera: null,
      controls: null,
      renderer: null,
      lights: [],
      content: null,
      gui: null,

      state: {
        // lights
        addLights: true,
        exposure: 1.0,
        textureEncoding: 'sRGB',
        ambientIntensity: 0.3,
        ambientColor: 0xffffff,
        directIntensity: 0.8 * Math.PI,
        directColor: 0xffffff,
        bgColor: '#ffffff',
        bgColor1: '#353535'
      }
    };
  },
  watch: {
    state: {
      handler(value) {
        if (value === null) {
          return;
        }
        this.updateTextureEncoding();
        this.updateLights();
      },
      deep: true
    },
    renderer: {
      handler() {
        if (this.renderer === null || this.content === null) {
          return;
        }
        this.renderer.outputEncoding = Number(this.renderer.outputEncoding);
        this.traverseMaterials(this.content, material => {
          material.needsUpdate = true;
        });
      },
      deep: true
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // set container
      this.container = this.$refs.sceneContainer;

      // create camera
      const fov = 60;
      const aspect = this.container.clientWidth / this.container.clientHeight;
      const near = 0.1;
      const far = 1000;
      const camera = new Three.PerspectiveCamera(fov, aspect, near, far);
      camera.position.set(0, 5, 10);
      this.camera = camera;

      // create scene
      this.scene = new Three.Scene();
      this.scene.background = new Three.Color('rgb(59, 59, 59)');

      // create renderer
      this.renderer = new Three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.gammaFactor = 2.2;
      this.renderer.physicallyCorrectLights = true;
      this.container.appendChild(this.renderer.domElement);

      // add lights
      this.addLights();

      // add controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      // set aspect ratio to match the new browser window aspect ratio
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateMatrixWorld(true);
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

      // init material
      const init_MTL = new Three.MeshPhongMaterial({ color: 0xff0000, shininese: 10 });
      console.log(init_MTL);
      // load model
      const loader = new GLTFLoader();

      loader.load(
        '/materialball/static/YL-O009_M0545.glb',
        gltf => {
          const object = gltf.scene;

          object.traverse(o => {
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
            }
          });
          console.log(object);
          // object.material.color.set(0xffffff * Math.random());

          const center = new Three.Vector3();
          object.scale.set(0.2, 0.2, 0.2);
          object.rotation.y = Math.PI;

          // Add the model to the scene;
          object.position.y = -1;
          object.rotation.y = 0;

          // set init texture
          // object.traverse(o => {
          //   console.log(o.isMesh);
          //   if (o.isMesh) {
          //     o.material = init_MTL;
          //   }
          // });

          const group = new Three.Group();
          group.add(object);

          const box = new Three.Box3();
          box.setFromObject(group);
          box.getCenter(center);

          group.position.sub(center);

          const wrapper = new Three.Object3D();
          wrapper.add(group);

          this.scene.add(wrapper);
          this.content = object;

          // init GUI
          this.initGUI();
          const guiWrapper = document.createElement('div');
          this.container.appendChild(guiWrapper);
          guiWrapper.classList.add('gui-wrapper');
          guiWrapper.appendChild(this.gui.domElement);

          this.updateLights();
          this.updateTextureEncoding();
        },
        xhr => {
          console.log((xhr.loaded / xhr.total) * 100 + '%loaded');
        },
        error => {
          console.error(error, 'load error!');
        }
      );

      this.renderer.setAnimationLoop(() => {
        this.render();
      });
    },
    render() {
      this.renderer.render(this.scene, this.camera);
      if (this.resizeRender(this.renderer)) {
        const canvas = this.renderer.domElement;
        this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        this.camera.updateProjectionMatrix();
      }
    },
    initGUI() {
      const gui = (this.gui = new dat.GUI({ autoPlace: false, width: 260, hideable: true }));

      const lightFolder = gui.addFolder('Lights');
      lightFolder.add(this.state, 'textureEncoding', ['sRGB', 'Linear']);
      lightFolder.add(this.renderer, 'outputEncoding', {
        sRGB: sRGBEncoding,
        Linear: LinearEncoding
      });
      lightFolder.add(this.state, 'exposure', 0, 100);
      // lightFolder.add(this.state, "addLights").listen();
      lightFolder.add(this.state, 'ambientIntensity', 0, 2);
      lightFolder.addColor(this.state, 'ambientColor');
      lightFolder.add(this.state, 'directIntensity', 0, 4);
      lightFolder.addColor(this.state, 'directColor');
      // this.container.appendChild(gui);
    },
    updateLights() {
      this.renderer.toneMappingExposure = this.state.exposure;

      this.lights[0].intensity = this.state.ambientIntensity;
      this.lights[0].color.setHex(this.state.ambientColor);
      this.lights[1].intensity = this.state.directIntensity;
      this.lights[1].color.setHex(this.state.directColor);
      this.lights[2].intensity = this.state.directIntensity;
      this.lights[2].color.setHex(this.state.directColor);
    },
    addLights() {
      const light1 = new Three.AmbientLight(this.state.ambientColor, this.state.ambientIntensity);
      light1.name = 'ambient_light';
      this.scene.add(light1);

      const light2 = new Three.DirectionalLight(this.state.directColor, this.state.directIntensity);
      light2.position.set(0.5, 0, 0.866); // ~60º
      light2.name = 'main_light';
      this.scene.add(light2);

      const light3 = new Three.DirectionalLight(this.state.directColor, this.state.directIntensity);
      light3.position.set(0.5, 0, -0.866);
      light3.name = 'main_light_2';
      this.scene.add(light3);

      this.lights.push(light1, light2, light3);
    },
    updateTextureEncoding() {
      const encoding = this.state.textureEncoding === 'sRGB' ? sRGBEncoding : LinearEncoding;
      this.traverseMaterials(this.content, material => {
        console.log(material);
        if (material.map) {
          material.map.encoding = encoding;
        }
        if (material.emissiveMap) {
          material.emissiveMap.encoding = encoding;
        }
        if (material.map || material.emissiveMap) {
          material.needsUpdate = true;
        }
      });
    },
    traverseMaterials(object, callback) {
      object.traverse(o => {
        if (!o.isMesh) return;
        const material = Array.isArray(o.material) ? o.material : [o.material];
        material.forEach(callback);
      });
    },
    resizeRender(renderer) {
      // maybe change method only when resize window
      const canvas = renderer.domElement;
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      const canvasPixelWidth = canvas.width / window.devicePixelRatio;
      const canvasPixelHeight = canvas.height / window.devicePixelRatio;

      const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
      if (needResize) {
        this.renderer.setSize(width, height);
      }

      return needResize;
    }
  }
};
</script>

<style lang="scss" scoped>
#scene-container {
  width: 100%;
  height: 100%;
  background: #ffffff;
}

::v-deep .gui-wrapper {
  .c {
    > input[type="text"] {
      height: 100%;
    }
  }
}
</style>
