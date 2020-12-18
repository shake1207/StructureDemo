const state = {
  storedQueryCondition: {
    SampleNo: '',
    ColorNo: ''
  }
};

const actions = {
  SaveCondition({ commit }, payload) {
    commit('saveCondition', payload);
  },
  CleanCondition({ commit }) {
    const obj = {
      SampleNo: '',
      ColorNo: ''
    };
    commit('saveCondition', obj);
  }
};

const mutations = {
  saveCondition(state, payload) {
    state.storedQueryCondition = { ...payload };
  }
};

const getters = {
  storedQueryCondition(state) {
    return state.storedQueryCondition;
  }
};

export const FilePath = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
