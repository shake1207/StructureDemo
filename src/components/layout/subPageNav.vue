<template>
  <div class="navbar">
    <div class="head-bar">
      <div class="main-panel">
        <h2 class="title text-no-wrap mr-2">
          <router-link to="/main">Yaw Liamy VML</router-link>
        </h2>
      </div>
      <div class="side-panel p-2">
        <div class="block-container top h-50 px-2">
          <div class="tool-block px-2">
            <span class="tool-btn" @click="loginReDirect">
              <font-awesome-icon :icon="['fas', 'user']" size="lg" />
            </span>
            <span class="tool-btn" @click="favoriteReDirect">
              <font-awesome-icon :icon="['fas', 'heart']" size="lg" />
            </span>
            <b-button @click="toggleSideMenu">
              <font-awesome-icon :icon="['fas', 'bars']" size="lg" />
            </b-button>
          </div>
          <div class="block-container h-50 px-2">
            <search-bar @closeLayer="closeLayer" />
          </div>
        </div>
      </div>
      <div class="side-panel-fold">
        <b-button class="mr-2" variant="primary" @click="toggleSidebar">
          <font-awesome-icon :icon="['fas', 'bars']" size="lg" />
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { isAbleToRead } from '@/utils/hasAuthenticate';
import searchBar from '@/components/searchBar.vue';

export default {
  name: 'SubPageNavbar',
  components: {
    searchBar
  },
  data() {
    return {
      infoCollapsable: false
    };
  },
  computed: {
    favoriteIsabled() {
      return isAbleToRead('Favorite');
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.detectiveInfoDisplay();
      window.addEventListener('resize', this.detectiveInfoDisplay);
    });
  },
  destroyed() {
    window.removeEventListener('resize', this.detectiveInfoDisplay);
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('resize', this.detectiveInfoDisplay);
    next();
  },
  methods: {
    loginReDirect() {
      !this.$store.state.Authenticate.isLogin
        ? this.$router.push('login')
        : this.$store.dispatch('toggleLoginModal');
    },
    favoriteReDirect() {
      if (!this.favoriteIsabled) {
        return;
      }
      this.closeLayer();
      this.$router.push('favorite');
    },
    detectiveInfoDisplay() {
      const windowWidth = window.innerWidth;

      this.infoCollapsable = windowWidth > 992 ? false : true;
    },
    toggleSideMenu() {
      this.$emit('toggleSideMenu');
    },
    toggleSidebar() {
      this.$emit('toggleSidebar');
    },
    closeLayer() {
      this.$emit('closeLayer');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

.navbar {
  .head-bar {
    .side-panel {
      max-width: 16rem;
      min-width: 16rem;
      color: $primary;
      background-color: $secondary;
      height: 100%;
    }

    .side-panel-fold {
      display: none;
    }
  }
}

.custom-detail.btn {
  border-bottom: 2px solid $custom-detail-btn;
}

.custom-collapse {
  border-top: 2px solid $secondary;
  border-bottom: 2px solid $secondary;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  z-index: 9999;
}

.block-container {
  display: flex;
  align-items: center;

  &.top {
    justify-content: space-between;
  }
}

::v-deep .custom-card {
  background-color: rgba($color: $primary, $alpha: 0.8);
  border-radius: 0;
  padding: 0.2rem;
}

@media (max-width: 1024px) {
  .navbar {
    .head-bar {
      .side-panel {
        display: none;
      }

      .side-panel-fold {
        display: block;
      }
    }
  }
}
</style>
