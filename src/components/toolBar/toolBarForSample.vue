<template>
  <div class="tool-bar">
    <div class="tool-bar-content">
      <font-awesome-icon
        id="test"
        class="tool-bar-favorite"
        :class="{ isFavorite: isFavorite }"
        :icon="['fas', 'heart']"
        size="lg"
        @click="handleFavorite"
      />
      <b-tooltip target="test">Add to favorite</b-tooltip>
    </div>
  </div>
</template>

<script>
import { isAbleToRead } from '@/utils/hasAuthenticate';
import { mapGetters } from 'vuex';

export default {
  name: 'ToolBarForSample',
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
      console.log(this.favoriteIsabled);
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
  position: relative;
  top: 0;
  left: 0;
  border-bottom: 2px solid $secondary;
  margin-right: 0.4rem;
  text-align: left;
  line-height: 2rem;
  z-index: 99;

  .tool-bar-content {
    display: block;
    margin: 0 0.4rem;
    color: $secondary;

    .tool-bar-favorite {
      font-size: 2rem;
      z-index: 99;
      cursor: pointer;

      &.isFavorite {
        color: #ffb6ce;
      }
    }
  }
}
</style>
