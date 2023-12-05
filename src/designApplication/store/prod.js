import { Message } from 'element-ui';
import { ProdItem, ProdType, ProdUtil } from '@/designApplication/interface/prodItem';
import { config3dUtil } from '@/designApplication/interface/Config3d/config3dOfCommonResponse';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

import { cloneDeep } from 'lodash';
import { loadCanvas } from '@/designApplication/core/canvas/loadCanvas';
import { loadThree } from '@/designApplication/core/three/loadThree';

import { getProdPriceApi } from '@/designApplication/apis/prod';
import { gerRefineProdConfig3dByTemplateNoWithSizeApi, getProd3dConfigByCommonApi, getProd3dConfigByRefineListApi, getRefineProdDetailByTemplateNoWithSizeApi } from '@/designApplication/apis/common';
import { Config } from '@/designApplication/core/config';
import { ProdStore } from '@/designApplication/store/prodStore';
import { isTemplateCanUse } from '@/designApplication/store/util';
import { restoreImageList, supplementImageList } from '@/designApplication/core/canvas_2/konvaCanvasAddHelp';
import { useQueue } from '@/designApplication/core/utils/useQueue';

export const prod_state = {
  isSupplement: true, //是否补充
  config: new Config(),
  show3d: false, //是否展示3d
  loading_save: false, //保存loading
  loading_price: false, //价格loading
  loading_prod: false, //产品loading
  loading_2d: false, //2d加载loading
  loading_3d: false, //3d加载loading
  activeColorId: null, //当前激活的颜色id
  activeSizeId: null, //当前激活的尺码id
  activeViewId: null, //当前激活的视图id
  activeType: null, //当前激活的产品类型
  prodStore: new ProdStore(), //产品仓库
};

export const prod_getters = {
  /**
   * 获取激活的视图
   * @param state
   * @returns {import('@/design').ParseViewItem|null}
   */
  activeView(state) {
    return state.prodStore.getView(state.activeViewId);
  },
  /**
   * 获取激活产品的静态资源数据 (改数据不能用来修改)
   * @returns {import('@/design').ActiveStaticProdData|null} 当前激活的产品的静态资源数据
   * */
  activeProdStatic(state) {
    return state.prodStore.getStatic();
  },
  /**
   * 获取激活产品
   * @returns {import('@/design').ProdItemData} 当前激活的产品
   * */
  activeProd(state) {
    return state.prodStore.get();
  },
  /**
   * 展示的尺码列表 SizeList
   * @returns {Array<any>} 展示的尺码列表
   * */
  activeSizeList(state, getters) {
    let sizeList;

    switch (getters.activeProdStatic.prod.type) {
      // 通用产品
      case ProdType.common:
        sizeList = getters.activeProdStatic.prod.sizeList;
        break;
      // 精细产品
      case ProdType.refine:
        const refineSizeIdList = state.prodStore.list.filter((e) => e.type === ProdType.refine).map((e) => e.sizeId);
        sizeList = getters.activeProdStatic.prod.sizeList.filter((e) => refineSizeIdList.includes(e.id));
        break;
    }

    return sizeList;
  },
};
export const prod_mutations = {
  // 图层列表开关
  setVisibleLayer(state, visible) {
    state.visible_layer = visible;
  },
  // 产品价格接口 loading
  setLoadingPrice(state, loading) {
    state.loading_price = loading;
  },
  // 产品的3d开关
  setShow3d(state, flag) {
    state.show3d = flag;
  },
  // 产品2d 加载 loading
  setLoading2d(state, loading) {
    state.loading_2d = loading;
  },
  // 产品3d 加载 loading
  setLoading3d(state, loading) {
    state.loading_3d = loading;
  },
  // 产品 当前的 type
  setActiveType(state, type) {
    state.activeType = type;
  },
  // 产品 当前激活的视图id
  setActiveViewId(state, viewId) {
    state.activeViewId = viewId;
  },
  // 产品 当前激活的颜色id
  setActiveColorId(state, colorId) {
    state.activeColorId = colorId;
  },
  // 产品 当前激活的尺码id
  setActiveSizeId(state, sizeId) {
    state.activeSizeId = sizeId;
  },
};

