
const drag = {

  bind(el, binding) {
    const isMobile = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i) !== null;
    console.log(isMobile);

    // 手機板
    if (isMobile) {
      const switchPos = {
        x: 0,
        y: 100,
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0
      };
      el.addEventListener('touchstart', function(e) {
        console.log(e.touches);
        switchPos.startX = e.touches[0].pageX;
        switchPos.startY = e.touches[0].pageY;
      });
      el.addEventListener('touchend', function(e) {
        switchPos.x = switchPos.endX;
        switchPos.y = switchPos.endY;
        switchPos.startX = 0;
        switchPos.startY = 0;
      });
      el.addEventListener('touchmove', function(e) {
        console.log(e);
        if (e.touches.length > 0) {
          const offsetX = e.touches[0].pageX - switchPos.startX;
          const offsetY = e.touches[0].pageY - switchPos.startY;
          let x = switchPos.x - offsetX;
          let y = switchPos.y - offsetY;
          if (x + el.offsetWidth > document.documentElement.offsetWidth) {
            x = document.documentElement.offsetWidth - el.offsetWidth;
          }
          if (y + el.offsetHeight > document.documentElement.offsetHeight) {
            y = document.documentElement.offsetHeight - el.offsetHeight;
          }

          if (x < 0) { x = 0; }
          if (y < 0) { y = 0; }
          el.style.right = x + 'px';
          el.style.bottom = y + 'px';
          switchPos.endX = x;
          switchPos.endY = y;
          e.preventDefault();
        }
      });
      return;
    }
    console.log(el);
    el.onmousedown = function(e) {
      const disX = e.clientX - el.offsetLeft;
      const disY = e.clientY - el.offsetTop;

      document.onmousemove = function(e) {
        const left = e.clientX - disX;
        const top = e.clientY - disY;
        console.log(e);
        this.positionX = top;
        this.positionY = left;

        el.style.left = left + 'px';
        el.style.top = top + 'px';
      };
      document.onmouseup = function(e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
    // el.onmousedown = function(e) {
    //   console.log(e);
    //   const l = e.clientX - el.offsetLeft;
    //   const t = e.clientY - el.offsetTop;
    //   document.onmousemove = function(e) {
    //     console.log(e);
    //     el.style.left = e.clientX - l + 'px';
    //     el.style.top = e.clientY - t + 'px';
    //   };
    //   el.onmouseup = function() {
    //     document.onmousemove = null;
    //     el.onmouseup = null;
    //   };
    // };
  }

};

export default drag;
