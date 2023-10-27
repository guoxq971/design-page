import type Konva from 'konva';
import { CanvasDesign, AddParamOfBgc, AddParamOfImage, AddParamOfText, InitParamOfKonvaCanvas } from './konvaCanvasParam';

/**
 * @class KonvaCanvas
 * @remarks KonvaCanvas核心类
 */
export class KonvaCanvas {
  /**
   * 舞台
   * @type {Konva.Stage}
   * */
  stage: Konva.Stage;

  /**
   * 图层
   * @type {Konva.Layer}
   */
  layer: Konva.Layer;

  /**
   * 裁剪区域
   * @type {Konva.Group}
   */
  clip: Konva.Group;

  /**
   * 车线
   * @type {string}
   */
  v: string;

  /**
   * 裁剪区域
   * @type {Konva.Path}
   */
  konvaPath: string;

  /**
   * 产品边框
   * @type {Konva.Path}
   */
  prodRect: string;

  /**
   * 初始化
   * @private
   */
  _init: (param: InitParamOfKonvaCanvas) => void;

  /**
   是否有选中的设计
   @returns {boolean} 是否有选中的设计 true: 有 false: 没有
   */
  hasSelected: () => boolean;

  /**
   * 获取选中的设计
   * @returns {Konva.Transform} 选中的设计
   */
  getSelected: () => Konva.Transform;

  /**
   * 获取当前所有的设计图
   * @returns {CanvasDesign[]} 当前所有的设计图
   */
  getImageList: () => CanvasDesign[];

  /**
   * 隐藏所有的选中器
   */
  hideAllTransformer: (layer?: Konva.Layer, ignore?: Konva.Transformer) => void;

  /**
   * 更新模型对应部位的纹理
   */
  updateTexture: () => void;

  /**
   * 添加设计 - 设计图
   * @param param
   */
  addImage: (param: AddParamOfImage) => void;

  /**
   * 添加设计 - 背景色
   */
  addBgc: (param: AddParamOfBgc) => void;

  /**
   * 添加设计 - 文字
   */
  addText: (param: AddParamOfText) => void;

  /**
   * 设置canvas底色
   */
  setCanvasFill: (color: string | -1) => void;
}
