import { Core } from './core.js';
import store from '@/store';
import { Konva } from '@/designApplication/core/canvas/konva';

/**
 * 3d模型
 * @class MyThree
 * @extends Core
 * @param {object} _param 参数
 * @param {string} _param.id 容器id
 * */
export class MyThree extends Core {
  model = null;
  meshList = [];
  meshPlusList = [];

  constructor(_param) {
    const param = {
      id: '',
    };
    Object.assign(param, _param);
    super(param.id);
  }

  /**
   * 获取模型的mesh列表
   * @returns {three.mesh[]} mesh列表
   * */
  getMaterialList() {
    return this.meshList.filter(Boolean);
  }

  /**
   * 根据材质名称获取 meshItem
   * @param {string} materialName 材质名称
   * @returns {meshItem|undefined} meshItem
   * */
  getMeshItemByMaterialName(materialName) {
    return this.meshPlusList.find((e) => e.mesh.name === materialName);
  }

  /**
   * 根据材质名称获取view
   * @param {string} materialName 材质名称
   * @returns {ParseViewItem|undefined} view
   * */
  getViewByMaterialName(materialName) {
    return this.getMeshItemByMaterialName(materialName)?.view;
  }

  /**
   * 开启canvas的自定义鼠标事件
   * */
  openCustomMouse() {
    Konva.konvaCustomMouse = true;
  }

  /**
   * 关闭canvas的自定义鼠标事件
   * */
  closeCustomMouse() {
    Konva.konvaCustomMouse = false;
  }

  /**
   * 所有设计图是否有一个是选中的
   * */
  isAnyDesignSelected() {
    return this.meshPlusList.some((e) => e.view?.canvas.hasSelected());
  }

  /**
   * 退出所有设计图的选中状态
   * */
  exitAllDesignSelected() {
    this.meshPlusList.forEach((e) => e.view?.canvas.hideAllTransformer());
  }

  /**
   * 模型与canvas的鼠标位置映射
   * @param {string} materialName 材质名称
   * @param {uv} uv uv坐标
   * @param {MouseEvent} event 事件对象
   * */
  setPos(materialName, uv, event) {
    const typeArr = ['mousedown', 'mouseup', 'mousemove'];
    if (!typeArr.includes(event?.type)) {
      return;
    }

    // canvas, texture
    const { canvas, mesh, view } = this.meshPlusList.find((e) => e.mesh.name === materialName);
    if (!canvas || !mesh || !view) {
      console.log('setPos error');
      return;
    }
    const evt = event;
    if (evt) {
      // 映射到画布的坐标
      const rect = canvas.getBoundingClientRect();
      const left = rect.left + rect.width;
      const top = rect.top + rect.height;
      const width = store.state.designApplication.config.canvasSize.width;
      const height = store.state.designApplication.config.canvasSize.height;
      const xCross = uv.x * width + left;
      const yCross = uv.y * height + top;

      const event = new MouseEvent(evt.type, {
        bubbles: true, // 是否冒泡
        clientX: xCross,
        clientY: yCross,
      });

      // 模拟鼠标事件在canvas上触发(为了触发选中设计图,konva是鼠标抬起才会触发选中设计图)
      if (evt.type === 'mousedown') {
        const event2 = new MouseEvent('mouseup', {
          bubbles: true, // 是否冒泡
          clientX: xCross,
          clientY: yCross,
        });
        canvas.dispatchEvent(event);
        canvas.dispatchEvent(event2);
      }

      canvas.dispatchEvent(event);
    }
  }
}
