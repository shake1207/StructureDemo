export const DetectiveWidth = {
  data() {
    return {
      sidebarTogglable: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.detectiveWidth();
      window.addEventListener('resize', this.detectiveWidth);
    });
  },
  methods: {
    detectiveWidth() {
      const windowWidth = window.innerWidth;
      this.sidebarTogglable = windowWidth > 1024 ? false : true;
    }
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('resize', this.detectiveWidth);
    next();
  }
};
