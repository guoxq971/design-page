import { ProdColorItem, ProdSizeItem, ProdStoreItem, ProdType, ProdViewItem, ProdViewPrintItem } from '../../interface/prodItem';

/**
 * 获取尺码列表
 * @param {Array} sizeList 尺码数据 [接口数据]
 * @returns {Array} 尺码列表
 * */
export function getSizeList(sizeList) {
  return sizeList.map((e) => {
    const sizeItem = new ProdSizeItem();
    sizeItem.id = e.id;
    sizeItem.name = e.name;
    sizeItem.size = e.name;
    sizeItem.sizeType = e.sizeType;
    return sizeItem;
  });
}

/**
 * 获取颜色列表
 * @param {Array} colorList 颜色数据 [接口数据]
 * @returns {Array} 颜色列表
 * */
export function getColorList(colorList) {
  return colorList.map((e) => {
    const colorItem = new ProdColorItem();
    colorItem.id = e.id;
    colorItem.name = e.name;
    colorItem.colorCode = e.colors[0].value;
    colorItem.viewList = e.views;
    colorItem.multiAngleImages = e.multiAngleImages;
    colorItem.multiAngleImages4Compose = e.multiAngleImages4Compose;
    return colorItem;
  });
}

/**
 * 获取视图列表
 * @param {Array} viewList 视图数据 [接口数据]
 * @param {Array} printAreas 打印区域数据 [接口数据]
 * @param {Array} pointoutPrintAreas 指定打印区域数据 [接口数据]
 * @returns {Array} 视图列表
 */
export function getViewList(viewList, printAreas, pointoutPrintAreas) {
  const printList = getPrintList(printAreas, pointoutPrintAreas);
  return viewList.map((view) => {
    const viewItem = new ProdViewItem();
    viewItem.id = view.id;
    viewItem.name = view.name;
    viewItem.pint = printList.find((item) => item.id === view.id);
    return viewItem;
  });
}

/**
 * 获取打印区域列表
 * @param {Array} printAreas 打印区域数据 [接口数据]
 * @param {Array} pointoutPrintAreas 指定打印区域数据 [接口数据]
 * */
function getPrintList(printAreas, pointoutPrintAreas) {
  const list = [];
  for (let i = 0; i < printAreas.length; i++) {
    const printArea = printAreas[i];
    const pointoutPrintArea = pointoutPrintAreas[i];

    const printItem = new ProdViewPrintItem();
    printItem.id = printArea.id;
    printItem.size = printArea.boundary.size;
    if (Object.keys(printArea.boundary.soft).length) {
      printItem.previewPathD = printArea.boundary?.soft?.content?.svg?.path?.d;
    }
    printItem.editPathD = pointoutPrintArea.soft.d;
    printItem.v = pointoutPrintArea.soft.v; // 虚线,车线(path.d)

    // TODO: 这里应该还有 print 信息 [尺码, 偏移量, 设计区域...]
    list.push(printItem);
  }
  return list;
}

/**
 * 获取仓库对象
 * @param {Object} prodItem 产品数据 [new ProdItem()]
 * @param {number} type 类型 [ProdType.common|ProdType.fine]
 * @returns {Object} 仓库对象 [new ProdStoreItem()]
 * */
export function getProdStoreItem(prodItem, type = ProdType.common) {
  const prodStoreItem = new ProdStoreItem();
  prodStoreItem.type = type;
  prodStoreItem.colorList = prodItem.colorList;
  prodStoreItem.viewList = prodItem.viewList;
  return prodStoreItem;
}
