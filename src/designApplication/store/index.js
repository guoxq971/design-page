import store from '@/store';
import { Message } from 'element-ui';

import { ProdStore } from '@/designApplication/store/prodStore';
import { ProdItem, ProdType, ProdUtil } from '@/designApplication/interface/prodItem';
import { Config } from '@/designApplication/core/config';
import { config3dUtil } from '@/designApplication/interface/Config3d/config3dOfCommonResponse';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

import { loadCanvas } from '@/designApplication/core/canvas/loadCanvas';
import { loadThree } from '@/designApplication/core/three/loadThree';
import { gerRefineProdConfig3dByTemplateNoWithSizeApi, getProd3dConfigByCommonApi, getProd3dConfigByRefineListApi, getRefineProdDetailByTemplateNoWithSizeApi } from '@/designApplication/apis/common';
import { loadImage } from '@/designApplication/core/utils/loadImage';
import { getProdPriceApi } from '@/designApplication/apis/prod';
import { cloneDeep } from 'lodash';

import { actions_history, getters_history, mutations_history, state_history } from '@/designApplication/store/history';
import { collect_mutations, collect_state } from '@/designApplication/store/collect';
import { inchToPx, printAreaToImageRatio } from '@/designApplication/store/util';
import { prod_actions, prod_getters, prod_mutations } from '@/designApplication/store/prod';
import { image_actions } from '@/designApplication/store/image';

/**
 * designApplication store
 * @class State
 * @property {Config} config 配置
 * @property {boolean} loading_save 是否正在保存产品
 * @property {boolean} loading_prod 是否正在加载产品
 * @property {boolean} loading_price 是否正在加载价格
 * @property {boolean} loading_2d 是否正在加载2d canvas
 * @property {boolean} loading_3d 是否正在加载3d three
 * @property {number|null} activeColorId 选中的颜色
 * @property {string|null} activeSizeId 选中的尺码
 * @property {number|null} activeViewId 选中的视图
 * @property {number|null} activeType 1-通用产品 2-精细产品
 * @property {ProdStore} prodStore 产品仓库
 * @property {boolean} visible_layer 图层列表开关
 * */
const state = {
  config: new Config(),
  show3d: false,
  loading_save: false,
  loading_price: false,
  loading_prod: false,
  loading_2d: false,
  loading_3d: false,
  activeColorId: null,
  activeSizeId: null,
  activeViewId: null,
  activeType: null,
  prodStore: new ProdStore(),

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
  // 历史设计记录
  ...state_history,
  // 收藏产品
  ...collect_state,
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
    ...state,
  },
  getters: {
    // 产品
    ...prod_getters,
    // 历史设计记录
    ...getters_history,
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
