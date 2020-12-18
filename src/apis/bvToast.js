import Vue from 'vue';
import { ToastPlugin } from 'bootstrap-vue';

Vue.use(ToastPlugin);
const BvToast = new Vue().$bvToast;
const BvModal = new Vue().$bvModal;
const variantInfo = {
  'error': 'danger'
};

const DefaultToast = function(msg, variant = 'warning', title = '提示') {
  BvToast.toast(msg, {
    title,
    variant: variantInfo[variant] || variant,
    toaster: 'b-toaster-top-center',
    solid: true,
    autoHideDelay: 100000000000000000
  });
};

const DefaultMsgBoxOk = function(msg, data) {
  BvModal.msgBoxOk(msg, {
    title: '提示訊息',
    titleTag: data.titleTag || 'p',
    buttonSize: data.buttonSize || 'sm',
    centered: data.centered || true,
    size: data.size || 'sm',
    headerTextVariant: 'info',
    headerClass: data.headerClass || 'text-align',
    bodyClass: data.bodyClass || 'text-align',
    footerClass: data.footerClass || 'border-top-0'
  });
};

Vue.prototype.$_defaultToast = DefaultToast;
Vue.prototype.$_defaultMsgBoxOk = DefaultMsgBoxOk;

export {
  BvToast,
  BvModal,
  DefaultToast,
  DefaultMsgBoxOk
};
