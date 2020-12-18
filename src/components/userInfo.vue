<template>
  <b-modal
    v-if="modalActived"
    id="user-info-modal"
    :visible="modalActived"
    hide-header
    @hide="hideModal"
  >
    <div class="user-page">
      <b-form-group label-cols="4" label-cols-lg="3" label="Brand No." label-for="BrandNo">
        <b-form-input id="BrandNo" :value="userDisplay.BrandNo" disabled />
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="3" label="Member No." label-for="MemberNo">
        <b-form-input id="MemberNo" :value="userDisplay.MemberNo" disabled />
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="3" label="Member Name" label-for="MemberName">
        <b-form-input id="MemberName" :value="userDisplay.MemberName" disabled />
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="3" label="Address" label-for="Address">
        <b-form-input id="Address" :value="userDisplay.Address" disabled />
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="3" label="Email" label-for="Email">
        <b-form-input id="Email" :value="userDisplay.Email" disabled />
      </b-form-group>
      <b-form-group label-cols="4" label-cols-lg="3" label="Tel" label-for="Tel">
        <b-form-input id="Tel" :value="userDisplay.Tel" disabled />
      </b-form-group>
    </div>
    <template v-slot:modal-footer>
      <b-button @click="logout">LOGOUT</b-button>
    </template>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'UserInfo',
  computed: {
    ...mapGetters({
      loginModal: 'loginModal',
      user: 'User/user'
    }),
    modalActived: {
      get() {
        return this.loginModal;
      },
      set(v) {
        return v;
      }
    },
    userDisplay() {
      const user = this.user;
      console.log(user);
      const { BrandNo, MemberNo, MemberName, Address, Email, Tel } = { ...user };
      return { BrandNo, MemberNo, MemberName, Address, Email, Tel };
    }
  },
  methods: {
    hideModal() {
      this.$store.dispatch('toggleLoginModal');
    },
    logout() {
      this.$store.dispatch('Authenticate/clearAuth');
      this.$store.dispatch('User/clearUser');
      this.hideModal();
      this.$router.push('login');
    }
  }
};
</script>
<style lang="scss" scoped></style>
