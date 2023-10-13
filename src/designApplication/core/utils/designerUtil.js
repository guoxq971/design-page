import { ProdType } from '@/designApplication/interface/prodItem';
import store from '@/store';
import { disposeThree } from '@/designApplication/core/utils/clearThree';

/**
 * 设计器工具类
 * @class DesignerUtil
 * @property {ProdType} prodType 产品类型
 * @method getProdItem 获取产品
 * */
export class DesignerUtil {
  static prodType = ProdType;

  /**
   * 显示/隐藏 3d
   * @param {boolean|null} isShow 是否显示
   * */
  static showThree(isShow = null) {
    if (isShow === null) isShow = !store.state.designApplication.show3d;
    store.commit('designApplication/setShow3d', isShow);
  }

  /**
   * 清除指定产品的canvas / three
   * @param {ProdItem} prodItem 产品
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
   * @returns {ProdItem} 当前激活的产品
   * */
  static getActiveProd() {
    return store.state.designApplication.prodStore.get();
  }

  /**
   * 判断传入的颜色id在prodItem中是否存在
   * @param {string|number|null} colorId 颜色id
   * @param {ProdItem} prodItem 产品
   * */
  static hasColor(colorId, prodItem) {
    return prodItem.colorList.some((e) => e.id === colorId);
  }

  /**
   * 判断传入的尺码id在prodItem中是否存在
   * @param {string|number|null} sizeId 尺码id
   * @param {ProdItem} prodItem 产品
   */
  static hasSize(sizeId, prodItem) {
    return prodItem.sizeList.some((e) => e.id === sizeId);
  }

  static getProdItem() {}
}

/**
 * 清除three
 * @param {ProdItem} prodItem 产品
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
 * @param {ParseViewItem} view 视图
 * */
export function clearCanvas(view) {
  view.canvas?.stage.destroy();
  view.canvas = null;
}
