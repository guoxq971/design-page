import { fabric } from '../plugin/fabric';

export class FabricCanvas {
  canvas = null;
  constructor(view) {
    this._init(view);
  }

  _init(view) {
    const id = `myCanvas-${view.id}`;
    // const color = view.modelView.colorConfig.colorCode;
    const color = '#fff';
    // 获取 canvas 元素
    this.canvas = new fabric.Canvas(id);
    this.canvas.backgroundColor = color;
    this._createRect();

    // TODO: 需要根据 prod 的配置，初始化背景的车线等...
  }

  /**
   * 设置背景颜色
   * @param {string} color 颜色
   * */
  setBgColor(color) {
    this.canvas.backgroundColor = color;
    this.canvas.renderAll();
  }

  /**
   * 获取纹理画布
   * */
  getTextureCanvas() {
    return this.canvas.lowerCanvasEl;
  }

  // 监听canvas的鼠标事件
  addEvent(draw) {
    this.canvas.on('mouse:move', () => !fabric.customMouse && draw());
    this.canvas.on('mouse:down', () => !fabric.customMouse && draw());
    this.canvas.on('mouse:up', () => !fabric.customMouse && draw());
  }

  _createRect() {
    // 创建一个矩形对象
    const rect = new fabric.Rect({
      left: 150,
      top: 150,
      width: 20 * 5,
      height: 10 * 5,
      fill: 'red',
    });

    const rect2 = new fabric.Rect({
      left: 150,
      top: 150,
      width: 20 * 5,
      height: 10 * 5,
      fill: 'green',
    });

    this.canvas.add(rect);
    this.canvas.add(rect2);
  }
}
