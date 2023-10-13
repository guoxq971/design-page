/**
 * 当前激活的产品的静态资源数据
 * @class ActiveData
 * @property {StaticViewItem[]} viewList 视图列表
 * @property {ProdItem} prod 产品
 * */
export class ActiveData {
  // 视图列表
  viewList = [];
  // 产品
  prod = null;
}

/**
 * 当前激活的产品的view视图的静态资源数据
 * @class StaticViewItem
 * @property {string} id 视图id
 * @property {string} name 视图名称
 * @property {string} prod 视图产品图
 * @property {string} bg 视图背景图
 * @property {ShowImage} showImage 视图产品图
 * @property {object} offset 视图偏移量 {x, y}
 * @property {string|null|undefined} v 中间的车线(红色)
 * @property {object} print 视图打印区域
 * @property {object} printout 视图打印区域
 * */
export class StaticViewItem {
  id; // 视图id
  name; // 视图名称
  prod; // 视图产品图
  showImage; // 视图产品图
  bg; // 视图背景图
  offset; // 视图偏移量 {x, y}
  v; //中间的车线(红色)

  print; // 视图打印区域
  printout; // 视图打印区域
}
