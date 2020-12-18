<template>
  <div class="wrapper">
    <div class="login-page">
      <div class="form-wrapper">
        <b-form class="form" @submit.prevent="logIn">
          <input v-model="member.MemberNo" v-emoji v-focus type="text" required placeholder="UserName">
          <input v-model="member.MemberPassWord" v-emoji type="password" required placeholder="PassWord">
          <b-button type="submit" class="login-btn">Login</b-button>
          <span class="link-span" @click="skipToMain">SKIP LOGIN</span>
        </b-form>
      </div>
    </div>
    <div v-drag class="fix" />
  </div>
</template>

<script>
import { apiUserLogIn, apiDetail, apiIsAuthenticated } from '@/apis/apis';

export default {
  name: 'Login',
  data() {
    return {
      member: {
        MemberNo: '',
        MemberPassWord: ''
      },
      isLoad: false
    };
  },
  created() {
    this.logOut();
  },
  methods: {
    async logIn() {
      const loginResult = await apiUserLogIn(this.member);

      if (loginResult !== '登入失敗') {
        this.$store.dispatch('Authenticate/setAuth', {
          token: loginResult.access_token,
          isLogin: true
        });
        const user = await this.getUser();

        console.log(user);
        this.$store.dispatch('User/setUser', user);

        this.$router.push('main');
      }
    },
    getUser() {
      return apiDetail().then(response => {
        console.log(response.data);
        return response.data;
      }
      ).catch(error => console.log(error));
    },
    logOut() {
      this.$store.dispatch('Authenticate/clearAuth');
      this.$store.dispatch('User/clearUser');
    },
    isAuth() {
      return apiIsAuthenticated().then(response => console.log(response.data));
    },
    skipToMain() {
      this.$router.push('main');
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

.login-page {
  width: 100%;
  margin: auto;

  .form-wrapper {
    position: relative;
    z-index: 1;
    width: 90%;
    max-width: 30rem;
    min-width: 300px;
    background: $white;
    padding: 45px;
    margin: 0 auto;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  }

  .form {
    input {
      font-family: "Roboto", sans-serif;
      outline: 0;
      background: $secondary;
      width: 100%;
      border: 0;
      margin: 0 0 15px;
      padding: 15px;
      box-sizing: border-box;
      font-size: 1.2rem;
    }

    .login-btn {
      font-family: "Roboto", sans-serif;
      text-transform: uppercase;
      outline: 0;
      background: $primary;
      width: 100%;
      border: 0;
      padding: 15px;
      color: $white;
      font-size: 1.2rem;
      -webkit-transform: all 0.3 ease;
      transform: all 0.3 ease;
      cursor: pointer;

      &:hover,
      &:active,
      &:focus {
        background: rgba($color: $primary, $alpha: 0.8);
      }
    }
  }
}
.link-span {
  display: block;
  margin-top: 0.6rem;
  cursor: pointer;
}
.fix{
  width: 50px;
  height: 50px;
  background:red;
  position: fixed;
  right:0;
  bottom: 100px;
  margin: auto;
}
</style>
