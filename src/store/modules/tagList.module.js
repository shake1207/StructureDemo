import axios from 'axios';

const state = {
  tagList: [],
  selectedTags: [],
  isTagExisted: false
};

const actions = {
  getTags({ commit }) {
    const api = `${process.env.VUE_APP_BASE_API}/Tag/Get`;

    axios
      .get(api)
      .then(response => {
        const tagList = response.data;
        const res = JSON.parse(tagList);
        res.forEach(element => {
          element.SeriesTagItems = element.SeriesTagItems.filter(tag => {
            return tag.SampleAmount > 0;
          });
        });
        commit('setList', res);
      })
      .catch(error => console.log(error));
  },
  setSelectedTags({ commit }, value) {
    commit('setSelectedTags', value);
  }
};
const mutations = {
  setList(state, payload) {
    state.tagList = payload;
  },
  setSelectedTags(state, payload) {
    state.selectedTags = payload;
  },
  clearAllSelectedTags(state, payload = []) {
    state.selectedTags = payload;
  }
};
const getters = {
  getTagList(state) {
    return state.tagList;
  },
  getSelectedTags(state) {
    return state.selectedTags;
  },
  hasTag: state => tagName => {
    return state.tagList.some(tag => tag.TagName.trim() === tagName);
  }
};

export const TagList = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
