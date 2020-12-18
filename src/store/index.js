import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { Authenticate } from './modules/authenticate.module';
import { Favorite } from './modules/favorite.module';
import { FilePath } from './modules/filePath.module';
import { TagList } from './modules/tagList.module';
import { User } from './modules/user.module';
import { Sample } from './modules/sample.module';
import { SampleColor } from './modules/sampleColor.module';
// import SecrueLS from "secure-ls";

Vue.use(Vuex);

// const ls = new SecrueLS({ isCompression: false });

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    isLoading: false,
    isQueryMode: false,
    isLoginModal: false
  },
  actions: {
    updateLoading(context, status) {
      context.commit('loading', status);
    },
    toggleQueryMode(context) {
      context.commit('queryMode', status);
    },
    toggleLoginModal(context) {
      context.commit('toggleLoginModal');
    }
  },
  mutations: {
    loading(state, status) {
      state.isLoading = status;
    },
    queryMode(state, status) {
      state.isQueryMode = status;
    },
    toggleLoginModal(state) {
      state.isLoginModal = !state.isLoginModal;
    }
  },
  getters: {
    loading(state) {
      return state.isLoading;
    },
    queryMode(state) {
      return state.isQueryMode;
    },
    loginModal(state) {
      return state.isLoginModal;
    }
  },
  modules: {
    Authenticate,
    Favorite,
    FilePath,
    TagList,
    User,
    Sample,
    SampleColor
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      paths: ['Authenticate', 'User']
      // key: "userInfo",
      // storage: {
      //   getItem: key => ls.get(key),
      //   setItem: (key, value) => ls.set(key, value),
      //   removeItem: key => ls.remove(key)
      // },
      // reducer(val) {
      //   return {
      //     user: val.user
      //   };
      // }
    })
  ]
});
