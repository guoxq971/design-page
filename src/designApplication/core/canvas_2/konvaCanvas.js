import { addEvent, initClip, initDashArea, initLayer, initRect, initStage, initV } from '@/designApplication/core/canvas_2/konvaCanvasInit';
import { Konva } from '@/designApplication/core/canvas/konva';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';
import store from '@/store';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { getDesignImage, getText, layerMove, remove, setProxyTransformer, setTextAttrs, visibleImage } from '@/designApplication/core/canvas_2/konvaCanvasAddHelp';
import { initTransformer } from '@/designApplication/core/canvas/selectBorder';
import { uuid } from '@/designApplication/core/utils/uuid';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';
import { isCollide } from '@/designApplication/core/utils/common';

/**
 * KonvaCanvas
 */
export class KonvaCanvas {
  /**
   * 入参
   * @type {import('@/design').InitParamOfKonvaCanvas}
   */
  param;

  /**
   * 舞台
   * @type {Konva.Stage}
   * */
  stage;

  /**
   * 图层
   * @type {Konva.Layer}
   */
  layer;

  /**
   * 背景图层
   * @type {Konva.Layer}
   */
  layerBg;

  /**
   * 裁剪区域
   * @type {Konva.Group}
   */
  clipBg;

  /**
   * 裁剪区域
   * @type {Konva.Group}
   */
  clip;

  /**
   * 车线
   * @type {Konva.Path | null}
   */
  v;

  /**
   * 裁剪区域
   * @type {Konva.Path}
   */
  konvaPath;

  /**
   * 产品边框
   * @type {Konva.Path}
   */
  prodRect;

  /**
   * @param {import ('@/design').InitParamOfKonvaCanvas} param 参数
   */
  constructor(param) {
    this._init(param);
  }

  /**
   * 初始化
   * @private
   * @param {import('@/design').InitParamOfKonvaCanvas} param 参数
   */
  _init(param) {
    this.param = param;
    this.stage = initStage(param);
    this.layer = initLayer(param);
    this.layerBg = initLayer(param);
    const dashArea = initDashArea(param);
    this.v = initV(param);
    const resultClip = initClip(param);
    this.clip = resultClip.clip;
    this.konvaPath = resultClip.konvaPath;
    this.prodRect = initRect(param);
    this.clipBg = resultClip.clip.clone();

    this.layerBg.add(this.clipBg);
    this.stage.add(this.layerBg);
    this.stage.add(this.layer);
    this.layer.add(dashArea);
    if (this.v) {
      this.layer.add(this.v);
      // this.v.moveToBottom();
    }
    this.layer.add(this.konvaPath);
    this.layer.add(this.clip);
    this.layer.add(this.prodRect);
    this.prodRect.moveToBottom();

    // 监听事件
    addEvent(this.stage, this.layer, this.hideAllTransformer.bind(this));
  }

  /**
   * 是否有选中的设计
   * @returns {boolean} 是否有选中的设计 true: 有 false: 没有
   */
  hasSelected() {
    let flag = false;
    this.layer.children.forEach((item) => {
      if (item.className === canvasDefine.Transformer && item.visible()) {
        flag = true;
      }
    });
    return flag;
  }

  /**
   * 获取选中的设计
   * @returns {import ('@/design').CustomCanvasDesign | null} 选中的设计
   */
  getSelected() {
    let result = null;
    this.layer.children.forEach((item) => {
      if (item.className === canvasDefine.Transformer && item.visible()) {
        result = {};
        result.transform = item;
        result.design = item._nodes[0];
      }
    });

    return result;
  }

  /**
   * 清空设计图
   */
  clear() {
    // 隐藏所有的选中器
    for (let image of this.getImageList()) {
      if (image.attrs.name === canvasDefine.image && image.visible()) {
        DesignImageUtil.setImageVisible(image);
      }
    }
    this.clip.removeChildren();
    this.clipBg.removeChildren();
    this.layer.draw();
  }

  /**
   * 获取当前所有的设计图
   * @returns {import ('@/design').CanvasImage[]} 当前所有的设计图 CanvasDesign[]
   */
  getImageList() {
    return [...this.clip.children.toReversed(), ...this.clipBg.children];
  }

  /**
   * 根据uuid获取设计图
   * @param uuid
   */
  getImage(uuid) {
    if (!uuid) return null;
    return this.getImageList().find((e) => e.attrs.uuid === uuid);
  }

  /**
   * 隐藏所有的选中器
   * @param {Konva.Layer} [layer] 图层
   * @param {Konva.Transformer|Konva.Image} [ignore] 忽略的选中器
   */
  hideAllTransformer(layer, ignore) {
    layer = layer || this.layer;
    const isTransformer = (item) => {
      return [canvasDefine.Transformer, canvasDefine.CustomTransformer].includes(item.className) || [canvasDefine.CustomTransformer].includes(item.customName);
    };

    const isIgnore = (item) => {
      if (!ignore) return false;

      const r1 = item === ignore;
      const r2 = item.attrs.transformer === ignore;
      const r3 = ignore.attrs.name === canvasDefine.image && item._id === ignore._id;

      return r1 || r2 || r3;
    };

    layer.children.forEach((item) => {
      if (isTransformer(item)) {
        if (isIgnore(item)) {
          //
        } else {
          item.visible(false);
        }
      }
    });

    if (this?.param?.view) {
      // 设置当前视图的激活id为空
      DesignImageUtil.setActiveImageNull(this.param.view);
    }
  }

