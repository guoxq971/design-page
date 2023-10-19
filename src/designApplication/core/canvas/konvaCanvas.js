// import Konva from 'konva';
import { Konva } from '@/designApplication/core/canvas/konva';
import { drawAreaDash, initProdArea } from './prodArea';
import { getDesignImage } from './designImage';
import store from '@/store';
import { KonvaCanvasParam } from '@/designApplication/interface/konvaCanvasParam';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { config3dUtil } from '@/designApplication/interface/Config3d/config3dOfCommonResponse';
import { OperationUtil } from '@/designApplication/core/utils/operationUtil';
import { loadImage } from '@/designApplication/core/utils/loadImage';

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
  v; // 车线
  konvaPath; // 裁剪区域

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

  /**
   * 添加背景色
   * */
  setBgc(color) {
    let rect = this.clip.children.find((e) => e.name() === 'bgc');
    if (!rect) {
      rect = new Konva.Rect({
        x: 0,
        y: 0,
        width: this.stage.width(),
        height: this.stage.height(),
        fill: color,
        draggable: false,
        name: 'bgc',
      });
      rect.setAttrs({
        remove: () => {
          this.clip.children = this.clip.children.filter((item) => item !== rect);
          this.updateTexture();
          this.layer.draw();
        },
      });
      this.clip.add(rect);
    } else {
      rect.setAttrs('fill', color);
    }

    this.updateTexture();
  }

  /**
   * 改变背景色
   * @param {any} color 颜色
   * */
  changeBgc(color = -1) {
    if (color === -1) return;
    this.konvaPath.setAttr('fill', color);
    this.updateTexture();
    this.layer.draw();
  }

  /**
   * 更新模型的材质
   * @param {number|string} num console.log用的
   * @param {number|null} timeout 是否使用延时器
   * @param isUpdate
   * */
  updateTexture(num = '', timeout = null, isUpdate = false) {
    if (this.param.view.texture && (store.state.designApplication.show3d || isUpdate)) {
      // console.log('执行了更新模型');
      if (timeout !== null) {
        this.param.view.updateTexture(num);
      } else {
        setTimeout(() => this.param.view.updateTexture(num), timeout);
      }
    }
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
   * @param {HTMLImageElement} image 图片对象
   * @param {object} param 参数
   * @returns {Promise<{image: Konva.Image, width: number, height: number}>
   * */
  async createImage(image, param = {}) {
    param = Object.assign(
      {
        width: image.width,
        height: image.height,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      },
      param,
    );

    const designImage = await getDesignImage(image, this.layer, this.hideAllTransformer, param);

    // 设计图的事件
    designImage.image.on('dragmove', (e) => {
      this.updateTexture(3);
    });
    designImage.image.on('dragend', (e) => {
      this.updateTexture(33);
    });

    // 锚点的事件
    designImage.transformer.on('visibleChange', (event) => {
      this.updateTexture(11, 50);
    });
    designImage.transformer.on('transform', (e) => {
      this.updateTexture(4);
    });
    designImage.transformer.on('transformend', () => {
      this.updateTexture(9, 50);
    });

    designImage.image.setAttrs({
      x: -this.clip.attrs.x + param.x,
      y: -this.clip.attrs.y + param.y,
      scaleX: param.scaleX,
      scaleY: param.scaleY,
      rotation: param.rotation,
      type: 'image',
      name: 'image',
      konvaCanvas: this,
      remove: () => {
        this.clip.children = this.clip.children.filter((item) => item !== designImage.image);
        this.layer.children = this.layer.children.filter((item) => item !== designImage.transformer);
        this.updateTexture();
        this.layer.draw();
      },
    });

    return designImage;
  }

  /**
   * 添加设计图
   * @param {{image: Konva.Rect, transformer:Transformer}} design 设计图
   * @description 查找哪里使用了这个方法, 全局搜索: canvas.add
   * */
  add(design) {
    this.clip.add(design.image); //添加设计图
    this.updateTexture(44, 50);
  }

  /**
   * 获取当前设计图列表
   * */
  getImageList() {
    return this.clip.children;
  }

  /**
   * 添加文字
   * @param {string} text 文字
   * @param {Object} param 参数
   * */
  addText(text, param = {}) {
    const t = new Konva.Text({
      x: 0,
      y: 0,
      text: text,
      fontSize: 20,
      fontFamily: 'Calibri',
      fill: '#555',
      draggable: true,
    });

    const transformer = new Konva.Transformer({
      node: t,
      enabledAnchors: ['middle-left', 'middle-right'],
    });

    this.layer.add(transformer);
    this.clip.add(t);
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

    this.v = new Konva.Path({
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

    this.layer.add(this.v);

    // 置底
    this.v.moveToBottom();
  }

  /**
   * 初始化裁剪区域
   * */
  _initClip() {
    // 绘制区域 (裁剪区域, 超出隐藏)
    const { clip, konvaPath } = initProdArea(this.param.staticView, this.param.view);
    this.clip = clip;
    this.konvaPath = konvaPath;

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

    // 设置舞台的缩放
    // this.stage.scaleX(3);
    // this.stage.scaleY(3);

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // 监听点击的位置是否有元素
    this.stage.on('mousedown', (e) => {
      // 如果点击的是舞台或者path, 则隐藏所有的transformer
      if (e.target === this.stage || e.target.attrs.type === 'path' || e.target.attrs.name === 'bgc') {
        this.hideAllTransformer();
      }
    });

    // 监听双击事件
    this.stage.on('dblclick', (e) => {
      // 选中非设计图 && 没有选中元素 && 事件是用户触发的
      if (e.target.attrs.type !== 'image' && e.evt.isTrusted) {
        OperationUtil.doubleClickCanvas();
      }
    });
  }
}
