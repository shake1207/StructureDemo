import axios from 'axios';
import router from '@/router';

const state = {
  queryText: '',
  sampleList: []
};

const actions = {
  getSamples({ dispatch, commit }, value) {
    if (!value.length) {
      commit('clearSamples');
      dispatch('retrieveAllSamples');
      return;
    }
    const api = `${process.env.VUE_APP_BASE_API}/Sample/FilterByTags`;
    commit('loading', true, { root: true });

    axios
      .post(api, value)
      .then(response => {
        const result = response.data;
        commit('storeSamples', result);
        commit('loading', false, { root: true });
      })
      .catch(error => console.log(error));
  },
  querySamples({ commit }, value) {
    const api = `${process.env.VUE_APP_BASE_API}/Sample/FilterByText`;
    const data = JSON.stringify(value);
    console.log(data);

    commit('clearSamples');
    commit('TagList/clearAllSelectedTags', [], { root: true });
    commit('loading', true, { root: true });
    commit('queryMode', true, { root: true });

    router.push({ name: 'main' }).catch(error => console.log(error));

    var config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    axios
      .post(api, data, config)
      .then(response => {
        const result = response.data;

        commit('storeSamples', result);
        commit('saveQueryText', value.value);
        commit('loading', false, { root: true });
      })
      .catch(error => console.log(error));
  },
  retrieveAllSamples({ commit }) {
    const api = `${process.env.VUE_APP_BASE_API}/Sample/Get`;

    commit('loading', true, { root: true });

    axios
      .get(api)
      .then(response => {
        const result = response.data;
        commit('storeSamples', result);
        commit('loading', false, { root: true });
      })
      .catch(error => console.log(error));
  }
};

const mutations = {
  storeSamples(state, payload) {
    state.sampleList = payload;
  },
  clearSamples(state) {
    state.sampleList.length = 0;
  },
  saveQueryText(state, payload) {
    state.queryText = payload;
  },
  clearQueryText(state) {
    state.queryText = '';
  }
};

const getters = {
  retrieveSamples(state) {
    return state.sampleList;
  },
  queryText(state) {
    return state.queryText;
  }
};

export const Sample = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
