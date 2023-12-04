import { ProdType } from '@/designApplication/interface/prodItem';
import store from '@/store';
import { disposeThree } from '@/designApplication/core/utils/clearThree';
import { Config } from '@/designApplication/core/config';
import { config3dUtil } from '@/designApplication/interface/Config3d/config3dOfCommonResponse';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';

export class DesignType {
  static bgc = canvasDefine.bgc;
  static text = canvasDefine.text;
  static image = canvasDefine.image;

  static getLabel(type) {
    switch (type) {
      case this.bgc:
        return '背景色';
      case this.text:
        return '文字';
      case this.image:
        return '图片';
      default:
        return '';
    }
  }
}

/**
 * 设计器工具类
 * @class DesignerUtil
 * @method getProdItem 获取产品
 * */
export class DesignerUtil {
  static config3dUtil = config3dUtil;
  static DesignType = DesignType;

  /**
   * 获取当前激活产品的静态数据
   * @returns {import('@/design').ActiveStaticProdData} 静态数据
   */
  static getActiveProdStatic() {
    return store.getters['designApplication/activeProdStatic'];
  }

  /**
   * 当前产品是否是收藏产品
   * @param {import('@/design').ProdListDataItem} prod 产品
   * @returns {boolean|import('@/design').ProdListDataItem} 是否是收藏产品
   */
  static hasCollectProd(prod) {
    const result = store.state.designApplication.collectProdList.find((e) => e.id === prod.id);
    if (result) {
      return result;
    }

    return false;
  }

  /**
   * 当前产品是否是收藏设计图
   * @param {import('@/design').ImageListItem} image 设计图
   * @returns {boolean|import('@/design').ImageListItem} 是否是收藏产品
   */
  static hasCollectImage(image) {
    const detail = image;
    let collectImageList = [];
    if (detail.isBg) {
      collectImageList = store.state.designApplication.collectBgImageList;
    } else {
      collectImageList = store.state.designApplication.collectImageList;
    }

    let id = '';
    // detail.quickimgid 有值就是从 收藏列表 进来的
    if (detail.quickimgid) {
      id = detail.seqId;
    } else {
      id = detail.id;
    }

    const result = collectImageList.find((e) => e.seqId === id);
    if (result) {
      return result;
    }
    return false;
  }

  /**
   * 隐藏所有的选中框
   * @param {import('@/design').ProdItemData | null} prodItem
   * @param {Konva.Transformer|Konva.Image|null} ignore 忽略的类型
   *
   * */
  static hideAllTransformer(prodItem = null, ignore = null) {
    prodItem = prodItem || this.getActiveProd();
    for (let view of prodItem.viewList) {
      view.canvas.hideAllTransformer(null, ignore);
    }
  }

  /**
   * 获取view
   * @param {string|null} viewId 视图id
   * @param {import('@/design').ProdItemData | null} prodItem
   * @returns {import('@/design').ParseViewItem} 视图
   * */
  static getView(viewId = null, prodItem = null) {
    return store.state.designApplication.prodStore.getView(viewId, prodItem);
  }

  /**
   * 获取staticView
   * @param {string|null} viewId 视图id
   * @param {import('@/design').ProdItemData | null} prodItem
   * @returns {import('@/design').StaticViewItem} 视图
   * */
  static getStaticView(viewId = null, prodItem = null) {
    viewId = viewId || store.state.designApplication.activeViewId;
    const view = store.state.designApplication.prodStore.getView(viewId);

    /**
     * 静态数据
     * @type {import('@/design').StaticViewItem}
     * @returns {Promise<Konva.Image>}
     */
    const staticView = store.state.designApplication.prodStore.getStatic()?.viewList.find((e) => e.id == viewId);

    return staticView;
  }

  /**
   * 获取canvas配置
   * @returns {Config} 配置
   * */
  static getVuexConfig() {
    return store.state.designApplication.config;
  }

  /**
   * 背景色 - 设置
   * @param {string} color 颜色
   * @param {import('@/design').ProdItemData | null} prodItem
   * */
  static setBgc(color, prodItem = null) {
    prodItem = prodItem || this.getActiveProd();
    for (let view of prodItem.viewList) {
      if (view.canvas) {
        view.canvas.addBgc({ color });
      }
    }
  }

