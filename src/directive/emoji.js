const findEle = (parent, type) => {
  return parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type);
};

const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
};

const emoji = {
  bind: function(el, binding, vnode) {
    // 只能輸入英文||數字||下底線
    var regRule = /[^\w\/]/ig;
    const $inp = findEle(el, 'input');
    el.$inp = $inp;
    $inp.handle = function() {
      const val = $inp.value;
      $inp.value = val.replace(regRule, '');

      trigger($inp, 'input');
    };
    $inp.addEventListener('keyup', $inp.handle);
  },
  unbind: function(el) {
    el.$inp.removeEventListener('keyup', el.$inp.handle);
  }
};

export default emoji;
