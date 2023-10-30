/**
 * 解析后的视图项
 * @class ParseViewItem
 * @constructor
 * @param {number} id 视图项id
 * @param {String} name 视图项名称
 * @param {x: number, y: number} offset 视图项偏移量
 * @param {import('@/design').KonvaCanvas} canvas 视图项画布
 * @param {three.Texture} texture 视图项纹理
 * @param {Function} updateTexture 更新纹理
 * @param {ViewRect} rect 视图项的矩形区域
 * @param {Array} imageList 设计图列表
 * */
export class ParseViewItem {
  id;
  name;
  offset;
  canvas;
  texture;
  updateTexture;
  rect;
  activeImageUuid;
  imageList = [];
}

/**
 * 虚线画布的区域
 * @class DashedCanvasRect
 * @param {number} x 虚线画布的区域x坐标
 * @param {number} y 虚线画布的区域y坐标
 * @param {number} width 虚线画布的区域宽度
 * @param {number} height 虚线画布的区域高度
 * */
export class ViewRect {
  x;
  y;
  width;
  height;
}