  /**
   * 背景色 - 移除
   * @param {import('@/design').ProdItemData | null} prodItem
   * */
  static removeBgc(prodItem = null) {
    prodItem = prodItem || this.getActiveProd();
    for (let view of prodItem.viewList) {
      if (view.canvas) {
        // 移除背景色
        view.canvas.getImageList().forEach((e) => {
          if (e.attrs.name === canvasDefine.bgc) {
            e.attrs.remove();
          }
        });
      }
    }
  }

  /**
   * 背景色 - 置底
   * @param {import('@/design').ProdItemData | null} prodItem
   * */
  static moveBottomBgc(prodItem = null) {
    prodItem = prodItem || this.getActiveProd();
    for (let view of prodItem.viewList) {
      if (view.canvas) {
        view.canvas.getImageList().forEach((e) => {
          if (e.attrs.name === canvasDefine.bgc) {
            e.moveToBottom();
          }
        });
      }
    }
  }

  /**
   * 背景色 - 显示隐藏
   * @param {import('@/design').ProdItemData | null} prodItem
   * */
  static visibleBgc(prodItem = null) {
    prodItem = prodItem || this.getActiveProd();
    for (let view of prodItem.viewList) {
      if (view.canvas) {
        view.canvas.getImageList().forEach((e) => {
          if (e.attrs.name === canvasDefine.bgc) {
            e.attrs.visibleFn();
          }
        });
      }
    }
  }

  /**
   * 是否是玻璃材质
   * @param {string} colorCode 颜色编码
   * */
  static hasGlass(colorCode) {
    return colorCode === '';
  }

  /**
   * 获取产品配置
   * @param {colorId:string, viewId:string|number ,sizeId:string|number} param 参数
   * @param {import('@/design').ProdItemData | null} prodItem 产品
   * @returns {object} 配置
   * */
  static getConfig(param = {}, prodItem = null) {
    param = Object.assign(
      {
        colorId: store.state.designApplication.activeColorId,
        viewId: store.state.designApplication.activeViewId,
        sizeId: store.state.designApplication.activeSizeId,
      },
      param,
    );

    prodItem = prodItem || this.getActiveProd();

    if (!prodItem) {
      console.error('获取产品配置 prodItem is null');
      return;
    }

    // colorId 获取对应颜色的id
    const colorId = param.colorId;

    // 获取 colorId 对应的 2d配置;
    const colorConfig2d = prodItem.colorList.find((e) => e.id === colorId);

    // 获取 colorId 对应的 3d配置;
    const colorConfig3d = prodItem.config3d.colorList.find((e) => e.colorName === colorConfig2d.name);

    /**
     * 根据viewId获取颜色
     * @param {string} viewId 视图id
     * @returns {object} 颜色
     * */
    function get3dColorItemByViewId(viewId) {
      return colorConfig3d.list.find((e) => e.viewId == viewId);
    }
    /**
     * 根据materialName获取颜色
     * @param {string} materialName 材质名称
     * @returns {object} 颜色
     * */
    function get3dColorItemByMaterialName(materialName) {
      return colorConfig3d?.list.find((e) => e.materialName == materialName);
    }

    return {
      colorConfig2d,
      colorConfig3d,
      colorId,
      get3dColorItemByViewId,
      get3dColorItemByMaterialName,
    };
  }

  /**
   * 清除指定产品的canvas / three
   * @param {import('@/design').ProdItemData} prodItem 产品
   * */
  static clearProd(prodItem) {
    // 清除three
    clearThree(prodItem);

    // 清除canvas
    for (let view of prodItem.viewList) {
      clearCanvas(view);
    }
  }

  /**
   * 获取产品类型名称
   * @param {ProdType} type 产品类型
   * @returns {string} 产品类型名称
   * */
  static getProdTypeName(type = null) {
    if (type === null) type = this.getActiveProd()?.type;

    switch (type) {
      case ProdType.common:
        return '通用产品';
      case ProdType.refine:
        return '精细产品';
      default:
        return '';
    }
  }

  /**
   * 获取当前激活的产品
   * @returns {import('@/design').ProdItemData} 当前激活的产品
   * */
  static getActiveProd() {
    return store.getters['designApplication/activeProd'];
  }
}

/**
 * 清除three
 * @param {import('@/design').ProdItemData} prodItem 产品
 * */
export function clearThree(prodItem) {
  if (prodItem.three) {
    prodItem.three.destroy();
    disposeThree(prodItem.three);
    prodItem.three = null;
  }
}

/**
 * 清空canvas
 * @param {import('@/design').ParseViewItem} view 视图
 * */
export function clearCanvas(view) {
  view.canvas?.stage.destroy();
  view.canvas = null;
}
