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
   * 设置背景色
   * */
  static setBgc(color, prodItem = null) {
    prodItem = prodItem || this.getActiveProd();
    for (let view of prodItem.viewList) {
      if (view.canvas) {
        view.canvas.setBgc(color);
      }
    }
  }

  /**
   * 移除背景色
   * */
  static removeBgc(prodItem = null) {
    prodItem = prodItem || this.getActiveProd();
    for (let view of prodItem.viewList) {
      if (view.canvas) {
        view.canvas.getImageList().forEach((e) => {
          if (e.attrs.name === 'bgc') {
            e.attrs.remove();
          }
        });
      }
    }
  }

  /**
   * 是否是玻璃材质
   * @param {String} colorCode 颜色编码
   * */
  static hasGlass(colorCode) {
    return colorCode === '';
  }

  /**
   * 获取产品配置
   * @param {Object} param 参数
   * @param {ProdItem|null} prodItem 产品
   * @returns {Object} 配置
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

    // colorId 获取对应颜色的id
    const colorId = param.colorId;

    // 获取 colorId 对应的 2d配置;
    const colorConfig2d = prodItem.colorList.find((e) => e.id === colorId);

    // 获取 colorId 对应的 3d配置;
    const colorConfig3d = prodItem.config3d.colorList.find((e) => e.colorName === colorConfig2d.name);

    /**
     * 根据viewId获取颜色
     * @param {String} viewId 视图id
     * @returns {Object} 颜色
     * */
    function get3dColorItemByViewId(viewId) {
      return colorConfig3d.list.find((e) => e.viewId == viewId);
    }
    /**
     * 根据materialName获取颜色
     * @param {String} materialName 材质名称
     * @returns {Object} 颜色
     * */
    function get3dColorItemByMaterialName(materialName) {
      return colorConfig3d.list.find((e) => e.materialName == materialName);
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
