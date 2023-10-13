import Vue from 'vue';
import Vuex from 'vuex';
import designApp from '@/designApp/vuex';
import designApplication from '@/designApplication/store';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    designApp,
    designApplication,
  },
});
