import store from '@/store';
import { ActiveData, StaticViewItem } from '@/designApplication/interface/activeData';
import { ProdItem, ProdType } from '@/designApplication/interface/prodItem';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

/**
 * 产品仓库
 * @class
 * @property {ProdItem[]} list 产品列表
 * @method add 添加prodItem
 * @method get 获取激活产品(或者指定类型和尺码的产品)
 * @method getView 获取视图
 * @method getStatic 获取激活产品的静态资源数据 (该数据不能用来修改)
 * @method clearAll 清空list
 * @method has 判断两个产品是否相同
 * */
export class ProdStore {
  list = [];

  /**
   * 添加prodItem
   * */
  add(prod) {
    this.list.push(prod);
  }

  /**
   * 清空list, canvas, three
   * */
  clearAll() {
    for (let prodItem of this.list) {
      DesignerUtil.clearProd(prodItem);
    }
    this.list = [];
  }

  /**
   * 获取激活产品
   * @param {number|null} type 产品类型 1-通用产品 2-精细产品
   * @param {null|string} sizeId 尺码id
   * @returns {ProdItem} 当前激活的产品
   * */
  get(type = null, sizeId = null) {
    if (type === null) type = store.state.designApplication.activeType;
    if (sizeId === null) sizeId = store.state.designApplication.activeSizeId;

    // console.log('get 获取激活产品', 'type', type, 'sizeId', sizeId);
    if (type === ProdType.common) {
      return this.list.find((e) => e.type === type);
    } else {
      return this.list.find((e) => e.type === type && e.sizeId === sizeId);
    }
  }

  /**
   * 获取视图
   * @param {number|null} viewId 视图id
   * @param {ProdItem|null} prod 产品
   * @returns {ParseViewItem|null} 视图
   * */
  getView(viewId = null, prod = null) {
    if (!prod) prod = this.get();
    if (!prod) return null;
    if (viewId === null) viewId = store.state.designApplication.activeViewId;
    return prod.viewList.find((e) => e.id === viewId);
  }

  /**
   * 获取激活产品的静态资源数据 (该数据不能用来修改)
   * @param {ProdItem|null} prod 产品
   * @returns {ActiveData|null} 当前激活的产品的静态资源数据
   * */
  getStatic(prod = null) {
    const activeColorId = store.state.designApplication.activeColorId;

    if (!prod) prod = this.get();
    if (!prod) {
      console.error('prodStore.getStatic: prod is null');
      return null;
    }

    const staticData = new ActiveData();

    staticData.prod = prod;

    const activeColor = prod.colorList.find((e) => e.id === activeColorId);
    const printoutList = prod.detail.printoutList;
    const printList = prod.detail.printList;

    for (const view of prod.viewList) {
      const color = activeColor.views.find((e) => e.id === view.id);
      const printout = printoutList.find((e) => e.id === view.id);
      const print = printList.find((e) => e.id === view.id);

      const staticViewItem = new StaticViewItem();
      staticViewItem.id = view.id;
      staticViewItem.name = view.name;
      // staticViewItem.prod = color.thumbImg;
      staticViewItem.prod = color.image;
      staticViewItem.bg = color.texture;
      staticViewItem.showImage = {
        image: color.image,
        texture: color.texture,
        thumbImg: color.thumbImg,
      };
      staticViewItem.offset = view.offset; //绘制区域的偏移量
      staticViewItem.v = printout?.v; // 中间红色的车线 v

      staticViewItem.printout = printout; // 中间红色的车线 v
      staticViewItem.print = print; // 物体描边 d

      staticData.viewList.push(staticViewItem);
    }

    return staticData;
  }

  /**
   * 判断templateNo是否相同
   * @param {ParseProdItem} detail 产品详情
   * @param {ProdItem|null} prod 产品
   * @returns {Boolean} 是否相同 true:相同 false:不相同
   * */
  has(detail, prod = null) {
    if (!prod) prod = this.get();
    return prod?.detail.templateNo === detail.templateNo;
  }
}
