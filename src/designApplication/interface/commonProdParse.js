import { UseProdDetail } from '@/designApplication/interface/commonProd';

/**
 * 产品解析后的数据
 * @class
 * @property {ParseViewItem[]} viewList 视图列表
 * @property {ParsePrintItem[]} printList 印刷区域列表
 * @property {ParseColorItem[]} colorList 颜色列表
 * @property {ParseSizeItem[]} sizeList 尺码列表
 * @property {ParseSizeItem[]} printoutList 印刷指定区域列表
 * @property {boolean} isActive 是否选中
 * @property {ProdItemDetail} detail 通用产品的产品解析
 * @property {ShowImage} showImage 展示用的数据
 * */
export class ParseProdItem extends UseProdDetail {
  viewList = []; // 视图
  printList = []; // 印刷区域
  colorList = []; // 颜色
  sizeList = []; // 尺码
  printoutList = []; // 指定印刷区域

  // 自定义字段 --start
  isActive = false; // 是否选中
  detail; // new CommonProdItem()
  showImage; // 展示用的数据 Object
  // 自定义字段 --end
}

/**
 * 展示用的数据
 * @class
 * @property {string} image 图片
 * @property {string} texture 纹理
 * @property {string} thumbImg 缩略图
 * */
export class ShowImage {
  image;
  texture;
  thumbImg;
}
