import { getHistoryList } from '@/designApplication/apis/prod';

/**
 * @typedef {object} HistoryState 历史设计记录
 * @property {import('@/design').HistoryItem[]} historyList 列表
 * @property {boolean} visible_history 弹窗开关
 * @property {boolean} isInit_history 是否已经初始化
 * @property {boolean} loading_history 是否正在加载
 */
export const state_history = {
  isInit_history: false,
  loading_history: false,
  visible_history: false,
  historyList: [],
};

export const getters_history = {};

export const mutations_history = {
  setHistoryVisible(state, visible) {
    state.visible_history = visible;
  },
};

export const actions_history = {
  /**
   * @param {*} vuex context
   * @param {boolean} visible
   * 设置历史设计记录弹窗开关
   */
  async setHistoryVisible({ state, commit, dispatch, getters }, visible) {
    commit('setHistoryVisible', visible);

    if (visible && !state.isInit_history) {
      dispatch('getHistoryList');
    }
  },
  /**
   * 历史设计记录新增一条记录 (loading状态)
   * @param {*} vuex context
   * @param {import('@/design').HistoryItem} item
   */
  addHistoryItem({ state, commit, dispatch, getters }, item) {
    state.historyList.unshift(item);

    dispatch('setHistoryVisible', true);
  },
  /**
   * 获取历史设计记录
   */
  async getHistoryList({ state, commit, dispatch, getters }) {
    try {
      state.loading_history = true;
      state.historyList = await getHistoryList();
    } finally {
      state.loading_history = false;
      state.isInit_history = true;
    }
  },
};
