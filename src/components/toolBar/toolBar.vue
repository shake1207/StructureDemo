<template>
  <div class="tool-bar extend" @click.stop="toolBarExtending = !toolBarExtending">
    <div class="tool-bar-content">
      <font-awesome-icon
        class="tool-bar-favorite"
        :class="{ isFavorite: isFavorite }"
        :icon="['fas', 'heart']"
        size="lg"
        @click.stop="handleFavorite"
      />
    </div>
  </div>
</template>

<script>
import { isAbleToRead } from '@/utils/hasAuthenticate';
import { mapGetters } from 'vuex';

export default {
  name: 'ToolBar',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      toolBarExtending: false
    };
  },
  computed: {
    ...mapGetters({
      favorite: 'Favorite/favorite'
    }),
    isFavorite() {
      return (this.data && this.favorite.indexOf(this.data.SampleNo) > -1 && this.favoriteIsabled) ? true : false;
    },
    favoriteIsabled() {
      return isAbleToRead('Favorite');
    }
  },
  methods: {
    handleFavorite() {
      // 驗證權限
      if (!this.favoriteIsabled) {
        return;
      }
      // 新增或移除最愛
      this.$store.dispatch('Favorite/handleFavorite', this.data.SampleNo);
      this.toolBarExtending = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

.tool-bar {
  height: 2rem;
  position: absolute;
  top: 0;
  left: 0;
  margin: 0.4rem;
  text-align: center;
  line-height: 2rem;
  z-index: 99;

  &::before {
    content: "";
    display: block;
    position: absolute;
    width: 0;
    height: 100%;
    transition: all 0.2s linear;
  }

  .tool-bar-content {
    float: right;
    transform: rotate(0deg);
    margin: 0 0.4rem;
    opacity: 0;
    display: none;
    color: $secondary;
    transition: all 0.2s linear;
  }

  &.extend {
    &::before {
      width: 100%;
      border-top-left-radius: 20rem;
      border-top-right-radius: 20rem;
      border-bottom-left-radius: 20rem;
      border-bottom-right-radius: 20rem;
    }

    .tool-bar-content {
      opacity: 1;
      display: block;
      visibility: visible;

      .tool-bar-favorite {
        margin-right: 0.6rem;
        cursor: pointer;

        &.isFavorite {
          color: #ffb6c1;
        }
      }
    }
  }
}
</style>
