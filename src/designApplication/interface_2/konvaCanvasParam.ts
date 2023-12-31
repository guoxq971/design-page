import { ParseViewItem, StaticViewItem } from './prod';
import type Konva from 'konva';
import { KonvaCanvas } from '../core/canvas_2/konvaCanvas.js';
import { ImageListItem } from './image';

/**
 * @interface CanvasImage
 * @description 设计图的类型 - 图片
 */
export interface CanvasImage extends Konva.Image {
  attrs: {
    isCollide: boolean; //是否碰撞
    uuid: string;
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    width: number;
    height: number;
    type: string;

    // 自定义属性
    tileParam: null | object;
    isTile: boolean;
    isFlipX: boolean;
    isFlipY: boolean;
    name: string;
    detail: ImageListItem; //设计图的接口详情
    param: AddParamOfImage;
    view: ParseViewItem;
    konvaCanvas: KonvaCanvas;
    transformer: Konva.Transformer;
    remove: () => void;
    visibleFn: () => void;
    layerMoveFn: () => void;
    selectedFn: () => void;
  };
}

/**
 * @interface CanvasText
 * @description 设计图的类型 - 文字
 */
export interface CanvasText extends Konva.Text {}

/**
 * @interface CanvasBgc
 * @description 设计图的类型 - 背景色
 */
export interface CanvasBgc extends Konva.Rect {}

/**
 * @type CanvasDesign
 * @description 设计图的类型
 */
export type CanvasDesign = CanvasImage | CanvasText | CanvasBgc;

/**
 * @interface CustomCanvasDesign
 * @description canvas设计图的复合型 (包含transform)
 * @property {Konva.Transform} transform - transform
 * @property {CanvasDesign} design - 设计图
 */
export interface CustomCanvasDesign {
  transform: Konva.Transform;
  design: CanvasDesign;
}

/**
 * @interface AddParamOfImage
 * @description 添加的参数 - 设计图
 * @property {number} width - 宽度
 * @property {number} height - 高度
 * @property {number} x - x轴偏移量
 * @property {number} y - y轴偏移量
 * @property {number} scaleX - x轴缩放比例
 * @property {number} scaleY - y轴缩放比例
 * @property {number} rotation - 旋转角度
 * @property {HTMLImageElement} imageDOM - 图片DOM
 * @property {ParseViewItem} view - 视图数据
 * @property {StaticViewItem} staticView - 静态视图数据
 * @property {object} detail - 详情
 */
export interface AddParamOfImage {
  width: number;
  height: number;
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  imageDOM: HTMLImageElement;
  detail: object;
  view: ParseViewItem;
  staticView: StaticViewItem;
  inch: { width: number; height: number };
}

/**
 * @interface AddParamOfBgc
 * @description 添加的参数 - 设计图
 * @property {string} color - 颜色
 * */
export interface AddParamOfBgc {
  color: string;
}

/**
 * @interface AddParamOfText
 * @description 添加的参数 - 文字
 * @property {string} text - 文字
 * */
export interface AddParamOfText {
  text: string;
  fontColor: string;
  fontSize: number;
  fontFamily: string; //'微软雅黑',
  fontWeight: string; //normal,bold
  fontItalic: string; //normal,italic
  textDecoration: string; //none,underline,overline,line-through
  textAlign: string; //left,center,right
  lineHeight: number; //字体行高
  letterSpacing: number; //字体间距

  // 其他属性
  view: ParseViewItem;
  param: {
    view: ParseViewItem;
    staticView: StaticViewItem;
  };
}

/**
 * @interface InitParamOfKonvaCanvas
 * @description 初始化参数 - konvaCanvas
 * @property {string} id - canvas容器的id
 * @property {ParseViewItem} view - 视图数据
 * @property {object} staticView - 静态视图数据
 */
export interface InitParamOfKonvaCanvas {
  id: string;
  view: ParseViewItem;
  staticView: StaticViewItem;
}
