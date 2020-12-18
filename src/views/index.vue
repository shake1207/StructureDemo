<template>
  <b-overlay
    :show="loading"
    bg-color="#3b3b3b"
    opacity="1"
    spinner-small
    spinner-variant="secondary"
    class="fetching-overlay"
  >
    <div v-if="!loading" class="wrapper">
      <sample-container :samples="samples" />
    </div>
  </b-overlay>
</template>

<script>
import sampleContainer from '@/components/shelf/sampleContainer.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'Index',
  components: {
    sampleContainer
  },
  data() {
    return {
      list: []
    };
  },
  computed: {
    ...mapGetters({
      loading: 'loading',
      queryMode: 'queryMode',
      selectedTags: 'TagList/getSelectedTags',
      samples: 'Sample/retrieveSamples'
    })
  },
  watch: {
    selectedTags() {
      this.init();
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      if (!this.queryMode) {
        this.$store.commit('Sample/clearQueryText', { root: true });
        const conditions = this.selectedTags.map(tag => tag.TagNo);
        this.$store.dispatch('Sample/getSamples', conditions);
        return;
      }
      this.$store.commit('queryMode', false, { root: true });
    }
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
