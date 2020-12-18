const state = {
  token: '',
  isLogin: false
};

const actions = {
  setAuth({ commit }, value) {
    commit('SetAuth', value);
  },
  clearAuth({ commit }) {
    commit('ClearAuth');
  }
};

const mutations = {
  SetAuth(state, payload) {
    state.token = payload.token;
    state.isLogin = payload.isLogin;
  },
  ClearAuth(state) {
    state.token = '';
    state.isLogin = false;
  }
};

export const Authenticate = {
  namespaced: true,
  state,
  actions,
  mutations
};