export const prod_actions = {
  /**
   * 获取精细配置
   * @param {*} vuex context
   * @param {import('@/design').ProdListDataItem} prod 产品详情
   * @returns {Promise<import('@/design').ProdItem[]>} 精细产品列表
   */
  async getRefineConfig({ state, commit, dispatch, getters }, prod) {
    const templateNo = prod.detail.templateNo;
    const detail = prod.detail;

    const refineList = await getProd3dConfigByRefineListApi(templateNo);
    // 获取3d配置 - 精细 (并添加到仓库)
    const refineListFilter = config3dUtil.getOpenRefineList(refineList);

    const resultList = [];
    for (let refine of refineListFilter) {
      // 模板是关闭的, 跳过
      if (!isTemplateCanUse(refine)) continue;

      const prodItem = ProdUtil.disposeRefine(refine, detail);
      prodItem.isSpecial = prod.isSpecial;
      prodItem.priceList = prod.priceList;
      state.prodStore.add(prodItem);
      resultList.push(prodItem);
    }

    return Promise.resolve(resultList);
  },
  /**
   * 设置产品价格
   * @param {*} vuex context
   * @param {import('@/design').ProdListDataItem} prodItem 产品详情
   * @returns {Promise<void>}
   */
  async setPrice({ state, commit, dispatch, getters }, prodItem) {
    prodItem = prodItem || getters.activeProd;

    // 获取价格列表
    const priceResult = await getProdPriceApi(prodItem.detail.templateNo);

    // 给该产品的所有尺码设置价格
    state.prodStore.list.forEach((prod) => {
      prodItem.isSpecial = priceResult.isSpecial;
      prodItem.priceList = priceResult.list;
    });
  },
  /**
   * 设置尺码id
   * @param {*} vuex context
   * @param {number} sizeId 尺码id
   * */
  async setActiveSizeId({ state, commit, dispatch, getters }, sizeId) {
    const curProd = getters.activeProd;

    switch (curProd.type) {
      // 通用产品
      case ProdType.common:
        commit('setActiveSizeId', sizeId);
        break;

      // 精细产品
      case ProdType.refine:
        await dispatch('changeProd', { type: ProdType.refine, sizeId: sizeId });
        break;

      default:
        break;
    }
  },
  /**
   * 设置激活产品 (这个方法只会在切换模板号的时候调用)
   * @param {*} vuex context
   * @param {import('@/design').ProdListDataItem} detail 产品详情
   * @returns {ProdItem} 当前激活的产品
   * */
  async setProd({ state, commit, dispatch, getters }, detail) {
    if (state.loading_prod) {
      Message.warning('模板加载中，请稍后');
      return;
    }

    let prod;
    // 通用模板2d是否开启
    let isCommonOpen2d;
    // 产品详情
    detail = cloneDeep(detail);

    try {
      state.loading_prod = true;

      // 隐藏3d
      commit('setShow3d', false);

      // 清空已有的canvas / three
      state.prodStore.clearAll();

      // 获取3d配置 - 通用
      const config3d = await getProd3dConfigByCommonApi(detail.templateNo);
      // 初始化产品 - 通用 (并添加到仓库)
      prod = ProdUtil.disposeCommon(detail, config3d);

      // 通用模板2d是否开启
      isCommonOpen2d = isTemplateCanUse(config3d);

      state.prodStore.add(prod);
      // 切换的产品和当前产品不一致时，重置激活的颜色、尺码、视图
      commit('setActiveType', prod.type);
      commit('setActiveColorId', prod.colorList[0].id);
      commit('setActiveSizeId', prod.sizeList[0].id);
      commit('setActiveViewId', prod.viewList[0].id);

      if (isCommonOpen2d) {
        // 加载2d canvas
        await loadCanvas();
      }

      console.log('仓库列表', state.prodStore.list);
    } finally {
      if (isCommonOpen2d) {
        useQueue().clear();
        state.loading_prod = false;
      }

      if (prod) {
        // 推荐参数
        commit('setVisibleRecommend', true);
        setTimeout(() => commit('setVisibleRecommend', false), 3 * 1000);

        // 获取产品价格 TODO: 需要加权限判断
        dispatch('setPrice');

        // 加载3d three
        if (isCommonOpen2d && config3dUtil.isLoad3d(prod.config3d)) {
          loadThree({ prodItem: prod, loading: true });
        }

        // 获取3d配置 - 精细
        const refineList = await dispatch('getRefineConfig', prod);

        // 通用的2d是关闭的
        if (!isCommonOpen2d) {
          if (refineList.length === 0) {
            Message.warning('该产品的模板已关闭，请联系技术部！');
            state.loading_prod = false;
          } else {
            // 切换到精细模板
            await dispatch('changeProd', { sizeId: refineList[0].sizeId, type: ProdType.refine, force: true });
            Message.warning('该产品的通用模板已关闭，已切换为精细模板');
          }
        }

        // 中间没有切换时，才需要关闭loading
        if (getters.activeProd?.detail.templateNo === prod.detail.templateNo) {
          useQueue().clear();
          state.loading_prod = false;
        }
      }
    }
  },
  /**
   * 切换模板类型
   * @param {*} vuex context
   * @param {object} param 参数
   * @param {ProdItem} param.prodItem 产品(当前产品)
   * @param {ProdType} param.type 模板类型(要切换的类型)
   * @param {number} param.sizeId 尺码id
   * @param {number} param.colorId 颜色id
   * @param {boolean} param.force 强制执行
   * */
  async changeProd({ state, commit, dispatch, getters }, param) {
    if (state.loading_prod && !param.force) {
      Message.warning('模板加载中，请稍后');
    }

    try {
      state.loading_prod = true;
      const type = param.type;

      // 当前产品
      const curProdItem = param.prodItem || state.prodStore.get();
      let resultProdItem;

      // 设计图数据补充
      for (let view of curProdItem.viewList) {
        supplementImageList(view);
      }

      // 当前产品和要切换的产品一致时，不做任何操作
      if (curProdItem.type === type && !param.sizeId) {
        Message.warning(`当前已经是${DesignerUtil.getProdTypeName(type)}模板`);
        return;
      }

      // 要切换的颜色、尺码
      let sizeId = param.sizeId || state.activeSizeId;
      let colorId = param.colorId || state.activeColorId;

      switch (type) {
        // 要切换到通用模板
        case ProdType.common:
          // 通用模板的ProdItem
          const commonProdItem = state.prodStore.get(ProdType.common);

          resultProdItem = commonProdItem;
          break;

        // 要切换到精细模板
        case ProdType.refine:
          let refineProdItem;

          // 精细模板的ProdItem
          refineProdItem = state.prodStore.get(ProdType.refine, sizeId);

          // 可能不存在, 将当前激活的sizeId设置为第一个精细模板的id
          if (!refineProdItem) {
            refineProdItem = state.prodStore.list.find((e) => e.type === ProdType.refine);

            // 如果还是没有, 是错误的
            if (!refineProdItem) {
              Message.warning('精细模板不存在, 请联系管理员');
              return;
            }
          }

          // 如果切换的 精细模板 的产品数据不存在, 则【调用接口获取】
          if (!refineProdItem.detail) {
            const templateNo = refineProdItem.config3d.templateNo;
            const size = refineProdItem.size;

            // 获取产品详情
            const parseProdItem = await getRefineProdDetailByTemplateNoWithSizeApi(templateNo, size);

            // 获取3d配置 (viewList, colorList)
            const config3d = await gerRefineProdConfig3dByTemplateNoWithSizeApi(templateNo, size);

            // 补充产品详情
            refineProdItem.detail = parseProdItem;
            refineProdItem.viewList = parseProdItem.viewList;
            refineProdItem.colorList = parseProdItem.colorList;
            refineProdItem.sizeList = parseProdItem.sizeList;

            // 补充3d配置
            refineProdItem.config3d = config3d;
          }

          // console.log('refineProdItem', refineProdItem);

          sizeId = refineProdItem.sizeId;
          resultProdItem = refineProdItem;
          break;

        // 其他
        default:
          break;
      }

      if (resultProdItem) {
        commit('setShow3d', false);
        // 设置激活之前，先清空已有的canvas / three
        DesignerUtil.clearProd(curProdItem);

        // 如果当前激活的颜色、尺码不在模板中，将当前激活的颜色、尺码设置为第一个的id
        if (!resultProdItem.colorList.some((e) => e.id === colorId)) {
          colorId = resultProdItem.colorList[0].id;
        }
        if (!resultProdItem.sizeList.some((e) => e.id === sizeId)) {
          sizeId = resultProdItem.sizeList[0].id;
        }

        // 设置激活的sizeId
        commit('setActiveSizeId', sizeId);
        // 设置产品类型
        commit('setActiveType', resultProdItem.type);
        // 设置视图id
        commit('setActiveViewId', resultProdItem.viewList[0].id);
        // 设置颜色id
        commit('setActiveColorId', colorId);

        // 加载2d canvas
        await loadCanvas();

        // 加载3d three
        if (config3dUtil.isLoad3d(resultProdItem.config3d)) {
          await loadThree({ prodItem: resultProdItem });
        }

        // 是否有设计图
        for (let view of resultProdItem.viewList) {
          await restoreImageList(view);
        }
      }
    } finally {
      useQueue().clear();
      state.loading_prod = false;
    }
  },
};
