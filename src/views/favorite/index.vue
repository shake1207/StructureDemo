<template>
  <b-overlay
    class="fetching-overlay"
    bg-color="#3b3b3b"
    opacity="1"
    spinner-small
    spinner-variant="secondary"
    :show="loading"
  >
    <div class="wrapper">
      <sample-container :samples="favoriteSamples" />
    </div>
  </b-overlay>
</template>

<script>
import sampleContainer from '@/components/shelf/sampleContainer.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Favorite',
  components: {
    sampleContainer
  },
  computed: {
    ...mapGetters({
      loading: 'loading',
      favorite: 'Favorite/favorite',
      favoriteSamples: 'Favorite/favoriteSamples'
    })
  },
  watch: {
    favorite() {
      this.$store.dispatch('Favorite/getFavoriteSamples');
    }
  },
  created() {
    this.$store.dispatch('Favorite/getFavoriteSamples');
  }
};
</script>

<style lang="scss" scoped>

.fetching-overlay {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
