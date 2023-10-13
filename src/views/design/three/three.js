import { Core } from './core.js';
import { setPosition } from '@/views/design/three/utils/setPosition';

export class MyThree extends Core {
  // 是否按下 (光线投射使用)
  isDown = false;
  // 模型列表
  modelList = [];
  // 当前激活模型
  activeModel = null;

  constructor() {
    super();
  }

  /**
   * 获取模型的mesh列表
   * @returns {Array} mesh列表
   * */
  getMaterialList() {
    if (!this.activeModel) return [];
    return this.activeModel.viewList.map((e) => e.mesh).filter(Boolean);
  }

  /**
   * 设置位置
   * @param {string} materialName 材质名称
   * @param {uv} uv uv坐标
   * @param {MouseEvent} event 事件对象
   * */
  setPos(materialName, uv, event) {
    const modelView = this.getModelViewItem(materialName);
    if (!modelView && !modelView.prodView) return;

    // 设置位置
    setPosition(event, uv, modelView.prodView.fabricCanvas, modelView.mesh.material.map);

    // 设置当前激活的视图
    this.activeModel.prod.setActiveView(modelView.prodView);
  }

  /**
   * 获取模型的视图对象
   * @param {string} materialName 材质名称
   * */
  getModelViewItem(materialName) {
    if (!this.activeModel) return;
    return this.activeModel.viewList.find((e) => e.viewConfig.materialName === materialName);
  }

  /**
   * 设置当前激活的模型
   * @param {object} model 模型对象
   * */
  setActiveModel(model) {
    this.activeModel = model;
  }
}
