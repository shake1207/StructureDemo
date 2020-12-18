import Vue from 'vue';
import { ToastPlugin } from 'bootstrap-vue';
import router from '../router/index';

Vue.use(ToastPlugin);

/**
 * 錯誤msg消息提示函數
 * @param {*} msg
 */
export const tip = msg => {
  this.$bvToast.toast(`${msg}`, {
    title: 'Message',
    solid: true,
    autoHideDelay: 5000
  });
};

export const toLogin = () => {
  router.replace({
    name: 'login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  });
};

export const to403Page = () => {
  router.replace({
    name: 'login'
  });
};
export const to404ErrorPage = () => {
  router.replace({
    name: 'errorPage'
  });
};

