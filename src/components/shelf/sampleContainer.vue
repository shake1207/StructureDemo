<template>
  <b-container id="sample-container" fluid class="py-2">
    <b-row v-if="samples.length > 0" no-gutters>
      <b-col
        v-for="(item, index) in samples"
        :key="generateUUID(index)"
        sm="12"
        md="6"
        xl="4"
        class="box mb-4"
      >
        <sample-content :data="item" />
      </b-col>
    </b-row>
    <div v-else-if="!loading" class="hint-message">
      No result, please reselect conditions...
    </div>
  </b-container>
</template>

<script>
import sampleContent from './sampleContent.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'SampleContainer',
  components: {
    sampleContent
  },
  props: {
    samples: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      loading: 'loading'
    })
  },
  methods: {
    generateUUID() {
      let d = Date.now();

      if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

* {
  scrollbar-width: thin;
  scrollbar-color: $primary $black;
}

*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: $primary;
}

*::-webkit-scrollbar-thumb {
  background: $secondary;
  border-radius: 20px;
  border: 3px solid $primary;
}

.content {
  background: $white;
  color: $light-font;
  overflow: auto;
}

#sample-container {
  overflow: auto;
}

.hint-message {
  font-size: 1.2rem;
  text-align: center;
  color: $secondary;
}
</style>
