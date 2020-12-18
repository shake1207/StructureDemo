<template>
  <div class="navbar">
    <div class="head-bar">
      <div class="main-panel">
        <h2 class="title text-no-wrap mr-2">
          <router-link to="/main">Structure Demo</router-link>
        </h2>
        <result-display />
      </div>
    </div>
    <b-button v-if="sidebarTogglable" class="mr-2" variant="primary" @click="toggleSidebar">
      <font-awesome-icon :icon="['fas', 'bars']" size="lg" />
    </b-button>
  </div>
</template>

<script>
import resultDisplay from '@/components/resultDisplay.vue';

export default {
  name: 'Navbar',
  components: {
    resultDisplay
  },
  props: {
    sidebarTogglable: Boolean,
    sidebarActive: Boolean,
    headCollapse: Boolean
  },
  methods: {
    toggleSidebar() {
      this.$emit('toggleSidebar');
    },
    toggleHeadCollapse() {
      this.$emit('toggleHeadCollapse');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

.navbar {
  flex-wrap: nowrap;
}

.tool-area {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  height: 7rem;
  width: 16rem;
  background-color: $secondary;
}

.toggle-btn {
  height: 36px;
}
</style>
