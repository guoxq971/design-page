import { loadModel } from '../utils/loadModel';
import { ModelItem } from '../interface/modelItem';
import { getViewList } from './getViewList';

/**
 * 加载3d数据(new ModelItem)
 * @param {ProdItem} prod 产品数据
 * @param {object} config3d 3d配置数据
 * @returns {Promise<ModelItem>}
 * */
export async function loadModelItem(prod, config3d) {
  // const path = prod.prod3d.glbPath;
  const path = './XXS.glb';

  // 加载模型
  const { model, meshList } = await loadModel(path);

  // 初始化模型数据
  const modelItem = new ModelItem();
  modelItem.config = config3d;
  modelItem.model = model;
  modelItem.prod = prod;
  modelItem.viewList = getViewList(prod, meshList, config3d);

  return modelItem;
}
