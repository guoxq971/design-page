import { initTransformer } from '@/designApplication/core/canvas/selectBorder';
import { Konva } from '@/designApplication/core/canvas/konva';
import { konvaRectConfig } from '@/designApplication/core/canvas/konvaConfig';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

/**
 * 获取设计图
 * @param {import('@/design').AddParamOfImage} param 参数
 * @param {Konva.Layer} layer 图层
 * @param {import('@/design').KonvaCanvas.hideAllTransformer} hideAllTransformer 隐藏所有选中框
 * @returns {Promise<{image: Konva.Image, transformer: Konva.Transformer}>}
 * */
export async function getDesignImage(param, layer, hideAllTransformer) {
  const image = param.imageDOM;
  // 选中框
  let transformer;
  transformer = initTransformer();
  transformer.visible(false);

  // 设计图
  let rect;
  rect = new Konva.Image(konvaRectConfig({ image: image }));
  transformer.nodes([rect]);
  layer.add(transformer);

  // 添加监听事件
  rect.on('click', function () {
    hideAllTransformer(layer, rect);
    transformer.visible(true);
  });
  // rect.on('mouseover', function () {});
  // rect.on('mouseout', function () {});
  rect.on('dragstart', function (event) {
    hideAllTransformer(layer, rect);
    transformer.visible(true);
  });
  // rect.on('dragmove', function () {});
  // rect.on('dragend', function () {});

  return Promise.resolve({ image: rect, transformer });
}

/**
 * 获取设计图
 * @param {string} text 文字
 * @param {Konva.Layer} layer 图层
 * @param {Function} hideAllTransformer 隐藏所有选中框
 * @returns {Promise<{text: Konva.Text, transformer: Konva.Transformer}>}
 * */
export async function getText(text, layer, hideAllTransformer) {
  // 选中框
  const transformer = initTransformer();
  transformer.visible(false);

  const konvaText = new Konva.Text({
    x: 0,
    y: 0,
    text: text,
    fontSize: 20,
    fontFamily: 'Calibri',
    fill: '#555',
    name: 'text',
    draggable: true,
  });
  transformer.nodes([konvaText]);
  layer.add(transformer);

  // 监听 - 文字
  konvaText.on('click', function () {
    hideAllTransformer(layer);
    transformer.visible(true);
  });
  konvaText.on('dragstart', function () {
    hideAllTransformer(layer);
    transformer.visible(true);
  });

  return Promise.resolve({ text: konvaText, transformer });
}

/**
 * 图层移动
 * */
export function layerMove(image, type) {
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
export function visibleImage(that, image, transformer = null) {
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
export function remove(that, image, transformer) {
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
export function setTextAttrs(text, param) {
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
