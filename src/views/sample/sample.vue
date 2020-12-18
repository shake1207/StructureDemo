<template>
  <div class="wrapper">
    <div class="content">
      <!-- 樣品頁專用導覽列 -->
      <subnavbar
        @toggleSideMenu="toggleSideMenu"
        @toggleSidebar="toggleSidebar"
        @closeLayer="closeLayer"
      />
      <!-- 樣品頁可開關右側欄 -->
      <div
        v-if="!sidebarTogglable"
        id="sidebar"
        class="side-menu"
        :class="{ active: sideMenuToggle }"
      >
        <sidebar-content />
      </div>
      <!-- 左側懸浮資訊窗 -->
      <info-panel
        :data="data"
        :active-color-picker-panel="activeColorPickerPanel"
        @download="download"
        @displayModel="displayModel"
      />
      <!-- 滑動展示區 -->
      <swiper
        ref="mySwiper"
        class="swiper"
        :options="swiperOption"
        @slideChange="handleSliderChange"
      >
        <swiper-slide>
          <div
            :style="{ backgroundImage: `url(${imgListLarge[0]})` }"
            class="slider-background-first"
          />
        </swiper-slide>
        <swiper-slide v-if="fabricMeshIsabled">
          <div
            :style="{ backgroundImage: `url(${imgListLarge[1]})` }"
            class="slider-background-second"
          />
        </swiper-slide>
        <swiper-slide ref="viewerSwipe" class="viewer-swipe">
          <model-viewer
            v-if="activeColorPickerPanel"
            :data="data"
            :model-object="modelObject"
            :color-palette="colorPalette"
          />
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination" />
      </swiper>
      <!-- 色彩樣本選擇器 -->
      <sample-picker
        v-if="activeColorPickerPanel"
        :data="data"
        @switchPalette="switchPalette"
      />
    </div>
    <div v-if="layerActive" class="layer" @click="closeLayer" />
    <sidebar
      v-if="sidebarTogglable"
      :sidebar-active="sidebarActive"
      :sidebar-togglable="sidebarTogglable"
      @toggleSidebar="toggleSidebar"
      @closeLayer="closeLayer"
    />
  </div>
</template>

<script>
import { isAbleToRead } from '@/utils/hasAuthenticate';
import sidebar from '@/components/layout/sidebar.vue';
import subnavbar from '@/components/layout/subPageNav.vue';
import sidebarContent from '@/components/layout/sidebarContent.vue';
import samplePicker from '@/components/shelf/samplePicker.vue';
import infoPanel from '@/components/infoPanel.vue';
import modelViewer from '@/components/modelViewer.vue';

