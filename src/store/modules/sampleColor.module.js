import axios from 'axios';

const state = {
  SampleColor: []
};
const actions = {
  getSampleColor({ commit }, value) {
    const api = `${process.env.VUE_APP_BASE_API}/SampleColor/FilterByText`;
    const query = JSON.stringify(value);

    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    axios
      .post(api, query, config)
      .then(response => {
        const result = response.data;
        commit('setSampleColor', result);
      })
      .catch(error => console.log(error));
  }
};

const mutations = {
  setSampleColor(state, payload) {
    state.SampleColor = payload;
  }
};
const getters = {
  SampleColor(state) {
    return state.SampleColor;
  }
};

export const SampleColor = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
