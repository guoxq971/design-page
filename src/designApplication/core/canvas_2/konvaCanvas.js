import { addEvent, initClip, initDashArea, initLayer, initStage, initV } from '@/designApplication/core/canvas_2/konvaCanvasInit';
import { Konva } from '@/designApplication/core/canvas/konva';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';
import store from '@/store';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { getDesignImage, getText, layerMove, remove, setTextAttrs, visibleImage } from '@/designApplication/core/canvas_2/konvaCanvasAddHelp';
import { initTransformer } from '@/designApplication/core/canvas/selectBorder';

/**
 * KonvaCanvas
 * @class {import('@/design').KonvaCanvas} KonvaCanvas
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
   * @param {import ('@/design').InitParamOfKonvaCanvas} param 参数
   */
  constructor(param) {
    this._init(param);
  }

  /**
   * 初始化
   * @param {import('@/design').InitParamOfKonvaCanvas} param 参数
   */
  _init(param) {
    this.param = param;
    this.stage = initStage(param);
    this.layer = initLayer(param);
    const dashArea = initDashArea(param);
    this.v = initV(param);
    const resultClip = initClip(param);
    this.clip = resultClip.clip;
    this.konvaPath = resultClip.konvaPath;

    this.stage.add(this.layer);
    this.layer.add(dashArea);
    if (this.v) {
      this.layer.add(this.v);
      // this.v.moveToBottom();
    }
    this.layer.add(this.konvaPath);
    this.layer.add(this.clip);

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
   * 获取当前所有的设计图
   * @returns {import ('@/design').CanvasDesign[]} 当前所有的设计图
   */
  getImageList() {
    return this.clip.children;
  }

  /**
   * 隐藏所有的选中器
   * @param {Konva.Layer} layer 图层
   * @param {Konva.Transformer} ignore 忽略的选中器
   */
  hideAllTransformer(layer, ignore) {
    layer = layer || this.layer;
    layer.children.forEach((item) => {
      if (item.className === canvasDefine.Transformer && (item !== ignore || item.attrs.transformer !== ignore)) {
        item.visible(false);
      }
    });
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
   */
  async addImage(param) {
    const designImage = await getDesignImage(param, this.layer, this.hideAllTransformer);

    // 监听 - 设计图
    designImage.image.on('dragmove', (e) => {
      this.updateTexture(3);
    });
    designImage.image.on('dragend', (e) => {
      this.updateTexture(33);
    });
    designImage.image.on('mousedown', (e) => {
      DesignerUtil.hideAllTransformer(null, designImage.image);
    });

    // 监听 - 锚点
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
      type: canvasDefine.image,
      name: canvasDefine.image,
      detail: param.detail,
      konvaCanvas: this,
      transformer: designImage.transformer,
      remove: () => remove(this, designImage.image, designImage.transformer),
      visibleFn: () => visibleImage(this, designImage.image, designImage.transformer),
      layerMoveFn: (type) => layerMove(designImage.image, type),
      selectedFn: () => {
        DesignerUtil.hideAllTransformer();
        designImage.image.attrs.transformer.visible(true);
      },
    });

    //添加设计图
    this.clip.add(designImage.image);
    // 更新材质
    this.updateTexture(44, 50);
  }

  /**
   * 添加背景色
   * @param {import ('@/design').AddParamOfBgc} param 参数
   */
  addBgC(param) {
    const color = param.color;

    /**
     * @type {import('@/design').CanvasBgc | null}
     */
    let rect = this.clip.children.find((e) => e.name() === canvasDefine.bgc);

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
      x: -this.clip.attrs.x,
      y: -this.clip.attrs.y,
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
    this.clip.add(rect);
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

    // 设置属性
    result.text.setAttrs({
      visible: true,
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
