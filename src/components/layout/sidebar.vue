<template>
  <div id="sidebar" :class="{ active: sidebarActive }">
    <div class="sidebar-head p-2">
      <div class="block-container h-50 px-2">
        <div class="tool-block px-2">
          <span class="tool-btn" @click="loginReDirect">
            <font-awesome-icon :icon="['fas', 'user']" size="lg" />
          </span>
          <span class="tool-btn" @click="favoriteReDirect">
            <font-awesome-icon :icon="['fas', 'heart']" size="lg" />
          </span>
        </div>
      </div>
      <div class="block-container h-50 px-2">
        <search-bar @closeLayer="closeLayer" />
      </div>
    </div>
    <sidebar-content @closeLayer="closeLayer" />
  </div>
</template>

<script>
import { isAbleToRead } from '@/utils/hasAuthenticate';
import searchBar from '@/components/searchBar.vue';
import sidebarContent from '@/components/layout/sidebarContent.vue';
import { mapGetters } from 'vuex';
import { DefaultMsgBoxOk } from '@/apis/bvToast';

export default {
  name: 'Sidebar',
  components: {
    searchBar,
    sidebarContent
  },
  props: {
    sidebarActive: Boolean,
    sidebarTogglable: Boolean
  },
  data() {
    return {};
  },
  computed: {
    favoriteIsabled() {
      return isAbleToRead('Favorite');
    },
    ...mapGetters({
      loginModal: 'loginModal',
      user: 'User/user',
      favoriteSamples: 'Favorite/favoriteSamples'
    })
  },
  watch: {
    favoriteSamples(v) {
      console.log(v);
    }
  },
  methods: {
    loginReDirect() {
      !this.$store.state.Authenticate.isLogin
        ? this.$router.push('login')
        : this.$store.dispatch('toggleLoginModal');
    },
    favoriteReDirect() {
      if (this.user === null) {
        DefaultMsgBoxOk('請先登入帳號', {});
        return;
      }
      if (!this.favoriteIsabled) {
        return;
      }
      // console.log(this.$router.name);
      this.closeLayer();
      this.$router.push('favorite');
    },
    closeLayer() {
      this.$emit('closeLayer');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

* {
  scrollbar-width: thin;
  scrollbar-color: #f2f2f2 #000000;
}

*::-webkit-scrollbar {
  width: 12px;
}

*::-webkit-scrollbar-track {
  background: #f2f2f2;
}

*::-webkit-scrollbar-thumb {
  background-color: #000000;
  border-radius: 20px;
  border: 3px solid #f2f2f2;
}

.btn:focus,
.btn.focus {
  outline: 0;
  box-shadow: none;
}

.block-container {
  display: flex;
  align-items: center;
}

.tag-search-area {
  padding: 0.4rem;
}
</style>
