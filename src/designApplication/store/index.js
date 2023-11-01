import { ProdStore } from '@/designApplication/store/prodStore';
import { ProdItem, ProdType, ProdUtil } from '@/designApplication/interface/prodItem';
import { Config } from '@/designApplication/core/config';
import { loadCanvas } from '@/designApplication/core/canvas/loadCanvas';
import { loadThree } from '@/designApplication/core/three/loadThree';
import { gerRefineProdConfig3dByTemplateNoWithSizeApi, getProd3dConfigByCommonApi, getProd3dConfigByRefineListApi, getRefineProdDetailByTemplateNoWithSizeApi } from '@/designApplication/apis/common';
import { config3dUtil } from '@/designApplication/interface/Config3d/config3dOfCommonResponse';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { Message } from 'element-ui';
import store from '@/store';
import { loadImage } from '@/designApplication/core/utils/loadImage';
import { getProdPriceApi } from '@/designApplication/apis/prod';

/**
 * designApplication store
 * @class State
 * @property {Config} config 配置
 * @property {boolean} loading_prod 是否正在加载产品
 * @property {boolean} loading_price 是否正在加载价格
 * @property {boolean} loading_2d 是否正在加载2d canvas
 * @property {boolean} loading_3d 是否正在加载3d three
 * @property {number|null} activeColorId 选中的颜色
 * @property {string|null} activeSizeId 选中的尺码
 * @property {number|null} activeViewId 选中的视图
 * @property {number|null} activeType 1-通用产品 2-精细产品
 * @property {ProdStore} prodStore 产品仓库
 * */
class State {
  config = new Config();
  show3d = false;
  loading_price = false;
  loading_prod = false;
  loading_2d = false;
  loading_3d = false;
  activeColorId = null;
  activeSizeId = null;
  activeViewId = null;
  activeType = null;
  prodStore = new ProdStore();
}

