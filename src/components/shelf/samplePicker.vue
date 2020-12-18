<template>
  <div class="sample-picker" :class="{ active: active }">
    <div class="toggle-picker-btn" @click="openPicker">
      <font-awesome-icon :icon="['fas', 'sliders-h']" />
    </div>
    <div class="picker-selector-bar" :class="{ active: active }">
      <span
        v-for="(palette, index) in palettes"
        :key="index"
        class="color-dot"
        :data-color="palette.color"
        :class="[{ active: classActive(palette.color) }, `${palette.color}`]"
        :style="{ backgroundColor: `${palette.color}` }"
        @click="select($event, palette)"
      />
    </div>
  </div>
</template>

<script>
import { isAbleToRead } from '@/utils/hasAuthenticate';

// TODO: 父層sample元件需傳入sampleno以查詢底下有哪些色彩可用
export default {
  name: 'SamplePicker',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      palettes: [],
      active: false,
      selectPalette: ''
    };
  },
  computed: {
    modelColorProcessIsabled() {
      return isAbleToRead('ModelColorProcess');
    }
  },
  created() {
    this.generateData();
  },
  methods: {
    generateData() {
      // 暫時組成假資料，遇到YL-O001、YL-O002、其他
      /*
        palette: [{ color, imagePath }]
      */
      // https://materialballfile.blob.core.windows.net/material/模型基本色卡/YL-O001/YL_O001_01_PBR_Base_Color_12-0824TCX.png
      const sampleNumber = this.data.SampleNo;
      // const path = `https://materialballfile.blob.core.windows.net/material/模型/M0545/${sampleNumber}`;
      const temp = [
        {
          color: '#FAE199',
          imagePath: `Bag_BA5566_${sampleNumber}_BaseColor_7402C.png`,
          imageThumb: ''
        },
        {
          color: '#FC9E21',
          imagePath: `Bag_BA5566_${sampleNumber}_BaseColor_1375C.png`,
          imageThumb: ''
        },
        {
          color: '#857946',
          imagePath: `Bag_BA5566_${sampleNumber}_BaseColor_7503C.png`,
          imageThumb: ''
        },
        {
          color: '#0F3B53',
          imagePath: `Bag_BA5566_${sampleNumber}_BaseColor_2152C.png`,
          imageThumb: ''
        },
        {
          color: '#9E2C6A',
          imagePath: `Bag_BA5566_${sampleNumber}_BaseColor_675C.png`,
          imageThumb: ''
        }
      ];

      this.palettes = temp;
    },
    openPicker() {
      if (!this.modelColorProcessIsabled) {
        return;
      }
      this.active = !this.active;
    },
    classActive(color = '') {
      const selectingColor = this.selectPalette;
      return color === selectingColor ? true : false;
    },
    select(e, palette) {
      const colorInfo = e.target.getAttribute('data-color');
      this.selectPalette = colorInfo;
      this.$emit('switchPalette', palette);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

.sample-picker {
  position: absolute;
  top: 8rem;
  right: 2rem;
  color: $light-font;
  overflow: hidden;
  z-index: 99;

  .toggle-picker-btn {
    position: relative;
    text-align: center;
    user-select: none;
    cursor: pointer;
   background-color: #353535;
    z-index: 99;
    border-bottom: 2px solid $secondary;
  }

  .picker-selector-bar {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-top: 2px solid $secondary;
    border-bottom: 2px solid $secondary;
   background-color: rgba(0, 0, 0, 0.2);
    padding: 0.2rem 0;
    transform: translateY(-100%);
    transition: all 400ms cubic-bezier(0, 0.995, 0.99, 1);
    z-index: 80;

    > .color-dot {
      position: relative;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      margin: 0.5rem;
      cursor: pointer;

      &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: inline-block;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid $primary;
        opacity: 0;
      }

      &.active::before {
        opacity: 1;
         transition: all 400ms cubic-bezier(0, 0.995, 0.99, 1);
      }
    }
    &.active {
      transform: translateY(-2%);
      transition: all 400ms cubic-bezier(0, 0.995, 0.99, 1);
    }
  }
}

.red {
  background-color: red;

  &.active::before {
    border-color: red !important;
  }
}

.pink {
  background-color: pink;

  &.active::before {
    border-color: pink !important;
  }
}

.green {
  background-color: green;

  &.active::before {
    border-color: green !important;
  }
}

.blue {
  background-color: blue;

  &.active::before {
    border-color: blue !important;
  }
}

.orange {
  background-color: orange;

  &.active::before {
    border-color: orange !important;
  }
}
</style>
