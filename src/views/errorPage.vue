<template>
  <div class="wrapper">
    <div class="errorBox">
      <div class="content">
        <h2>404</h2>
        <h4>Opps! Page not found</h4>
        <p>
          The page you were lookin for doesn't exist. You may have mistyped the address or the page
          may have moved.
        </p>
        <router-link to="main">Back To Home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage',
  data() {
    return {};
  },
  methods: {
    goHome() {
      this.$router.push('main');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

.wrapper {
  min-width: 320px;
  min-height: 100vh;

  .errorBox {
    width: 100%;
    height: 100%;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: linear-gradient(to top, #09203f 0%, #537895 100%);

    .content {
      max-width: 600px;
      padding: 10px;
      text-align: center;

      h2 {
        font-size: 18vw;
        color: #ddd;
        line-height: 1em;
      }

      h4 {
        position: relative;
        font-size: 1.5em;
        max-width: 90%;
        margin: 0 auto 20px;
        color: #111;
        background: #ddd;
        font-weight: 300;
        padding: 10px 20px;
        display: inline-block;
      }

      p {
        color: #ddd;
        font-size: 1.2em;
      }

      a {
        position: relative;
        display: inline-block;
        max-width: 70%;
        padding: 10px 25px;
        margin: auto;
        background-image: linear-gradient(45deg, #c71d6f 0%, #d09693 100%);
        color: #ddd;
        text-decoration: none;
        margin-top: 25px;
        border-radius: 25px;
        font-weight: 600;
      }
    }
  }
}
</style>
