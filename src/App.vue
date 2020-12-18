<template>
  <div id="app">
    <router-view />
    <user-info />
  </div>
</template>

<script>
import userInfo from '@/components/userInfo.vue';

export default {
  components: {
    userInfo
  },
  computed: {
    isLogin() {
      return this.$store.state.Authenticate.isLogin;
    }
  },
  created() {
    this.$store.dispatch('Favorite/getFavorite');
  }
};
</script>
<style lang="scss">
@import "./assets/scss/main.scss";
</style>
