<template>
  <div>
    <div class="indicate" :class="{ active: showInfoPanel }" @click="toggleInfoPanel">
      <font-awesome-icon :icon="['fas', 'caret-right']" />
    </div>
    <div class="info-panel p-2" :class="{ active: showInfoPanel }">
      <template v-if="!activeColorPickerPanel">
        <div class="info-panel-content">
          <div v-if="data" class="list">
            <span>Sample No.：{{ data.SampleNo }}}</span>
            <span>Item No.：{{ data.ItemeNo }}}</span>
            <span>Description：{{ data.SampleName }}}</span>
            <span>Price：{{ suggestPrice }}}</span>
          </div>
          <!-- 加入最愛功能 -->
          <tool-bar v-show="true" :data="data" />
          <div class="badge-area py-2">
            <template v-if="!tagListIsabled">
              <span>No permission to read tags data.</span>
            </template>
            <template v-else-if="badgeList.length">
              <b-badge v-for="(tag, index) in badgeList" :key="index" class="cutome-badge mr-1">
                {{ tag.trim() }}
              </b-badge>
            </template>
            <template v-else>
              <span>This sample has no tags.</span>
            </template>
          </div>
          <div class="py-2">
            <button v-can="'ModelFileDownload'" class="btn download-button" @click="download">
              <font-awesome-icon :icon="['fas', 'download']" />
              <span class="mx-1">.sbsar</span>
            </button>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="model-picker">
          <div
            v-for="(set, index) in modelSets"
            :key="index"
            class="picker-item is-active"
            :style="{ backgroundImage: thumbImagePath(set.thumbImage) }"
            @click="
              handleIndicator($event.target);
              displayModel(set.model);
            "
          />
          <i class="active-indicator" />
        </div>
      </template>
      <div class="info-panel-head px-1" @click="toggleInfoPanel">
        <font-awesome-icon :icon="['fas', 'caret-left']" size="lg" />
      </div>
    </div>
  </div>
</template>

<script>
import { isAbleToRead } from '@/utils/hasAuthenticate';
import toolBar from './toolBar/toolBarForSample.vue';

