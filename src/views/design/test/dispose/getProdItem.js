import { ProdItem } from '../../interface/prodItem';
import { getColorList, getSizeList, getViewList } from './prodItemUtil';

/**
 * 处理获取产品信息
 * @param {Object} data 产品信息(接口数据)
 * */
export function getProdItem(data) {
  const prodItem = new ProdItem();
  prodItem.detail = data;
  prodItem.sizeList = getSizeList(data.sizes);
  prodItem.colorList = getColorList(data.appearances);
  prodItem.viewList = getViewList(data.views, data.printAreas, data.pointoutPrintAreas);

  prodItem.activeSize = prodItem.sizeList[0];
  prodItem.activeColor = prodItem.colorList[0];
  prodItem.activeView = prodItem.viewList[0];

  return prodItem;
}

/**
 * 初始化产品信息
 * @param {object} data 产品信息(接口数据)
 */
export function initProd(data) {
  return getProdItem(data);
}
