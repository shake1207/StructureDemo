<template>
  <div class="wrapper">
    <div id="scene-container" ref="sceneContainer" />
    <div class="options">
      <div
        class="option"
        data-option="legs"
        :class="{ '--is-active': selectOption === 'legs' }"
        @click="selectOptions"
      >
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/legs.svg" alt="">
      </div>
      <div
        class="option"
        data-option="cushions"
        :class="{ '--is-active': selectOption === 'cushions' }"
        @click="selectOptions"
      >
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/cushions.svg" alt="">
      </div>
      <div
        class="option"
        data-option="base"
        :class="{ '--is-active': selectOption === 'base' }"
        @click="selectOptions"
      >
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/base.svg" alt="">
      </div>
      <div
        class="option"
        data-option="supports"
        :class="{ '--is-active': selectOption === 'supports' }"
        @click="selectOptions"
      >
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/supports.svg" alt="">
      </div>
      <div
        class="option"
        data-option="back"
        :class="{ '--is-active': selectOption === 'back' }"
        @click="selectOptions"
      >
        <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/back.svg" alt="">
      </div>
    </div>
    <div id="js-tray" class="tray">
      <div id="js-tray-slide" class="tray__slide" />
    </div>
  </div>
</template>

<script>
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default {
  name: 'Chair',
  data() {
    return {
      container: null,
      scene: null,
      camera: null,
      controls: null,
      renderer: null,
      lights: [],
      content: null,

      selectOption: 'legs',

      cameraFar: 5,
      activeOption: 'legs',
      colors: [
        {
          texture: 'http://182.52.70.198:8080/MaterialImg/YL-O001/YL-O001-02.png',
          size: [1, 1, 1],
          shininess: 0
        },
        {
          texture: 'http://182.52.70.198:8080/MaterialImg/YL-O002/YL-O002-02.png',
          size: [1, 1, 1],
          shininess: 0
        },

        {
          texture: 'http://182.52.70.198:8080/MaterialImg/YL-O017/YL-O017-02.png',
          size: [1, 1, 1],
          shininess: 0
        },

        {
          texture: 'http://182.52.70.198:8080/MaterialImg/YL-O015/YL-O015-02.png',
          size: [1, 1, 1],
          shininess: 0
        },

        {
          texture: 'http://182.52.70.198:8080/MaterialImg/YL-P010/YL-P010-02.png',
          size: [1, 1, 1],
          shininess: 0
        },

        {
          color: '131417'
        },

        {
          color: '374047'
        },

        {
          color: '5f6e78'
        },

        {
          color: '7f8a93'
        },

        {
          color: '97a1a7'
        },

        {
          color: 'acb4b9'
        },

        {
          color: 'DF9998'
        },

        {
          color: '7C6862'
        },

        {
          color: 'A3AB84'
        },

        {
          color: 'D6CCB1'
        },

        {
          color: 'F8D5C4'
        },

        {
          color: 'A3AE99'
        },

        {
          color: 'EFF2F2'
        },

        {
          color: 'B0C5C1'
        },

        {
          color: '8B8C8C'
        },

        {
          color: '565F59'
        },

        {
          color: 'CB304A'
        },

        {
          color: 'FED7C8'
        },

        {
          color: 'C7BDBD'
        },

        {
          color: '3DCBBE'
        },

        {
          color: '264B4F'
        },

        {
          color: '389389'
        },

        {
          color: '85BEAE'
        },

        {
          color: 'F2DABA'
        },

        {
          color: 'F2A97F'
        },

        {
          color: 'D85F52'
        },

        {
          color: 'D92E37'
        },

        {
          color: 'FC9736'
        },

        {
          color: 'F7BD69'
        },

        {
          color: 'A4D09C'
        },

        {
          color: '4C8A67'
        },

        {
          color: '25608A'
        },

        {
          color: '75C8C6'
        },

        {
          color: 'F5E4B7'
        },

        {
          color: 'E69041'
        },

        {
          color: 'E56013'
        },

        {
          color: '11101D'
        },

        {
          color: '630609'
        },

        {
          color: 'C9240E'
        },

        {
          color: 'EC4B17'
        },

        {
          color: '281A1C'
        },

        {
          color: '4F556F'
        },

        {
          color: '64739B'
        },

        {
          color: 'CDBAC7'
        },

        {
          color: '946F43'
        },

        {
          color: '66533C'
        },

        {
          color: '173A2F'
        },

        {
          color: '153944'
        },

        {
          color: '27548D'
        },

        {
          color: '438AAC'
        }
      ]
    };
  },
  mounted() {
    this.buildColors(this.colors);
    this.$nextTick(() => {
      this.bindSwatch();
    });
    this.init();
  },
  methods: {
    init() {
      // set container
      this.container = this.$refs.sceneContainer;

      // init the scene
      this.scene = new Three.Scene();
      this.scene.background = new Three.Color(0xf1f1f1);
      this.scene.fog = new Three.Fog(0xf1f1f1, 20, 100);

      // init renderer
      this.renderer = new Three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.container.appendChild(this.renderer.domElement);

      // camera
      this.camera = new Three.PerspectiveCamera(
        50,
        this.container.clientWidth / this.container.clientHeight,
        0.1,
        1000
      );
      this.camera.position.z = this.cameraFar;
      this.camera.position.x = 0;

      // add lights
      const hemiLight = new Three.HemisphereLight(0xffffff, 0xffffff, 0.61);
      hemiLight.position.set(0, 50, 0);
      this.scene.add(hemiLight);

      const dirLight = new Three.DirectionalLight(0xffffff, 0.54);
      dirLight.position.set(-8, 12, 8);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize = new Three.Vector2(1024, 1024);
      this.scene.add(dirLight);

      // Add controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.maxPolarAngle = Math.PI / 2;
      this.controls.minPolarAngle = Math.PI / 3;
      this.controls.enableDamping = true;
      this.controls.enablePan = false;
      this.controls.dampingFactor = 0.1;
      this.controls.autoRotate = false;
      this.controls.autoRotateSpeed = 0.2;

      // Initial material
      const INITIAL_MTL = new Three.MeshPhongMaterial({ color: 0xf1f1f1, shininess: 10 });

      const INITIAL_MAP = [
        { childID: 'back', mtl: INITIAL_MTL },
        { childID: 'base', mtl: INITIAL_MTL },
        { childID: 'cushions', mtl: INITIAL_MTL },
        { childID: 'legs', mtl: INITIAL_MTL },
        { childID: 'supports', mtl: INITIAL_MTL }
      ];

      // load model
      const loader = new GLTFLoader();
      const MODEL_PATH = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1376484/chair.glb';

      loader.load(
        MODEL_PATH,
        gltf => {
          this.content = gltf.scene;

          this.content.traverse(o => {
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
            }
          });

          // Set the models initial scale
          this.content.scale.set(2, 2, 2);
          this.content.rotation.y = Math.PI;

          // Add the model to the scene
          this.content.position.y = -1;

          // Set initial textures
          for (const o of INITIAL_MAP) {
            this.initColor(this.content, o.childID, o.mtl);
          }

          this.scene.add(this.content);
        },
        xhr => {
          console.log((xhr.loaded / xhr.total) * 100 + '%loaded');
        },
        error => {
          console.error(error, 'load error!');
        }
      );

      this.animate();
    },
    initColor(parent, type, mtl) {
      parent.traverse(o => {
        if (o.isMesh) {
          if (o.name.includes(type)) {
            o.material = mtl;
            o.nameID = type;
          }
        }
      });
    },
    animate() {
      this.renderer.setAnimationLoop(() => {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);

        if (this.resizeRender(this.renderer)) {
          const canvas = this.renderer.domElement;
          this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
          this.camera.updateProjectionMatrix();
        }
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
    },
    buildColors(colors) {
      const TRAY = document.getElementById('js-tray-slide');

      for (const [i, color] of colors.entries()) {
        const swatch = document.createElement('div');
        swatch.classList.add('tray__swatch');

        if (color.texture) {
          swatch.style.backgroundImage = 'url(' + color.texture + ')';
        } else {
          swatch.style.background = '#' + color.color;
        }

        swatch.setAttribute('data-key', i);
        TRAY.append(swatch);
      }
    },
    bindSwatch() {
      const swatches = document.querySelectorAll('.tray__swatch');

      for (const swatch of swatches) {
        swatch.addEventListener('click', this.selectSwatch);
      }
    },
    selectSwatch(e) {
      const color = this.colors[parseInt(e.target.dataset.key)];
      let new_mtl = null;

      if (color.texture) {
        const txt = new Three.TextureLoader().load(color.texture);

        txt.repeat.set(color.size[0], color.size[1], color.size[2]);
        txt.wrapS = Three.RepeatWrapping;
        txt.wrapT = Three.RepeatWrapping;
        txt.minFilter = Three.NearestFilter;
        txt.magFilter = Three.LinearFilter;
        // ObjectTexture.magFilter = THREE.LinearFilter;

        new_mtl = new Three.MeshPhongMaterial({
          map: txt,
          shininess: color.shininess ? color.shininess : 10
        });
      } else {
        new_mtl = new Three.MeshPhongMaterial({
          color: parseInt('0x' + color.color),
          shininess: color.shininess ? color.shininess : 10
        });
      }

      this.setMaterial(this.content, this.selectOption, new_mtl);
    },
    setMaterial(parent, type, mtl) {
      parent.traverse(o => {
        if (o.isMesh && o.nameID != null) {
          // eslint-disable-next-line eqeqeq
          if (o.nameID == type) {
            o.material = mtl;
          }
        }
      });
    },
    selectOptions(e) {
      const o = e.target.dataset.option;
      this.selectOption = o;
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

.options {
  position: absolute;
  left: 0;

  .option {
    background-size: cover;
    background-position: 50%;
    background-color: #ffffff;
    margin-bottom: 3px;
    padding: 10px;
    height: 55px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      border-left: 5px solid white;
      width: 58px;
    }

    &.--is-active {
      border-right: 3px solid red;
      width: 58px;
      cursor: pointer;

      &:hover {
        border-left: none;
      }
    }

    img {
      height: 100%;
      width: auto;
      pointer-events: none;
    }
  }
}

::v-deep .tray {
  width: 100%;
  height: 50px;
  position: absolute;
  left: 0;
  bottom: 0;

  .tray__slide {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;

    .tray__swatch {
      height: 50px;
      width: 50px;
      flex: 1;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
      background-size: cover;
      background-position: center;
    }

    .tray__swatch:nth-child(5n + 5) {
      margin-right: 20px;
    }
  }
}
</style>
