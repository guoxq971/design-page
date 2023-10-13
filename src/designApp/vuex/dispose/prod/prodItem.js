import { ProdItem } from '@/designApplication/interface/prodItem';
import { ParseProdItem } from '@/designApplication/interface/commonProdParse';

/**
 * 获取产品数据 (vuex)
 @param {ParseProdItem} detail 产品详情
 * */
export function getProdItem(detail) {
  const prodItem = new ProdItem();
  Object.assign(prodItem, detail);

  prodItem.activeColor = prodItem.colorList[0];
  prodItem.activeSize = prodItem.sizeList[0];
  prodItem.activeView = prodItem.viewList[0];

  return prodItem;
}
