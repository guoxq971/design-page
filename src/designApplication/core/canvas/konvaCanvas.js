// import Konva from 'konva';
import { Konva } from '@/designApplication/core/canvas/konva';
import { drawAreaDash, initProdArea } from './prodArea';
import { getDesignImage, getText } from './designImage';
import store from '@/store';
import { KonvaCanvasParam } from '@/designApplication/interface/konvaCanvasParam';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { config3dUtil } from '@/designApplication/interface/Config3d/config3dOfCommonResponse';
import { OperationUtil } from '@/designApplication/core/utils/operationUtil';
import { loadImage } from '@/designApplication/core/utils/loadImage';
import { initTransformer } from '@/designApplication/core/canvas/selectBorder';

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
    this._initV(); // 初始化车线
    this._initClip(); // 初始化裁剪区域
    this._init();
  }

  /**
   * 改变底色
   * @param {any} color 颜色
   * */
  setCanvasFill(color = -1) {
    if (color === -1) return;
    this.konvaPath.setAttr('fill', color);
    this.updateTexture();
    this.layer.draw();
  }

  /**
   * 更新模型的材质
   * @param {number|string} num console.log用的
   * @param {number|null} timeout 是否使用延时器
   * @param {boolean} isUpdate 是否强制更新
   * */
  updateTexture(num = '', timeout = null, isUpdate = false) {
    if (this.param.view.texture && (store.state.designApplication.show3d || isUpdate)) {
      if (timeout !== null) {
        console.log('更新材质-1-timeout', num);
        setTimeout(() => this.param.view.updateTexture(num), timeout);
      } else {
        console.log('更新材质-2', num);
        this.param.view.updateTexture(num);
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
   * 获取选中的元素
   * @returns {boolean} 是否有选中的元素 true-有 false-没有
   * */
  getsSelected() {
    let result = null;
    this.layer.children.forEach((item) => {
      if (item.className === 'Transformer' && item.visible()) {
        result = item;
      }
    });
    return result;
  }

  /**
   * 隐藏所有的选中框transformer
   * @param {Object} layer 图层
   * @param {Object} ignore 忽略的类型
   * */
  hideAllTransformer(layer, ignore) {
    layer = layer || this.layer;
    layer.children.forEach((item) => {
      if (item.className === 'Transformer' && (item !== ignore || item.attrs.transformer !== ignore)) {
        item.visible(false);
      }
    });
  }

  /**
   * 获取当前设计图列表
   * */
  getImageList() {
    return this.clip.children;
  }

  /**
   * 添加设计图
   * @param {HTMLImageElement} imageDOM 图片对象
   * @param {object} param 参数
   * @param {Object} detail 设计图详情
   * @description 查找哪里使用了这个方法, 全局搜索: canvas.add
   * */
  async addImage(imageDOM, param = {}, detail) {
    param = Object.assign(
      {
        width: imageDOM.width,
        height: imageDOM.height,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      },
      param,
    );

    const designImage = await getDesignImage(imageDOM, this.layer, this.hideAllTransformer, param);

    // 设计图的事件
    designImage.image.on('dragmove', (e) => {
      this.updateTexture(3);
    });
    designImage.image.on('dragend', (e) => {
      this.updateTexture(33);
    });
    designImage.image.on('mousedown', (e) => {
      DesignerUtil.hideAllTransformer(null, designImage.image);
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
      detail: detail,
      konvaCanvas: this,
      transformer: designImage.transformer,
      remove: () => {
        remove(this, designImage.image, designImage.transformer);
      },
      visibleFn: () => {
        visibleImage(this, designImage.image, designImage.transformer);
      },
      layerMoveFn: (type) => {
        layerMove(designImage.image, type);
      },
      selectedFn: () => {
        DesignerUtil.hideAllTransformer();
        designImage.image.attrs.transformer.visible(true);
      },
    });

    this.clip.add(designImage.image); //添加设计图
    this.updateTexture(44, 50);
  }

  /**
   * 添加背景色
   * */
  addBgc(color) {
    let rect = this.clip.children.find((e) => e.name() === 'bgc');

    if (!rect) {
      // 选中框
      const transformer = initTransformer();
      transformer.setAttrs({
        name: 'bgc-transformer',
        draggable: false,
        borderStrokeWidth: 0,
        enabledAnchors: [],
        anchorSize: 0,
        dragDistance: 100000,
      });
      transformer.visible(false);

      rect = new Konva.Rect({
        x: -this.clip.attrs.x,
        y: -this.clip.attrs.y,
        width: this.stage.width(),
        height: this.stage.height(),
        fill: color,
        draggable: false,
        name: 'bgc',
        dragDistance: 100000,
      });

      rect.on('mousedown', (e) => {
        DesignerUtil.hideAllTransformer(null, rect);
      });

      transformer.nodes([rect]);
      this.layer.add(transformer);

      rect.setAttrs({
        visible: true,
        transformer,
        visibleFn: () => {
          visibleImage(this, rect);
        },
        remove: () => {
          this.clip.children = this.clip.children.filter((item) => item !== rect);
          this.updateTexture();
          this.layer.draw();
        },
        selectedFn: () => {
          DesignerUtil.hideAllTransformer();
          rect.attrs.transformer.visible(true);
        },
      });
      this.clip.add(rect);
      rect.moveToBottom();
    } else {
      rect.setAttr('fill', color);
    }

    this.updateTexture();
  }

  /**
   * 添加文字
   * @param {Object} param 参数
   * */
  async addText(param = {}) {
    // 设置默认值
    const result = await getText(param.text, this.layer, this.hideAllTransformer);

    result.text.on('mousedown', (e) => {
      DesignerUtil.hideAllTransformer(null, result.text);
    });

    // 设置文字属性
    setTextAttrs(result.text, param);

    // 文字的事件
    result.text.setAttrs({
      visible: true,
      transformer: result.transformer,
      visibleFn: () => {
        visibleImage(this, result.text, result.transformer);
      },
      remove: () => {
        remove(this, result.text, result.transformer);
      },
      draw: (param2) => {
        setTextAttrs(result.text, param2);
        this.layer.draw();
      },
      layerMoveFn: (type) => {
        layerMove(result.text, type);
      },
      selectedFn: () => {
        DesignerUtil.hideAllTransformer();
        result.text.attrs.transformer.visible(true);
      },
    });

    // 设置居中
    // 画布的参数配置
    const canvasSize = DesignerUtil.getVuexConfig().canvasSize;
    const canvasWidth = canvasSize.width;
    const canvasHeight = canvasSize.height;
    const canvasRatio = canvasSize.ratio;

    // 文字的参数
    const width = result.text.textHeight;
    const height = result.text.textWidth;

    // 文字在画布展示的位置
    const x = canvasWidth / 2 / canvasRatio - width / 2;
    const y = canvasHeight / 2 / canvasRatio - height / 2;

    result.text.setAttrs({
      x: -this.clip.attrs.x + x,
      y: -this.clip.attrs.y + y,
    });

    this.clip.add(result.text);
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
      if (e.target.attrs.name === 'image') return;

      if (e.target.attrs.name === 'back' && e.target.parent && e.target.parent.customName === 'CustomTransformer') {
        if (e.target.parent._nodes && e.target.parent._nodes[0]?.attrs.name === 'bgc') {
          //
        } else {
          return;
        }
      }

      this.hideAllTransformer();
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

/**
 * 图层移动
 * */
function layerMove(image, type) {
  //上移
  if (type === 'up') {
    image.moveUp();
  }
  //下移
  else if (type === 'down') {
    image.moveDown();
  }
  //置顶
  else if (type === 'top') {
    image.moveToTop();
  }
  //置底
  else if (type === 'bottom') {
    image.moveToBottom();
  }

  if (['down', 'bottom'].includes(type)) {
    // 背景色置底
    DesignerUtil.moveBottomBgc();
  }
}

/**
 * 显示隐藏设计图
 * @param that this
 * @param {Object} image 节点
 * @param {Object} transformer 选中框
 * */
function visibleImage(that, image, transformer = null) {
  const visible = !image.attrs.visible;
  image.visible(visible);
  if (transformer && visible === false) {
    transformer.visible(visible);
  }
  that.layer.draw();
}

/**
 * 移除设计图
 * @param that this
 * @param {Object} image 节点
 * @param transformer 选中框
 * */
function remove(that, image, transformer) {
  that.clip.children = that.clip.children.filter((item) => item !== image);
  that.layer.children = that.layer.children.filter((item) => item !== transformer);
  that.updateTexture();
  that.layer.draw();
}

/**
 * 设置文字属性
 * @param {Konva.Text} text 文字
 * @param {Object} param 参数
 * */
function setTextAttrs(text, param) {
  text.setAttrs({
    text: param.text,
    fill: param.fontColor || '#000',
    fontSize: param.fontSize || 20,
    fontFamily: param.fontFamily || 'Calibri',
    fontStyle: param.fontStyle || 'normal', // 斜体
    fontWeight: param.fontWeight || 'normal', // 加粗
    textDecoration: param.textDecoration || 'none', // 下划线
    textAnchor: param.textAlign || 'left', // 文字对齐方式
    letterSpacing: param.letterSpacing || 0, // 字间距
    lineHeight: param.lineHeight || 1, // 行间距
  });
}
