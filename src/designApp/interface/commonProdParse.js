import { UseCommonProd } from '@/designApp/interface/commonProd';

/**
 * 产品详情(解析后)
 * @class
 * @property {Array<any>} colorList 颜色
 * @property {Array<any>} viewList 视图
 * @property {Array<any>} sizeList 尺码
 * @property {Array<any>} printList 印刷区域
 * @property {Array<any>} printoutList 指定印刷区域
 * @property {boolean} isActive 是否选中
 * @property {ProdItemDetail} detail 产品详情
 * @property {ShowImage} showImage 展示用的数据
 * */
export class CommonProdItemParse extends UseCommonProd {
  colorList = []; // 颜色
  viewList = []; // 视图
  sizeList = []; // 尺码
  printList = []; // 印刷区域
  printoutList = []; // 指定印刷区域

  // 自定义字段 --start
  isActive = false; // 是否选中
  detail; // new CommonProdItem()
  showImage; // 展示用的数据 Object
  // 自定义字段 --end
}
