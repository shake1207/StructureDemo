<template>
  <div class="wrapper">
    <div class="content">
      <navbar
        :sidebar-togglable="sidebarTogglable"
        :sidebar-active="sidebarActive"
        :head-collapse="headCollapse"
        @toggleSidebar="toggleSidebar"
        @toggleHeadCollapse="toggleHeadCollapse"
      />
      <router-view :key="$route.path" />
    </div>
    <div v-if="layerActive" class="layer" @click="closeLayer" />
    <sidebar
      :sidebar-active="sidebarActive"
      :sidebar-togglable="sidebarTogglable"
      @toggleSidebar="toggleSidebar"
      @closeLayer="closeLayer"
    />
  </div>
</template>

<script>
import navbar from '@/components/layout/navbar.vue';
import sidebar from '@/components/layout/sidebar.vue';
import { DetectiveWidth } from '@/mixins/mixin.detectiveWidth';

export default {
  name: 'MainLayout',
  components: {
    navbar,
    sidebar
  },
  mixins: [DetectiveWidth],
  data() {
    return {
      sidebarActive: false,
      headCollapse: false,
      layerActive: false
    };
  },
  methods: {
    toggleSidebar() {
      // 判斷 sidebar 能否開關
      console.log('改?');
      if (!this.sidebarTogglable) {
        return;
      }
      if (this.headCollapse) {
        this.sidebarActive = true;
        this.headCollapse = false;
        return;
      }
      this.sidebarActive = !this.sidebarActive;
      this.layerActive = !this.layerActive;
    },
    toggleHeadCollapse() {
      if (this.sidebarActive) {
        this.headCollapse = true;
        this.sidebarActive = false;
        return;
      }
      this.headCollapse = !this.headCollapse;
      this.layerActive = !this.layerActive;
    },
    closeLayer() {
      this.sidebarActive = false;
      this.headCollapse = false;
      this.layerActive = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

.layer {
  position: absolute;
  z-index: 99;
  width: 100%;
  height: 100%;
  background: rgba($color: $black, $alpha: 0.8);
}
</style>