export default {
  name: 'InfoPanel',
  components: {
    toolBar
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    activeColorPickerPanel: Boolean
  },
  data() {
    return {
      showInfoPanel: false,
      modelSets: [
        {
          thumbImage: 'model_1.png',
          model: 'Bag_BA5566.fbx'
        },
        {
          thumbImage: 'model_2.png',
          model: 'PBR_TestBox.obj'
        },
        {
          thumbImage: 'model_3.png',
          model: 'PBR_TestBox.obj'
        },
        {
          thumbImage: 'model_4.png',
          model: 'PBR_TestBox.obj'
        }
      ]
    };
  },
  computed: {
    tagListIsabled() {
      return isAbleToRead('TagList');
    },
    costPriceIsabled() {
      return isAbleToRead('CostPrice');
    },
    badgeList() {
      /**
       * 標籤列表
       * 如果沒有權限回傳空陣列
       * @return { Array }
       */

      if (!this.data) {
        return [];
      }
      const isabled = this.tagListIsabled;

      let list = this.data.Tags.map(t => t.TagName) || [];

      if (!isabled) {
        list = [];
      }
      if (list.length > 10) {
        list.length = 10;
      }
      return list;
    },
    suggestPrice() {
      if (!this.data) {
        return '';
      }
      if (!this.costPriceIsabled) {
        return '- -';
      }
      const _data = this.data;
      const currNo = _data.CurrNo ? _data.CurrNo : '';
      const price = _data.Price ? _data.Price : '';

      return `${currNo} ${price}`;
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.initIndicator);
    });
  },
  updated() {
    this.$nextTick(() => {
      this.initIndicator();
    });
  },
  destroyed() {
    window.removeEventListener('resize', this.initIndicator);
  },
  methods: {
    toggleInfoPanel() {
      // 開關樣品選擇工具列
      this.showInfoPanel = !this.showInfoPanel;
    },
    download() {
      this.$emit('download');
    },
    initIndicator() {
      const items = document.querySelectorAll('.picker-item');

      items.forEach(item => {
        if (item.classList.contains('is-active')) {
          this.handleIndicator(item);
        }
      });
    },
    handleIndicator(e) {
      const indicator = document.querySelector('.active-indicator');
      const items = document.querySelectorAll('.picker-item');

      items.forEach(item => {
        item.classList.remove('is-active');
        item.style.removeProperty('height');
        item.style.removeProperty('top');
      });
      indicator.style.height = `${e.offsetHeight}px`;
      indicator.style.top = `${e.offsetTop}px`;

      e.classList.add('is-active');
    },
    thumbImagePath(imageName) {
      return `url(./static/model_thumb/${imageName})`;
    },
    displayModel(model) {
      this.$emit(model);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

.indicate {
  position: absolute;
  top: 50%;
  padding: 0.2rem 0.6rem;
  background: $primary;
  border: 2px solid $secondary;
  border-left: none;
  border-bottom-right-radius: 99rem;
  border-top-right-radius: 99rem;
  color: $secondary;
  font-family: "Roboto", sans-serif;
  z-index: 99;
  cursor: pointer;
  transition: all 0.2s linear;

  &:hover {
    padding: 0.2rem 0.6rem 0.2rem 1.2rem;
  }
}

.info-panel {
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 7rem;
  left: -18rem;
  color: $secondary;
  font-family: "Roboto", sans-serif;
  background: $primary;
  width: 100%;
  max-width: 18rem;
  height: calc(100% - 7rem);
  z-index: 100;
  overflow: hidden;
  transition: all 0.2s linear;
  border-right: 2px solid $secondary;

  &.active {
    left: 0;
  }

  .info-panel-head {
    display: flex;
    justify-content: center;
    align-items: center;
    color: $primary;
    background: $secondary;
    cursor: pointer;
  }

  .close-btn {
    cursor: pointer;
  }

  .info-panel-content {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow-y: auto;

    .list {
      flex: 1 1 auto;

      > span {
        display: block;
        width: 100%;
      }

      span + span {
        padding-top: 0.2rem;
      }
    }
  }

  .model-picker {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
    margin: 0.2rem 0;
    cursor: pointer;

    .picker-item {
      position: relative;
      width: 80%;
      height: 100%;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background: rgba(90, 75, 75, 0.4);
      margin: 0.4rem;

      &::before,
      &::after {
        content: "";
        display: block;
        position: absolute;
        opacity: 0;
        transition: 0.4s;
      }

      &::before {
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-left-color: rgb(202, 202, 202);
        top: 50%;
        left: 0%;
        transform: translateY(-50%);
      }

      &:not(.is-active):hover {
        &::before,
        &::after {
          opacity: 1;
          bottom: 0;
        }

        &::before {
          border-left-color: rgb(202, 202, 202);
        }

        &::after {
          border-color: rgb(202, 202, 202);
        }
      }
    }

    .active-indicator {
      position: absolute;
      top: 0;
      left: 10%;
      width: 5px;
      z-index: 1;
      transition: 0.4s;

      &::before,
      &::after {
        content: "";
        display: block;
        position: absolute;
      }

      &::before {
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-left-color: $secondary;
        top: 50%;
        left: 0%;
        transform: translateY(-50%);
      }

      &::after {
        width: 2px;
        height: calc(100% - 2px);
        margin-left: -2px;
        border: 2px solid $secondary;
        top: 50%;
        left: 0%;
        transform: translateY(-50%);
      }
    }
  }
}

.download-button {
  border: 2px solid $secondary;
  border-radius: 0;
  color: $secondary;
  display: flex;
  flex-wrap: nowrap;
}
</style>