// 产品相关的getters
const gettersProd = {
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

// 产品相关的mutations
const mutationsProd = {
  setLoadingPrice(state, loading) {
    state.loading_price = loading;
  },
  setShow3d(state, flag) {
    state.show3d = flag;
  },
  setLoading2d(state, loading) {
    state.loading_2d = loading;
  },
  setLoading3d(state, loading) {
    state.loading_3d = loading;
  },
  setActiveType(state, type) {
    state.activeType = type;
  },
  setActiveViewId(state, viewId) {
    state.activeViewId = viewId;
  },
  setActiveColorId(state, colorId) {
    state.activeColorId = colorId;
  },
  setActiveSizeId(state, sizeId) {
    state.activeSizeId = sizeId;
  },
};

// 产品相关的actions
const actionsProd = {
  /**
   * 设置尺码id
   * @param {*} vuex context
   * @param {number} sizeId 尺码id
   * */
  setActiveSizeId({ state, commit, dispatch, getters }, sizeId) {
    const curProd = getters.activeProd;

    switch (curProd.type) {
      // 通用产品
      case ProdType.common:
        commit('setActiveSizeId', sizeId);
        break;

      // 精细产品
      case ProdType.refine:
        dispatch('changeProd', { type: ProdType.refine, sizeId: sizeId });
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

    try {
      state.loading_prod = true;
      console.time(`加载产品 - 通用${detail.templateNo}`);

      // 隐藏3d
      commit('setShow3d', false);

      // 清空已有的canvas / three
      state.prodStore.clearAll();
      // await sleep(0);

      // 获取3d配置 - 通用
      const config3d = await getProd3dConfigByCommonApi(detail.templateNo);
      // 初始化产品 - 通用 (并添加到仓库)
      prod = ProdUtil.disposeCommon(detail, config3d);
      state.prodStore.add(prod);

      // 切换的产品和当前产品不一致时，重置激活的颜色、尺码、视图
      commit('setActiveType', prod.type);
      commit('setActiveColorId', prod.colorList[0].id);
      commit('setActiveSizeId', prod.sizeList[0].id);
      commit('setActiveViewId', prod.viewList[0].id);

      // 加载2d canvas
      await loadCanvas();

      console.log('仓库列表', state.prodStore.list);
    } finally {
      state.loading_prod = false;
      console.timeEnd(`加载产品 - 通用${detail.templateNo}`);

      if (prod) {
        // 获取产品价格
        dispatch('setPrice');

        // 加载3d three
        if (config3dUtil.isLoad3d(prod.config3d)) {
          loadThree({ prodItem: prod, loading: true });
        }
        // 获取3d配置 - 精细
        getProd3dConfigByRefineListApi(detail.templateNo).then((refineList) => {
          // 获取3d配置 - 精细 (并添加到仓库)
          const refineListFilter = config3dUtil.getOpenRefineList(refineList);
          refineListFilter.forEach((refine) => {
            const prodItem = ProdUtil.disposeRefine(refine, detail);
            prodItem.isSpecial = prod.isSpecial;
            prodItem.priceList = prod.priceList;
            state.prodStore.add(prodItem);
          });
        });
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
   * */
  async changeProd({ state, commit, dispatch, getters }, param) {
    if (state.loading_prod) {
      Message.warning('模板加载中，请稍后');
    }
    const type = param.type;

    // 当前产品
    const curProdItem = param.prodItem || state.prodStore.get();
    let resultProdItem;

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
          try {
            state.loading_prod = true;
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
          } finally {
            state.loading_prod = false;
          }
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
    }
  },
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
  state: new State(),
  getters: {
    // 产品相关的getters
    ...gettersProd,
    activeView(state) {
      return state.prodStore.getView(state.activeViewId);
    },
  },
  mutations: {
    ...mutationsProd,
  },
  /**
   * actions => 工具(designerUtil) && 操作(actions | operationUtil)
   * */
  actions: {
    ...actionsProd,
    /**
     * 设置价格
     * @param {*} vuex context
     * @returns {Promise<void>}
     */
    async setPrice({ state, commit, dispatch, getters }) {
      let prodItem = getters.activeProd;

      // 获取价格列表
      const priceResult = await getProdPriceApi(prodItem.detail.templateNo);

      state.prodStore.list.forEach((prod) => {
        prodItem.isSpecial = priceResult.isSpecial;
        prodItem.priceList = priceResult.list;
      });
    },
    /**
     * 设置当前激活的设计图id
     * @param {*} vuex context
     * @param {string} uuid 设计图uuid
     * @param {import('@/design').ParseViewItem} view 视图
     */
    setActiveImageUuid({ state, commit, dispatch, getters }, { uuid, view }) {
      view = view || DesignerUtil.getView();
      if (!view) return console.error('获取view失败');
      view.activeImageUuid = uuid;
    },
    /**
     * 选中设计图
     * @param {*} vuex context
     * @param {ImageListByMyImage} detail 设计图详情
     * */
    async setImage({ state, commit, dispatch, getters }, detail) {
      const viewId = store.state.designApplication.activeViewId;
      const view = state.prodStore.getView(viewId);

      /**
       * 静态数据
       * @type {import('@/design').StaticViewItem}
       */
      const staticView = state.prodStore.getStatic()?.viewList.find((e) => e.id === viewId);

      if (!view || !staticView) {
        Message.warning('设计图需要加载到的view获取失败!');
        return;
      }

      // 画布的参数配置
      const canvasWidth = staticView.print.width;
      const canvasHeight = staticView.print.height;

      // 设计图单位转换(原图）
      const inch = inchToPx(detail.size, getters.activeProd.detail.dpi);
      // 设计图与产品dpi的换算
      const result = printAreaToImageRatio(inch, staticView.print);

      // 图片展示的宽高
      const width = result.size.width;
      const height = result.size.height;

      // 加载的远程图片（使用的图片）
      const imageDOM = await loadImage(detail.designImg);

      // 图片在画布展示的比例
      const scaleX = width / imageDOM.width;
      const scaleY = height / imageDOM.height;

      // 图片在画布展示的位置
      const x = canvasWidth / 2 - width / 2 + staticView.offset.x;
      const y = canvasHeight / 2 - height / 2 + staticView.offset.y;

      /**
       * 图片展示的参数
       *@type {import('@/design').AddParamOfImage}
       */
      const param = {
        x,
        y,
        width,
        height,
        scaleX,
        scaleY,
        imageDOM,
        detail,
        view,
        staticView,
        inch,
      };

      await view.canvas.addImage(param);
    },
  },
};

/**
 * px转换为mm
 * @param {number} size 尺寸
 * @param {number} dpi dpi
 * @returns {width:number,height:number} 宽高
 * */
function inchToPx(size, dpi) {
  // const dpi = getters.activeProd.detail.dpi; // 当前产品的dpi
  //全局的
  // px -> mm
  let a = function (size, dpi) {
    return (25.4 * size) / dpi;
  };
  return {
    height: a(size.height, dpi),
    width: a(size.width, dpi),
  };
}

/**
 * 获取图片在打印区域的比例
 * @param {object} imageSize 图片的宽高
 * @param {object} printAreaSize 打印区域的宽高
 * */
function printAreaToImageRatio(imageSize, printAreaSize) {
  // 宽高的比例
  let widthRatio = '';
  let heightRatio = '';
  if (imageSize.width > printAreaSize.width) {
    widthRatio = printAreaSize.width / imageSize.width;
  } else {
    widthRatio = 1;
  }
  if (imageSize.height * widthRatio > printAreaSize.height) {
    heightRatio = printAreaSize.height / (imageSize.height * widthRatio);
  } else {
    heightRatio = 1;
  }
  return {
    widthRatio: widthRatio,
    heightRatio: heightRatio,
    ratio: {
      value: widthRatio * heightRatio,
      width: widthRatio,
      height: heightRatio,
    },
    size: {
      width: imageSize.width * widthRatio * heightRatio,
      height: imageSize.height * widthRatio * heightRatio,
    },
  };
}
