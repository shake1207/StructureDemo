<template>
  <b-modal id="login-modal" :visible="modalActived" hide-header hide-footer @hide="hideModal">
    <div class="login-page">
      <div class="form-wraper">
        <b-form class="form">
          <input
            v-model="member.MemberNo"
            v-emoji
            type="text"
            placeholder="UserName"
          >
          <input
            v-model="member.MemberPassWord"
            v-emoji
            type="password"
            placeholder="PassWord"
          >
          <b-button class="login-btn" @click="login">login</b-button>
        </b-form>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex';
import { apiUserLogin } from '../apis/apis';
import { apiDetail } from '../apis/apis';
export default {
  name: 'Login',
  data() {
    return {
      member: {
        MemberNo: '',
        MemberPassWord: ''
      }
    };
  },
  computed: {
    ...mapGetters({
      loginModal: 'loginModal'
    }),
    modalActived: {
      get() {
        return this.loginModal;
      },
      set(v) {
        return v;
      }
    }
  },
  methods: {
    hideModal() {
      this.$store.dispatch('toggleLoginModal');
    },
    async login() {
      await apiUserLogin(this.member).then(response => {
        const res = response.data;
        const token = res.access_token;
        this.$store.dispatch('Authenticate/setAuth', {
          token: token,
          isLogin: true
        });
      });

      const user = await this.getUser();

      this.$store.dispatch('User/setUser', user);
      this.hideModal();
      this.$router.push('main');
    },
    getUser() {
      apiDetail()
        .then(response => {
          return response.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/ThemColors.scss";

.login-page {
  width: 100%;
  height: 100vh;
  background: #f96;
  margin: auto;

  .form-wraper {
    position: relative;
    z-index: 1;
    background: #fff;
    padding: 45px;
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
</style>
