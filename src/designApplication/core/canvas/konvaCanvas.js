// import Konva from 'konva';
import { Konva } from '@/designApplication/core/canvas/konva';
import { drawAreaDash, initProdArea } from './prodArea';
import { getDesignImage } from './designImage';
import store from '@/store';
import { KonvaCanvasParam } from '@/designApplication/interface/konvaCanvasParam';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

/**
 * 创建 konva canvas
 * @class KonvaCanvas
 * @property {KonvaCanvasParam} param 参数
 * */
export class KonvaCanvas {
  param = new KonvaCanvasParam();
  stage; // 舞台
  layer; // 图层
  clip; // 裁剪区域
  beforeDownSelected = false; //按下前是否选中了设计图

  constructor(_param = '') {
    if (_param === '') return;
    this.param = {
      id: 'container',
      view: null,
      staticView: null,
    };
    if (typeof _param === 'string') {
      this.param.id = _param;
    } else {
      Object.assign(this.param, _param);
    }

    this._initStage(); // 初始化舞台
    this._initDashArea(); // 初始化虚线边框
    this._initClip(); // 初始化裁剪区域
    this._initV(); // 初始化车线
    this._init();
  }

  _init() {}

  /**
   * 初始化车线
   * */
  _initV() {
    const canvasConfig = store.state.designApplication.config.canvas;
    const canvasSize = store.state.designApplication.config.canvasSize;
    const staticView = this.param.staticView;

    const offsetX = staticView.offset.x * (canvasSize.ratio - 1);
    const offsetY = staticView.offset.y * (canvasSize.ratio - 1);
    const x = staticView.offset.x + offsetX;
    const y = staticView.offset.y + offsetY;
    const v = staticView.v;
    if (!v) return;

    const path = new Konva.Path({
      x: x,
      y: y,
      data: v,
      fill: null,
      stroke: canvasConfig.vStoreColor,
      strokeWidth: canvasConfig.vStoreWidth,
      dash: canvasConfig.vDash,
      type: 'path',
      scaleX: canvasSize.ratio,
      scaleY: canvasSize.ratio,
      visible: canvasConfig.isV,
    });

    this.layer.add(path);
  }

  /**
   * 初始化裁剪区域
   * */
  _initClip() {
    // 绘制区域 (裁剪区域, 超出隐藏)
    const { clip, konvaPath } = initProdArea(this.param.staticView, this.param.view);
    this.clip = clip;

    this.layer.add(konvaPath);
    this.layer.add(this.clip);
  }

  /**
   * 初始化虚线边框
   * */
  _initDashArea() {
    // 在 param.offsetX, param.offsetY 处绘制一个矩形 500x500 的虚线框
    const rect = drawAreaDash(this.param.view);

    this.layer.add(rect);
  }

  /**
   * 初始化舞台
   * */
  _initStage() {
    const canvasSize = store.state.designApplication.config.canvasSize;

    this.stage = new Konva.Stage({
      container: this.param.id,
      width: canvasSize.width,
      height: canvasSize.height,
    });

    // Konva.pixelRatio = window.devicePixelRatio; // 画布的像素比例

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // 监听点击的位置是否有元素
    this.stage.on('mousedown', (e) => {
      this.beforeDownSelected = this.hasSelected();

      // 如果点击的是舞台或者path, 则隐藏所有的transformer
      if (e.target === this.stage || e.target.attrs.type === 'path') {
        this.hideAllTransformer();
      }
    });

    // 监听单击事件
    this.stage.on('click', (e) => {
      // 选中非设计图 && 没有选中元素 && 事件是用户触发的
      if (e.target.attrs.type !== 'image' && !this.beforeDownSelected && e.evt.isTrusted) {
        DesignerUtil.showThree();
      }
    });
  }

  /**
   * 更新模型的残值
   * */
  updateTexture(num) {
    if (this.param.view.texture) this.param.view.updateTexture(num);
  }

  /**
   * 是否有选中的元素
   * @returns {boolean} 是否有选中的元素 true-有 false-没有
   * */
  hasSelected() {
    let flag = false;
    this.layer.children.forEach((item) => {
      if (item.className === 'Transformer' && item.visible()) {
        flag = true;
      }
    });
    return flag;
  }

  /**
   * 隐藏所有的选中框transformer
   * */
  hideAllTransformer(layer) {
    layer = layer || this.layer;
    layer.children.forEach((item) => {
      item.className === 'Transformer' && item.visible(false);
    });
  }

  /**
   * 创建图片
   * @param {string} image 图片地址
   * @returns {Promise<{image: Konva.Image, width: number, height: number}>
   * */
  async createImage(image) {
    const designImage = await getDesignImage(image, this.layer, this.hideAllTransformer);

    // 设计图的事件
    designImage.image.on('dragmove', (e) => {
      this.updateTexture(3);
    });
    designImage.image.on('dragend', (e) => {
      this.updateTexture(33);
    });

    // 锚点的事件
    designImage.transformer.on('visibleChange', (event) => {
      setTimeout(() => this.updateTexture(9), 50);
    });
    designImage.transformer.on('transform', (e) => {
      this.updateTexture(4);
    });
    designImage.transformer.on('transformend', () => {
      setTimeout(() => this.updateTexture(5), 50);
    });

    designImage.image.setAttrs({
      x: 0,
      y: 0,
      type: 'image',
    });
    return designImage;
  }

  /**
   * 添加设计图
   * @param {{image: Konva.Rect, transformer:Transformer}} design 设计图
   * */
  add(design) {
    this.clip.add(design.image); //添加设计图
  }
}
