// 产品数据
export class ProdItem {
  detail; // 产品详情-接口数据
  sizeList = []; // 尺码列表 【new ProdSizeItem()】
  colorList = []; // 颜色列表 【new ProdColorItem()】
  viewList = []; // 视图列表 【new ProdViewItem()】
  modelItem; // 3d数据 【new ModelItem()】

  activeColor; // 当前选中颜色
  activeView; // 当前选中视图
  activeSize; // 当前选中尺码

  setActiveView(view) {
    this.activeView = view;
  }
}

export class ProdViewItem {
  id;
  name;
  fabricCanvas;
  print;
}

export class ProdViewPrintItem {
  id;
  size;
  previewPathD;
  previewPathD;
  editPathD;
  v;
}

export class ProdColorItem {
  id;
  name;
  colorCode;
  viewList; // 视图列表 【图片地址(产品\背景图)】
  multiAngleImages; // 多角度数据
  multiAngleImages4Compose; // 多角度数据(复杂)
}

export class ProdSizeItem {
  id;
  name;
  size;
  sizeType;
}

export class ProdStoreItem {
  templateNo; // 模板编号
  type; // 类型 (通用|精细)
  size; // 尺码 【通用为空, 精细为对应尺码】
  prodItem; // 产品信息 【new ProdItem()】
}

export class ProdType {
  static common = 1;
  static fine = 2;
}
