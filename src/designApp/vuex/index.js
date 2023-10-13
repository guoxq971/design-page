import { getProdItem } from '@/designApp/vuex/dispose/prod/prodItem';
import { getActiveData } from '@/designApp/vuex/dispose/prod/activeData';
import { ParseProdItem } from '@/designApplication/interface/commonProdParse';

export default {
  namespaced: true,
  state: {
    // 当前产品数据
    prod: null,
    // 当前产品激活的仓库
    prodStore: [],
  },
  getters: {
    /**
     * 根据激活的颜色和尺码获取当前使用的数据
     * @param {*} state vuex state
     * @returns {ActiveData} 当前使用的数据
     * */
    activeData(state) {
      return getActiveData(state.prod);
    },
  },
  mutations: {},
  actions: {
    /**
     * 设置激活产品
     * @param {*} vuex context
     * @param {ParseProdItem} detail 产品详情
     * @returns {ProdItem} 当前激活的产品
     * */
    setProd({ state, commit, dispatch, getters }, detail) {
      state.prod = getProdItem(detail);
      dispatch('setActiveView', state.prod.viewList[0]);
      return state.prod;
    },
    /**
     * 设置激活颜色
     * @param {*} vuex context
     * @param {object} color 颜色
     * */
    setActiveColor({ state, commit, dispatch, getters }, color) {
      state.prod.activeColor = color;
    },
    /**
     * 设置激活尺码
     * @param {*} vuex context
     * @param {object} size 尺码
     * */
    setActiveSize({ state, commit, dispatch, getters }, size) {
      state.prod.activeSize = size;
    },
    /**
     * 设置激活视图
     * @param {*} vuex context
     * @param {object} view 视图
     * */
    setActiveView({ state, commit, dispatch, getters }, view) {
      state.prod.activeView = view;
    },
  },
};
