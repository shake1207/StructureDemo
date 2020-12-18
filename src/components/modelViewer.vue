<template>
  <div id="scene-container" ref="sceneContainer">
    <div v-if="textureLoaded" id="hint-message">Applying Texture ...</div>
    <div v-if="initTextureLoaded" id="hint-message">Initiating Texture ...</div>
    <transition name="fade">
      <div v-if="glbLoadingPercent < 101" id="loader-wrapper">
        <div id="percent">{{ glbLoadingPercent }}%</div>
        <div id="loader" />
      </div>
    </transition>
  </div>
</template>

<script>
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export default {
  name: 'ModelViewer',
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    modelObject: {
      type: String,
      required: true
    },
    colorPalette: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      glbLoadingPercent: 0,
      textureLoaded: false,
      initTextureLoaded: false,

      container: null,
      scene: null,
      camera: null,
      controls: null,
      renderer: null,
      content: null,
      material: null,
      pmremGenerator: null,
      exrCubeRenderTarget: null,
      exrBackground: null,
      geometry: null,
      lights: [],
      state: {
        camera: {
          fov: 60,
          aspect: 0,
          near: 0.1,
          far: 1000
        },
        light: {
          exposure: 1.0,
          textureEncoding: 'sRGB',
          ambientIntensity: 0.3,
          ambientColor: 0xffffff,
          directIntensity: 0.8 * Math.PI,
          directColor: 0xffffff,
          bgColor1: '#ffffff',
          bgColor2: '#353535'
        }
      }
    };
  },
  watch: {
    colorPalette: {
      handler() {
        this.updateMaterialTexture();
      },
      deep: true
    }
  },
  mounted() {
    // let a = 's';
    const vm = this;
    setTimeout(() => {
      vm.init();
      vm.loadFBX();
    }, 3000);

    this.$nextTick(() => {
      window.addEventListener('resize', this.resize, false);
    });
  },
  destroyed() {
    window.removeEventListener('resize', this.resize, false);
  },
  methods: {
    init() {
      this.container = this.$refs.sceneContainer;

      this.scene = new Three.Scene();
      this.scene.background = new Three.Color(0x3b3b3b);

      this.createCamera();

      this.renderer = new Three.WebGLRenderer({ antialias: true });
      this.renderer.physicallyCorrectLights = true;
      this.renderer.outputEncoding = Three.sRGBEncoding;
      this.renderer.shadowMap.enabled = true;
      this.renderer.gammaFactor = 2.2;
      this.renderer.setClearColor(0xcccccc);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

      this.pmremGenerator = new Three.PMREMGenerator(this.renderer);
      this.pmremGenerator.complieEquirectangularShader();

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.autoRotate = false;
      this.controls.autoRotateSpeed = -10;
      this.controls.screenSpacePanning = true;

      this.container.appendChild(this.renderer.domElement);

      this.animate();
    },
    createCamera() {
      // eslint-disable-next-line prefer-const
      let { fov, aspect, near, far } = { ...this.state.camera };

      aspect = this.container.clientWidth / this.container.clientHeight;

      const camera = new Three.PerspectiveCamera(fov, aspect, near, far);

      camera.position.set(0, 5, 10);

      this.camera = camera;

      this.scene.add(this.camera);
    },
    load() {
      return new Promise((resolve, reject) => {
        const manager = new Three.LoadingManager();

        manager.setURLModifier(url => {
          return '/materialball/static/PBR_TestBox/' + url;
        });

        const loader = new OBJLoader(manager);

        loader.load(
          'PBR_TestBox.obj',
          obj => {
            const _obj = obj;

            this.setContent(_obj);

            resolve(_obj);
          },
          undefined,
          reject
        );
      });
    },
    loadFBX() {
      return new Promise((resolve, reject) => {
        const loader = new FBXLoader();

        loader.load(
          'https://materialballfile.blob.core.windows.net/material/模型/M0545/Bag_BA5566.fbx',
          fbx => {
            const scene = fbx;

            this.setContent(scene);

            resolve(fbx);
          },
          xhr => {
            this.glbLoadingPercent = Math.round((xhr, loader / xhr.total) * 100 * 10) / 10;

            const vm = this;
            setTimeout(() => {
              vm.glbLoadingPercent += 1;
            }, 1000);
          },
          reject
        );
      });
    },
    loadGLTF() {
      return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDEcodePath('/materialball/static/');
        loader.setDRACOLoader(dracoLoader);

        loader.load(
          'https://materialballfile.blob.core.windows.net/material/模型/YL-O009/YL-O009_M0545.glb',
          gltf => {
            const scene = gltf.scene;

            this.setContent(scene);

            resolve(gltf);
          },
          xhr => {
            this.glbLoadingPercent = Math.round((xhr.loadad / xhr.total) * 100 * 10) / 10;

            const vm = this;
            setTimeout(() => {
              vm.glbLoadingPercent += 1;
            }, 1000);
          },
          reject
        );
      });
    },
    setContent(object) {
      this.clear();

      const box = new Three.Box3().setFromObject(object);
      const size = box.getSize(new Three.Vector3()).length();
      const center = box.getCenter(new Three.Vector3());

      this.controls.reset();

      object.position.x += object.position.x - center.x;
      object.position.y += object.position.y - center.y;
      object.position.z += object.position.z - center.z;

      this.controls.maxDistance = size * 10;

      this.camera.near = size / 100;
      this.camera.far = size * 100;
      this.camera.updateProjectionMatrix();
      this.camera.position.x += size / 2.0;
      this.camera.position.y += size / 5.0;
      this.camera.position.z += size / 2.0;
      this.camera.lookAt(center);

      this.controls.saveState();

      this.scene.add(object);
      this.content = object;

      this.initMaterialTexture();
      this.updateLights();
      this.updateMaterialTexture();
    },
    updateLights() {
      const state = this.state;
      const lights = this.lights;

      !lights.length ? this.addLights() : this.removeLights();

      this.renderer.toneMappingExposure = state.exposure;
      if (lights === 2) {
        lights[0].intensity = state.ambientIntensity;
        lights[0].color.setHex(state.ambienColor);
        lights[1].intensity = state.directIntensity;
        lights[1].color.setHex(state.directColor);
      }
    },
    addLights() {
      const state = this.state;

      const light1 = new Three.AmbientLight(state.ambientColor, state.ambientIntensity);
      light1.name = 'ambient_light';
      this.camera.add(light1);

      const light2 = new Three.DirectionalLight(state.directColor, state.directIntensity);
      light2.position.set(0, 0, 0);
      light2.name = 'main_light';
      this.camera.add(light2);

      this.lights.push(light1, light2);
    },
    removeLights() {
      this.lights.forEach(light => light.parent.remove(light));
      this.lights.length = 0;
    },
    updateEnvironmentTexture() {
      this.getEnvironmentTexture().then(({ envMap }) => {
        this.scene.environment = envMap;
        this.scene.background = envMap.texture;

        this.material.envMap = envMap.texture;
        this.material.needsUpdate = true;
      });
    },
    getEnvironmentTexture() {
      return new Promise((resolve, reject) => {
        new EXRLoader().setDataType(Three.UnsignedByteType).load(
          'https://materialballfile.blob.core.windows.net/material/模型/Tomoco Studio.exr',
          texture => {
            const envMap = this.pmremGenerator.fromEquirectangular(texture);
            texture.dispose();

            resolve({ envMap });
          },
          undefined,
          reject
        );
      });
    },
    HDRgetEnvironmentTexture() {
      return new Promise((resolve, reject) => {
        new RGBELoader().setDataType(Three.UnsignedByteType).load(
          '/materialball/static/PBR_TestBox/GSG_PRO_STUDIOS_METAL_008_sm.hdr',
          texture => {
            const envMap = this.pmremGenerator.fromEquirectangular(texture).texture;
            this.pmremGenerator.dispose();

            resolve({ envMap });
          },
          undefined,
          reject
        );
      });
    },
    initMaterialTexture() {
      this.initTextureLoaded = true;

      const sampleNo = this.data.SampleNo;
      const basicPath = `https://materialballfile.blob.core.windows.net/material/模型/M0545/${sampleNo}/`;

      const textures = {
        map: {
          url: `Bag_BA5566_${sampleNo}_BaseColor.png`,
          value: null
        },
        normalMap: {
          url: `Bag_BA5566_${sampleNo}_Normal.png`,
          value: null
        },
        roughnessMap: {
          url: `Bag_BA5566_${sampleNo}_Roughness.png`,
          value: null
        },
        metalnessMap: {
          url: `Bag_BA5566_${sampleNo}_Metallic.png`,
          value: null
        }
      };

      const texturePromises = [];

      const manager = new Three.LoadingManager();

      manager.setURLModifier(url => {
        return `${basicPath}${url}`;
      });

      const loader = new Three.TextureLoader(manager);

      for (const key in textures) {
        texturePromises.push(
          new Promise((resolve, reject) => {
            const entry = textures[key];
            const url = entry.url;

            loader.load(
              url,
              texture => {
                entry.value = texture;
                resolve(entry);
              },
              undefined,
              reject
            );
          })
        );
      }

      Promise.all(texturePromises).then(() => {
        const material = new Three.MeshStandardMaterial({
          color: 0x7f7f7f,
          map: textures.map.value,
          normalMap: textures.normalMap.value,
          roughnessMap: textures.roughnessMap.value,
          metalnessMap: textures.metalnessMap.value,
          metalness: 1
        });

        this.content.traverse(o => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            o.material = material;
            o.material.map.encoding = Three.sRGBEncoding;
            o.material.map.format = Three.RGBFormat;
            o.material.normalMap.format = Three.RGBFormat;
            o.material.roughnessMap.format = Three.RGBFormat;
            o.material.metalnessMap.format = Three.RGBFormat;
            o.material.needsUpdate = true;
          }
        });

        this.scene.add(this.content);

        this.initTextureLoaded = false;
      });
    },
    updateMaterialTexture() {
      if (!this.colorPalette || this.colorPalette.imagePath === '') return;
      console.log(this.colorPalette);

      const sampleNo = this.data.SampleNo;

      this.textureLoaded = true;

      const basicPath = `https://materialballfile.blob.core.windows.net/material/模型/M0545/${sampleNo}/`;

      const textures = {
        map: {
          url: this.colorPalette.imagePath || '',
          value: null
        },
        normalMap: {
          url: `Bag_BA5566_${sampleNo}_Normal.png`,
          value: null
        },
        roughnessMap: {
          url: `Bag_BA5566_${sampleNo}_Roughness.png`,
          value: null
        },
        metalnessMap: {
          url: `Bag_BA5566_${sampleNo}_Metallic.png`,
          value: null
        }
      };

      const texturePromises = [];

      const manager = new Three.LoadingManager();

      manager.setURLModifier(url => {
        return `${basicPath}${url}`;
      });

      const loader = new Three.TextureLoader(manager);

      for (const key in textures) {
        texturePromises.push(
          new Promise((resolve, reject) => {
            const entry = textures[key];
            const url = entry.url;

            loader.load(
              url,
              texture => {
                entry.value = texture;
                resolve(entry);
              },
              undefined,
              reject
            );
          })
        );
      }

      Promise.all(texturePromises).then(() => {
        const material = new Three.MeshStandardMaterial({
          color: 0x7f7f7f,
          map: textures.map.value,
          normalMap: textures.normalMap.value,
          roughnessMap: textures.roughnessMap.value,
          metalnessMap: textures.metalnessMap.value,
          metalness: 1
        });

        this.content.traverse(o => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
            o.material = material;
            o.material.map.encoding = Three.sRGBEncoding;
            o.material.map.format = Three.RGBFormat;
            o.material.normalMap.format = Three.RGBFormat;
            o.material.roughnessMap.format = Three.RGBFormat;
            o.material.metalnessMap.format = Three.RGBFormat;
            o.material.needsUpdate = true;
          }
        });

        this.scene.add(this.content);

        this.textureLoaded = false;
      });
    },
    getMaterialTexture(url) {
      return new Promise((resolve, reject) => {
        const manager = new Three.LoadingManager();

        manager.setURLModifier(url => {
          return '/materialball/static/PBR_TestBox/' + url;
        });

        const textureLoader = new Three.TextureLoader(manager);

        textureLoader.load(
          url,
          texture => {
            resolve(texture);
          },
          undefined,
          reject
        );
      });
    },
    animate() {
      requestAnimationFrame(this.animate);

      this.controls.update();

      this.render();
    },
    render() {
      this.renderer.render(this.scene, this.camera);
    },
    resize() {
      const { clientWidth, clientHeight } = this.container;

      this.camera.aspect = clientWidth / clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(clientWidth, clientHeight);
    },
    clear() {
      const Map_Names = [
        'map',
        'aoMap',
        'emissiveMap',
        'glossinessMap',
        'metalnessMap',
        'normalMap',
        'roughnessMap',
        'specularMap'
      ];

      if (!this.content) {
        return;
      }

      this.scene.remove(this.content);
      // dispose geometry
      this.content.traverse(node => {
        if (!node.isMesh) return;
        node.geometry.dispose();
      });

      // dispose textures
      this.traverseMaterials(this.content, material => {
        Map_Names.forEach(map => {
          if (material[map]) {
            return material[map].dispose();
          }
        });
      });
    },
    traverseMaterials(object, callback) {
      object.traverse(node => {
        if (!node.isMesh) {
          return;
        }

        const material = Array.isArray(node.material) ? node.material : [node.material];

        material.forEach(callback);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#scene-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

#loader-wrapper {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

#hint-message {
  position: absolute;
  top: 0;
  text-align: center;
  width: 100%;
  background: rgba($color: #ffffff, $alpha: 0.2);
}

#loader {
  display: block;
  position: relative;
  left: 50%;
  top: 50%;
  width: 150px;
  height: 150px;
  margin: -75px 0 0 -75px;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #457b9d;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;

  &::before {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #a8dadc;
    -webkit-animation: spin 3s linear infinite;
    animation: spin 3s linear infinite;
  }

  &::after {
    content: "";
    position: absolute;
    top: 15px;
    left: 15px;
    right: 15px;
    bottom: 15px;
    border-radius: 50%;
    border: 3px solid transparent;
    border-top-color: #f1faee;
    -webkit-animation: spin 1.5s linear infinite;
    animation: spin 1.5s linear infinite;
  }
}

#percent {
  display: inline;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.8rem;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
