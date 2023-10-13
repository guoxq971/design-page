export class ProdItem2 {
  activeColor; // 激活的颜色
  activeSize; // 激活的尺码
  activeView; // 激活的视图
  prod3d; // 3D对象
  templateNo;
  seqId;
  dpi;
  nameObj;
  colorList;
  showObj;
  sizeList;
  viewList;
  imageList;
  detail;
  constructor(obj) {
    this.templateNo = obj.templateNo; // 模板编号
    this.seqId = obj.seqId; // 主键
    this.dpi = obj.dpi; // 分辨率
    this.nameObj = getName(obj); // 名称
    this.colorList = getColorList(obj.appearances); // 颜色列表
    this.showObj = getShowObj(this.colorList[0]); // 产品列表展示使用
    this.sizeList = getSizeList(obj.sizes); // 尺寸列表
    this.viewList = getViewList(obj); // 视图列表
    this.imageList = []; // 图片列表
    this.detail = obj;

    this.activeSize = this.sizeList[0];
    this.activeColor = this.colorList[0];
    this.activeView = this.viewList[0];
  }

  /**
   * 设置激活的视图
   * @param {Object} view 视图对象
   * */
  setActiveView(view) {
    this.activeView = view;
  }
}

/**
 * 产品列表展示使用
 * @param {Object} obj 颜色列表中的第一个对象
 * @returns {Object} 返回一个对象
 * */
function getShowObj(obj) {
  const view = obj.viewList[0];
  return {
    id: view.id,
    image: view.image,
    name: view.name,
    texture: view.texture,
    thumbImg: view.thumbImg,
  };
}

// 打印区域
class PrintItem {
  constructor(obj, obj2) {
    this.id = obj.id; // 主键
    this.size = obj.boundary.size; // 尺寸(中间车线矩形的宽高)
    this.previewPathD = ''; // 预览模式(clipPath.path.d)
    if (Object.keys(obj.boundary.soft).length) {
      this.previewPathD = obj.boundary?.soft?.content?.svg?.path?.d;
    }
    this.editPathD = obj2.soft.d; // 编辑模式(clipPath.path.d) | 红色边框虚线(矩形,裁缝线)
    // TODO: 黑色印花线 = {width:this.size.width + 2, height:this.size.height + 2}
    this.v = obj2.soft.v; // 虚线,车线(path.d)
  }
}

/**
 * 获取设计区域列表
 * @param {Array} printAreas 设计区域数据
 * @param {Array} pointoutPrintAreas 点阵设计区域数据(外边框, 车线)
 * @returns {Array} 设计区域列表
 * */
function getPrintList(printAreas, pointoutPrintAreas) {
  const list = [];
  for (let i = 0; i < printAreas.length; i++) {
    const printArea = printAreas[i];
    const pointoutPrintArea = pointoutPrintAreas[i];
    list.push(new PrintItem(printArea, pointoutPrintArea));
  }
  return list;
}

// 尺码类型
class SizeItem {
  constructor(obj) {
    this.id = obj.id; // 主键
    this.sizeType = obj.sizeType; // 尺码类型
    this.name = obj.name; // 名称
    this.list = obj.measures; // 尺码列表
  }
}

/**
 * 获取尺码列表
 * @param {Array} sizes 尺码数据
 * @returns {Array} 尺码列表
 * */
function getSizeList(sizes) {
  const list = [];
  for (let size of sizes) {
    list.push(new SizeItem(size));
  }
  return list;
}

// 颜色
class ColorItem {
  constructor(obj) {
    this.id = obj.id; // 主键
    this.name = obj.name; // 名称
    this.colorCode = obj.colors[0].value; // 颜色代码
    this.viewList = obj.views; // 图片地址(产品\背景图)
    this.multiAngleImages = obj.multiAngleImages; // 多角度数据
    this.multiAngleImages4Compose = obj.multiAngleImages4Compose; // 多角度数据(复杂)
  }
}

/**
 * 获取颜色列表
 * @param {Array} appearances 产品数据
 * @returns {Array} 颜色列表
 * */
function getColorList(appearances) {
  const list = [];
  for (let appearance of appearances) {
    list.push(new ColorItem(appearance));
  }
  return list;
}

/**
 * 获取名称
 * @param {Object} obj 产品数据
 * */
function getName(obj) {
  return {
    name: obj.name, // 名称
    cnName: obj.cnName, // 中文名
    shortDescription: obj.shortDescription, // 简介
    templateName: obj.templateName, // 模板名称
    templateNameShow: obj.templateNameShow, // 模板名称展示
  };
}

// 视图
class ViewItem {
  constructor(obj, print) {
    this.id = obj.id; // 主键
    this.name = obj.name; // 名称
    this.size = obj.size; // 尺寸
    this.offset = obj.viewMaps[0].offset; // 偏移量
    this.print = print; // 设计区域
    this.fabricCanvas = null; // fabric对象
  }
}

/**
 * 组装视图数据
 * @param {Object} obj 产品数据
 * @returns {Array} 视图列表
 * */
function getViewList(obj) {
  const views = obj.views; // 视图数据
  const printList = getPrintList(obj.printAreas, obj.pointoutPrintAreas); // 设计区域列表
  const list = [];
  for (let view of views) {
    const print = printList.find((e) => e.id === view.id);
    list.push(new ViewItem(view, print));
  }
  return list;
}
