import { actions_history, getters_history, mutations_history, state_history } from '@/designApplication/store/history';
import { collect_mutations, collect_state } from '@/designApplication/store/collect';
import { prod_actions, prod_getters, prod_mutations, prod_state } from '@/designApplication/store/prod';
import { image_actions } from '@/designApplication/store/image';

/**
 * designApplication store
 * @class State
 * */
const state = {
  // 初始化数据
  isInit_prod_common: false,
  isInit_prod_fba: false,
  isInit_prod_collect: false,
  isInit_image_my: false,
  isInit_image_group: false,
  isInit_image_share: false,
  isInit_image_collect: false,
  isInit_image_admin: false,

  // 图层
  visible_layer: true,
  // 位置和变换
  visible_position: false,
  // 推荐参数
  visible_recommend: false,
};

/**
 * designApplication
 * @namespace designApplication
 * @property {State} state
 * @property {object} getters
 * @property {object} mutations
 * @property {object} actions
 * @property {boolean} namespaced
 * */
export default {
  namespaced: true,
  state: {
    // 历史设计记录
    ...state_history,
    // 收藏产品
    ...collect_state,
    // 产品
    ...prod_state,
    ...state,
  },
  getters: {
    // 产品
    ...prod_getters,
    // 历史设计记录
    ...getters_history,
    /**
     * 当前激活的设计图
     */
    activeImage(state, getters) {
      const view = getters.activeView;
      if (!view || !view?.canvas) return null;
      return view?.activeImageUuid ? view?.canvas.getImage(view.activeImageUuid) : null;
    },
  },
  mutations: {
    // 设置初始化
    setInit(state, { type }) {
      state[`isInit_${type}`] = true;
    },
    // 位置和变换
    setVisiblePosition(state, visible) {
      state.visible_position = visible;
    },
    // 推荐参数
    setVisibleRecommend(state, visible) {
      state.visible_recommend = visible;
    },
    // 收藏产品
    ...collect_mutations,
    // 产品
    ...prod_mutations,
    // 历史设计记录
    ...mutations_history,
  },
  /**
   * actions => 工具(designerUtil) && 操作(actions | operationUtil)
   * */
  actions: {
    // 产品
    ...prod_actions,
    // 历史设计记录
    ...actions_history,
    // 设计图
    ...image_actions,
  },
};