  /**
   * 更新模型对应部位的纹理
   * @param {number|string|null} num console.log用的
   * @param {number|null} timeout 是否使用延时器
   * @param {boolean} isUpdate 是否强制更新
   */
  updateTexture(num = '', timeout = null, isUpdate = false) {
    if (this.param.view.texture && (store.state.designApplication.show3d || isUpdate)) {
      if (timeout !== null) {
        // console.log('更新材质-1-timeout', num);
        setTimeout(() => this.param.view.updateTexture(num), timeout);
      } else {
        // console.log('更新材质-2', num);
        this.param.view.updateTexture(num);
      }
    }
  }

  /**
   * 添加设计图
   * @param {import ('@/design').AddParamOfImage} param 参数
   * @returns {Promise<Konva.Image>} 设计图
   */
  async addImage(param) {
    const that = this;

    const designImage = await getDesignImage(param, this.layer, this.hideAllTransformer);

    // 监听 - 设计图
    designImage.image.on('dragmove', function (e) {
      that.updateTexture(3);

      // 设计图的碰撞检测
      DesignImageUtil.isCollide(this);
    });
    designImage.image.on('dragend', function (e) {
      that.updateTexture(33);
    });
    designImage.image.on('mousedown', function (e) {
      DesignerUtil.hideAllTransformer(null, this);
    });

    // 监听 - 锚点
    designImage.transformer.on('visibleChange', (event) => {
      this.updateTexture(11, 50);
    });
    designImage.transformer.on('transform', function (e) {
      that.updateTexture(4);

      // 设计图的碰撞检测
      DesignImageUtil.isCollide(this.attrs.image);
    });

    // 设置属性
    designImage.image.setAttrs({
      uuid: uuid(),
      x: -this.clip.attrs.x / this.clip.attrs.scaleX + param.x + param.width / 2,
      y: -this.clip.attrs.y / this.clip.attrs.scaleY + param.y + param.height / 2,
      scaleX: param.scaleX,
      scaleY: param.scaleY,
      rotation: param.rotation,
      type: canvasDefine.image,
      name: canvasDefine.image,
      detail: param.detail,
      view: param.view,
      param: param,
      konvaCanvas: this,
      transformer: designImage.transformer,
      isCollide: param.view.isCollide,
    });

    // 监听visible
    setProxyTransformer(designImage.transformer, designImage.image);

    // 碰撞检测
    DesignImageUtil.isCollide(designImage.image);

    //添加设计图
    this.clip.add(designImage.image);
    // 更新材质
    this.updateTexture(44, 50);

    return designImage.image;
  }

  /**
   * 添加背景色
   * @param {import ('@/design').AddParamOfBgc} param 参数
   */
  addBgc(param) {
    const color = param.color;

    /**
     * @type {import('@/design').CanvasBgc | null}
     */
    let rect = this.clipBg.children.find((e) => e.name() === canvasDefine.bgc);

    // 背景色已存在
    if (rect) {
      rect.setAttr('fill', color);
      this.updateTexture();
      return;
    }

    /* 背景色不存在 */
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

    // 背景色
    rect = new Konva.Rect({
      uuid: uuid(),
      x: 0,
      y: 0,
      width: this.stage.width(),
      height: this.stage.height(),
      fill: color,
      draggable: false,
      name: canvasDefine.bgc,
      dragDistance: 100000,
    });
    // 设置属性
    rect.setAttrs({
      visible: true,
      transformer,
      visibleFn: () => visibleImage(this, rect),
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

    // 监听 - 背景色
    rect.on('mousedown', (e) => {
      DesignerUtil.hideAllTransformer(null, rect);
    });

    // 添加
    transformer.nodes([rect]);
    this.layer.add(transformer);
    this.clipBg.add(rect);
    // 置底
    rect.moveToBottom();
    // 更新材质
    this.updateTexture();
  }

  /**
   * 添加文字
   * @param {import ('@/design').AddParamOfText} param 参数
   */
  async addText(param) {
    // 设置默认值
    const result = await getText(param.text, this.layer, this.hideAllTransformer);

    // 监听 - 文字
    result.text.on('mousedown', (e) => {
      DesignerUtil.hideAllTransformer(null, result.text);
    });

    // 设置属性
    setTextAttrs(result.text, param);

    // 监听visible
    setProxyTransformer(result.transformer, result.text);

    // 设置属性
    result.text.setAttrs({
      uuid: uuid(),
      visible: true,
      konvaCanvas: this,
      transformer: result.transformer,
      visibleFn: () => visibleImage(this, result.text, result.transformer),
      remove: () => remove(this, result.text, result.transformer),
      draw: (param2) => {
        setTextAttrs(result.text, param2);
        this.layer.draw();
      },
      layerMoveFn: (type) => layerMove(result.text, type),
      selectedFn: () => {
        DesignerUtil.hideAllTransformer();
        result.text.attrs.transformer.visible(true);
      },
    });

    // 设置居中
    const canvasSize = DesignerUtil.getVuexConfig().canvasSize;
    const canvasWidth = canvasSize.width;
    const canvasHeight = canvasSize.height;
    const canvasRatio = canvasSize.ratio;

    // 文字的参数
    const width = result.text.textWidth;
    const height = result.text.textHeight;

    // 文字在画布展示的位置
    const x = canvasWidth / 2 / canvasRatio - width / 2;
    const y = canvasHeight / 2 / canvasRatio - height / 2;

    // 设置文字的位置
    result.text.setAttrs({
      x: -this.clip.attrs.x + x,
      y: -this.clip.attrs.y + y,
    });

    // 添加
    this.clip.add(result.text);
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
}
