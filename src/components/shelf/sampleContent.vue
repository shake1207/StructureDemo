<template>
  <div class="sample-content js-enabled">
    <carousel :data="data" @displaySample="displaySample" />
    <div class="custome-carousel-caption">
      {{ data.ItemNo }}
    </div>
  </div>
</template>

<script>
import ScrollReveal from 'scrollreveal';
import carousel from '@/components/carousel/index.vue';
import Axios from 'axios';

export default {
  name: 'SampleContent',
  components: {
    carousel
  },
  props: {
    data: {
      type: Object,
      default: () => {},
      scrollReveal: ScrollReveal()
    }
  },
  data() {
    return {
      // scrollReveal:scrollReveal()
    };
  },
  computed: {
    badgeList() {
      let list = this.data.Tags.split(',');

      if (!list) {
        list = [];
      }

      if (list.length > 10) {
        list.length = 10;
      }
      return list;
    }
  },
  mounted() {
    ScrollReveal().reveal('.sample-content', {
      container: '#sample-container',
      delay: 0,
      distance: '200px',
      duration: 1200,
      easing: 'cubic-bezier(0,1.07,.58,.92)',
      mobile: true
    });
  },
  beforeDestroy() {
    ScrollReveal().destroy();
  },
  methods: {
    async download() {
      // 檢查下載檔案是否存在 正常 status 為 200 才下載
      const res = await fetch(this.publicPath).then(response => response.status === 200);

      if (res) {
        const link = document.createElement('a');
        link.setAttribute('href', this.publicPath);
        link.setAttribute('download', this.downloadFileName);

        console.log(link);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      this.$bvModal.msgBox('檔案異常', {
        title: '下載訊息',
        buttonSize: 'sm',
        okVariant: 'pink',
        centered: true,
        size: 'sm'
      });
    },
    async downloadHref() {
      let msg = '';
      const res = await Axios({
        url: this.publicPath,
        method: 'GET',
        responseType: 'blob'
      })
        .then(response => {
          console.log(response);
          return response.data;
        })
        .catch(error => {
          console.log(error);
          msg = error;
        });

      console.log(res);

      if (res) {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', this.downloadFileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }
      this.$bvModal.msgBoxOk(msg, {
        title: '下載訊息',
        buttonSize: 'sm',
        centered: true,
        size: 'sm'
      });
    },
    initHideSampleContent() {
      document.getElementsByClassName('sample-content').classList.add('js-enabled');
      document.querySelectorAll('.sample-content').classList.add('js-enabled');
    },
    displaySample() {
      console.log(this.data);
      this.$router.push({
        name: 'sample',
        params: { data: this.data }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

.sample-content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;

  .custome-carousel-caption {
    width: 100%;
    height: 40px;
    max-width: 300px;
    text-align: center;
    line-height: 40px;
    color: $light-font;
    font-family: "Roboto", sans-serif;
    border-bottom: 2px solid $black;
    margin:auto;
    cursor: default;
  }
}

.js-enabled {
  visibility: hidden;
}

::v-deep .my-modal-body {
  height: 50vh;
}
::v-deep .swiper-slide {
  display: flex;
  justify-content: center;
  height: auto !important;

  .slider-background-first,
  .slider-background-second,
  .slider-background-third {
    width: 100%;
    height: 50vh;
    background-size: contain;
    background-position: center center;
    background-repeat: no-repeat;
  }

  img {
    height: 50vh;
  }
}

.layer {
  background: $black;
  width: 100%;
  height: 550px;
}
.data-bar {
  width: 100%;
  height: 80%;
  display: flex;
  flex-direction: row;

  .data-bar-left {
    width: 50%;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .cutome-badge {
      background: $pink;
      border: 1px solid #e69494;
    }
  }

  .data-bar-right {
    width: 50%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;

    .download-button {
      background: $pink;
      border: 1px solid #e69494;
    }
  }
}

::v-deep .no-border {
  border: none;
}

@media (max-width: 1024px) {
  .data-bar {
    flex-direction: column;
    height: 160px;

    .data-bar-left {
      width: 100%;
      height: 100px;
    }
    .data-bar-right {
      width: 100%;
      height: 60px;
    }
  }
}
</style>
