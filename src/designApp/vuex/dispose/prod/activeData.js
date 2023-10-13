import { ActiveData, ActiveViewItem } from '@/designApp/vuex/interface/activeData';

/**
 * 获取当前激活的数据
 * @param {ProdItem} prod vuex state.prod
 * @returns {ActiveData} 当前激活的数据
 * */
export function getActiveData(prod) {
  const activeColor = prod.activeColor;
  const activeSize = prod.activeSize;
  const activeView = prod.activeView;
  const printoutList = prod.printoutList;
  const printList = prod.printList;

  const activeData = new ActiveData();
  activeData.viewList = [];

  for (const view of prod.viewList) {
    const color = activeColor.views.find((e) => e.id === view.id);
    const printout = printoutList.find((e) => e.id === view.id);
    const print = printList.find((e) => e.id === view.id);

    const activeViewItem = new ActiveViewItem();
    activeViewItem.id = view.id;
    activeViewItem.name = view.name;
    activeViewItem.prod = color.thumbImg;
    activeViewItem.bg = color.texture;
    activeViewItem.offset = view.offset; //绘制区域的偏移量
    activeViewItem.printout = printout; // 中间红色的车线 v
    activeViewItem.print = print; // 物体描边 d

    activeData.viewList.push(activeViewItem);
  }
  return activeData;
}

/**
 * 获取view
 * @returns {ActiveViewItem} 当前激活的view
 * */
function getActiveView() {}