export default {
  name: 'Sample',
  components: {
    sidebar,
    subnavbar,
    sidebarContent,
    samplePicker,
    infoPanel,
    modelViewer
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      modelObject: 'PBR_TestBox.obj',
      sideMenuToggle: false,
      fallbackImg: process.env.VUE_APP_BASE_IMAGENOTFOUND,

      imgListLarge: [],
      publicPath: '',
      downloadUrl: '',
      downloadFileName: '',
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        slidesPerView: 1,
        allowTouchMove: true,
        centeredSlides: true
      },
      sidebarTogglable: false, // 是否啟動側欄toggle的選項
      sidebarActive: false, // 打開側欄
      layerActive: false, // 打開遮罩
      activeColorPickerPanel: false,
      colorPalette: null
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      (!to.params.data || !from.name) ? vm.$router.push({ name: 'main' }) : next();
    });
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('resize', this.detectiveWidth);
    next();
  },
  computed: {
    swiper() {
      console.log(this.$refs.mySwiper.$swiper);
      return this.$refs.mySwiper.$swiper;
    },
    fabricMeshIsabled() {
      return isAbleToRead('FabricMesh');
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.detectiveWidth();
      window.addEventListener('resize', this.detectiveWidth);
    });
    this.createdData();
  },
  destroyed() {
    window.removeEventListener('resize', this.detectiveWidth);
  },
  methods: {
    detectiveWidth() {
      // 偵測寬度，變更控制項
      // 目前：導覽列側欄是否可開關
      const windowWidth = window.innerWidth;

      this.sidebarTogglable = windowWidth > 1024 ? false : true;
    },
    createdData() {
      // 建立頁面資料，包含圖片路徑、下載路徑
      if (!this.data) {
        this.imgListLarge = [];
        this.publicPath = '';
        this.downloadUrl = '';
        this.downloadFileName = '';
        return;
      }
      const path = process.env.VUE_APP_BASE_IMAGE;

      this.imgListLarge = [
        `${path}/${this.data.SampleNo}/${this.data.SampleNo}-04.png`,
        `${path}/${this.data.SampleNo}/${this.data.SampleNo}-05.png`
      ];

      this.publicPath = `${path}/${this.data.SampleNo}/${this.data.SampleNo}.sbsar`;
      this.downloadUrl = `${path}/${this.data.SampleNo}/${this.data.SampleNo}.sbsar`;
      this.downloadFileName = `${this.data.SampleNo}.sbsar`;
    },
    async download() {
      // 檢查下載檔案是否存在 正常 status 為 200 才下載
      const res = await fetch(this.publicPath).then(response => response.status === 200);

      if (res) {
        const link = document.createElement('a');
        link.setAttribute('href', this.publicPath);
        link.setAttribute('download', this.downloadFileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      this.$bvModal.msgBoxOk('檔案異常', {
        title: '下載訊息',
        buttonSize: 'sm',
        okVariant: 'pink',
        centered: true,
        size: 'sm'
      });
    },
    toggleSideMenu() {
      this.sideMenuToggle = !this.sideMenuToggle;
    },
    toggleSidebar() {
      // 判斷sidebar 能否開關
      console.log(this.sidebarTogglable);
      if (!this.sidebarTogglable) {
        return;
      }
      if (this.headCollapse) {
        this.sidebarActive = true;
        this.headCollapse = false;
        return;
      }
      this.sidebarActive = !this.sidebarActive;
      this.layerActive = !this.layerActive;
    },
    closeLayer() {
      this.sidebarActive = false;
      this.headCollapse = false;
      this.layerActive = false;
    },
    handleSliderChaange() {
      // 控制在特定slide position會有特定功能
      // 在3D view位置關閉觸控滑動功能、顯示樣品選擇工具列
      const _swiper = this.swiper;
      const vm = this;

      this.$nextTick(() => {
        const viewerSwipeClassList = vm.$refs.viewerSwipe.$el.classList;

        if (viewerSwipeClassList.contains('swiper-slide-active')) {
          _swiper.allowTouchMove = false;
          vm.activeColorPickerPanel = true;
          return;
        }
        _swiper.allowTouchMove = true;
        vm.activeColorPickerPanel = false;
      });
    },
    displayModel(model) {
      this.modelObject = model;
    },
    switchPalette(value) {
      this.colorPalette = value;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

model-viewer {
  width: 100%;
  height: 100%;
}

.layer {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba($color: $black, $alpha: 0.8);
  z-index: 99;
}

.side-menu {
  height: 0;
  border-top: 2px solid $secondary;
  background: $secondary;
  width: 16rem;
  height: calc(100% - 7rem + 2px);
  position: absolute;
  top: calc(7rem - 2px);
  right: 0;
  z-index: 9999;
  opacity: 0;
  display: none;
  transition: all 0.2s linear;

  &.active {
    border-top: 2px solid $primary;
    opacity: 1;
   display: block;

    .sidebar-content {
      overflow: auto;
    }
  }
}

::v-deep .swiper {
  width: 100%;
  height: 100%;
  color: $light-font;

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-weight: bold;
    background-color: rgba($color: #000000, $alpha: 0.1);

    .slider-background-first,
    .slider-background-second,
    .slider-background-third {
      width: 70%;
      height: 70%;
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
    }
  }
}

@media (max-width: 1024px) {
  #sidebar {
    height: 100%;
    top: 0;
  }
}
</style>
