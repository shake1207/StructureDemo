<template>
  <div
    class="carousel-container"
    @mouseover="isHover = userLogin ? true:false"
    @mouseleave="isHover = false"
    @click.prevent="displaySample"
  >
    <tool-bar v-show="display" :data="data" />
    <b-carousel
      v-model="slideIndex"
      :interval="countInterval"
      :indicators="isHover"
      background="rgba(0, 0, 0, 0.1)"
      no-hover-pause
    >
      <b-carousel-slide v-for="(img, index) in imgLists" :key="index">
        <template v-slot:img>
          <div class="img-container">
            <img :data-src="img" class="lazyload" @error="handleImgDisplay">
          </div>
        </template>
      </b-carousel-slide>
    </b-carousel>
  </div>
</template>

<script>
import { isAbleToRead } from '@/utils/hasAuthenticate';
import toolBar from '@/components/toolBar/toolBar.vue';
import { mapGetters } from 'vuex';
import { DefaultMsgBoxOk } from '@/apis/bvToast';

export default {
  name: 'Carousel',
  components: {
    toolBar
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      slideIndex: 0,
      isHover: false
    };
  },
  computed: {
    ...mapGetters({
      userLogin: 'User/user'
    }),
    fabricMeshIsabled() {
      return isAbleToRead('FabricMesh');
    },
    sampleDetailPageIsabled() {
      return isAbleToRead('SampleDetailPage');
    },
    countInterval() {
      let time = 0;
      const windowWidth = window.innerWidth;

      if (this.isHover && windowWidth > 1024) {
        time = 3000;
      }
      return time;
    },
    imgLists() {
      const path = process.env.VUE_APP_BASE_IMAGE; // 全域性圖片網址
      const list = [];

      for (let i = 1; i <= 2; i++) {
        if (!this.fabricMeshIsabled && i === 2) continue;
        list[i - 1] = `${path}/${this.data.SampleNo}/${this.data.SampleNo}-0${i}.png`;
      }
      const filtered = list.filter(elements => elements !== null);
      return filtered;
    },
    display() {
      return this.isMobile() || this.isHover ? true : false;
    }
  },
  watch: {
    isHover(value) {
      if (!value) {
        this.slideTndex = 0;
      }
    }
  },
  methods: {
    displaySample() {
      if (!this.userLogin) {
        DefaultMsgBoxOk('請先登入帳號', {});
        return;
      }
      if (!this.sampleDetailPageIsabled) {
        return;
      }
      this.isHover = false;
      this.$emit('displaySample');
    },
    handleImgDisplay(e) {
      e.target.src = process.env.VUE_APP_BASE_IMAGENOTFOUND; // 全域性圖片找不到替代圖
    },
    isMobile() {
      const result = !!('ontouchstart' in window || navigator.msMaxTouchPoints);
      return result;
    }
  }
};
</script>
<style lang="scss" scoped>

.carousel-container {
  width: 100%;
  height: 100%;
  max-width: 300px;
  max-height: 300px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.img-container {
  width: 300px;
  height: 300px;
  cursor: pointer;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

::v-deep .carousel-indicators li {
  background-color: #7d7d7d !important;

}
</style>
