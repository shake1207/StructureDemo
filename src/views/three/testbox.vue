<template>
  <div id="scene-container" ref="sceneContainer" />
</template>

<script>
import * as Three from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export default {
  name: 'TestBox',
  data() {
    return {
      container: null,
      scene: null,
      camera: null,
      controls: null,
      renderer: null,
      lights: [],
      content: null,

      material: null
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // set container
      this.container = this.$refs.sceneContainer;

      // create camera
      const camera = new Three.PerspectiveCamera(
        60,
        this.container.clientWidth / this.container.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 5, 10);
      this.camera = camera;

      // create scene
      this.scene = new Three.Scene();
      this.scene.background = new Three.Color('rgba(59, 59, 59)');

      // create renderer
      this.renderer = new Three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.shadowMap.enabled = true;
      this.renderer.gammaFactor = 2.2;
      // this.renderer.gammaOutput = true;
      this.renderer.outputEncoding = Three.sRGBEncoding; // 色彩空間轉換
      // this.renderer.physicallyCorrectLights = true;
      this.container.appendChild(this.renderer.domElement);

      // add Lights
      // const ambient = new Three.AmbientLight(0xffffff, 6);
      // this.scene.add(ambient);

      // point light
      // const pointLight = new Three.PointLight(0xffffff, 1, 0);
      // pointLight.position.set(0, 0, -5);
      // this.scene.add(pointLight);

      // const sphereSize = 1;
      // const pointLightHelper = new Three.PointLightHelper(pointLight, sphereSize);
      // this.scene.add(pointLightHelper);

      //
      const pmremGenerator = new Three.PMREMGenerator(this.renderer);
      pmremGenerator.compileEquirectangularShader();

      new RGBELoader()
        .setDataType(Three.UnsignedByteType)
        .load('/materialball/static/PBR_TestBox/GSG_PRO_STUDIOS_METAL_008_sm.hdr', texture => {
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;

          // this.scene.background = envMap;
          this.scene.environment = envMap;

          texture.dispose();
          pmremGenerator.dispose();
        });

      // add controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      // set aspect ratio to match the new browser window aspect ratio
      this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
      this.camera.updateMatrixWorld(true);
      this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

      this.objLoader();
      // this.GLTFLoader();

      this.animate();
    },
    animate() {
      this.renderer.setAnimationLoop(() => {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        // console.log(JSON.stringify(this.scene));
        // console.log(JSON.stringify(this.scene.children[1].children[0].material));
        // if (this.resizeRender(this.renderer)) {
        //   const canvas = this.renderer.domElement;
        //   this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
        //   this.camera.updateProjectionMatrix();
        // }
      });
    },
    objLoader() {
      const loader = new OBJLoader();

      loader.load(
        'https://materialballfile.blob.core.windows.net/material/PBR_TestBox/PBR_TestBox.obj',
        obj => {
          const _object = obj;
          // const center = new Three.Vector3();

          // Set the models initial scale
          _object.scale.set(0.6, 0.6, 0.6);

          _object.position.set(0, 0, 0);

          // Set textures
          // -------------
          let mtl = null;
          const textureLoader = new Three.TextureLoader();

          mtl = new Three.MeshStandardMaterial({
            color: 0x7f7f7f,
            map: textureLoader.load(
              `/materialball/static/PBR_TestBox/PBR_TestBox_lambert1_BaseColor_2.png`
            ),
            normalMap: textureLoader.load(
              `/materialball/static/PBR_TestBox/PBR_TestBox_lambert1_Normal.png`
            ),
            roughnessMap: textureLoader.load(
              `/materialball/static/PBR_TestBox/PBR_TestBox_lambert1_TEST.png`
            ),
            metalnessMap: textureLoader.load(
              `/materialball/static/PBR_TestBox/PBR_TestBox_lambert1_TEST.png`
            ),
            metalness: 1
          });

          console.log(mtl);

          _object.traverse(o => {
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
              o.material = mtl;
              o.material.map.encoding = Three.sRGBEncoding;
              o.material.map.format = Three.RGBFormat;
              o.material.normalMap.format = Three.RGBFormat;
              o.material.roughnessMap.format = Three.RGBFormat;
              o.material.metalnessMap.format = Three.RGBFormat;
              o.material.needsUpdate = true;
            }
          });

          mtl.dispose();
          // -------------
          // this.setMaterial(_object);

          this.scene.add(_object);

          console.log(JSON.stringify(_object));
          // console.log(JSON.stringify(this.scene));
        }
      );
    },
    GLTFLoader() {
      const loader = new GLTFLoader();

      loader.load('/materialball/static/PBR_TestBox/PBR_TestBox.glb', gltf => {
        const object = gltf.scene;

        object.traverse(o => {
          if (o.isMesh) {
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        // object.material.color.set(0xffffff * Math.random());

        // const center = new Three.Vector3();
        object.scale.set(0.6, 0.6, 0.6);

        object.position.set(0, 0, 0);

        // const textureLoader = new Three.TextureLoader().load(
        //     `/materialball/static/PBR_TestBox/PBR_TestBox_lambert1_BaseColor_2.png`
        //   );

        // const textureCube = new Three.CubeTextureLoader()
        //   .setPath("/materialball/static/")
        //   .load(["pos-x.jpg", "neg-x.jpg", "pos-y.jpg", "neg-y.jpg", "pos-z.jpg", "neg-z.jpg"]);

        // mtl = new Three.MeshStandardMaterial({
        //   map: textureLoader.load(
        //     `/materialball/static/PBR_TestBox/PBR_TestBox_lambert1_BaseColor_2.png`
        //   ),
        // });

        // object.traverse(o => {
        //   if (o.isMesh) {
        //     o.castShadow = true;
        //     o.receiveShadow = true;
        //     o.material.map = textureLoader;
        //     o.material.map.encoding = Three.sRGBEncoding;
        //     o.material.map.format = Three.RGBFormat;
        //     o.material.needsUpdate = true;
        //   }
        // });

        // Set textures
        this.scene.add(object);

        console.log(JSON.stringify(object));
        // console.log(JSON.stringify(this.scene));
      });
    },
    setMaterial(obj) {
      let mtl = null;
      const _object = obj;
      const textureLoader = new Three.TextureLoader();

      // const textureCube = new Three.CubeTextureLoader()
      //   .setPath("/materialball/static/")
      //   .load(["pos-x.jpg", "neg-x.jpg", "pos-y.jpg", "neg-y.jpg", "pos-z.jpg", "neg-z.jpg"]);

      mtl = new Three.MeshStandardMaterial({
        color: 0x7f7f7f,
        map: textureLoader.load(
          `/materialball/static/PBR_TestBox/PBR_TestBox_lambert1_BaseColor.png`
        ),
        normalMap: textureLoader.load(
          `/materialball/static/PBR_TestBox/PBR_TestBox_lambert1_Normal.png`
        ),
        roughnessMap: textureLoader.load(
          `/materialball/static/PBR_TestBox/PBR_TestBox_lambert1_Metallic.png`
        ),
        metalnessMap: textureLoader.load(
          `/materialball/static/PBR_TestBox/PBR_TestBox_lambert1_Metallic.png`
        ),
        metalness: 1
        // envMap: textureCube,
        // envMapIntensity: 0.9,
      });

      console.log(mtl);

      _object.traverse(o => {
        if (o.isMesh) {
          o.material = mtl;
          o.material.needsUpdate = true;
        }
      });
    },
    textureLoader(filename) {
      const textureLoader = new Three.TextureLoader();

      return textureLoader.load(`/materialball/static/PBR_TestBox/${filename}`, texture => {
        texture.encoding = Three.sRGBEncoding;
        // texture.flipY = false;
      });
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
