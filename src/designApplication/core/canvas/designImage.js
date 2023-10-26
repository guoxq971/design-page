// import Konva from 'konva';
import { Konva } from '@/designApplication/core/canvas/konva';
import { konvaRectConfig } from './konvaConfig';
import { initTransformer } from './selectBorder';
import { loadImage } from '@/designApplication/core/utils/loadImage';

/**
 * 获取设计图
 * @param {Object} image 图片对象
 * @param {Object} layer 图层
 * @param {Function} hideAllTransformer 隐藏所有选中框
 * @returns {Promise<{image: Konva.Image, transformer: Konva.Transformer}>}
 * */
export async function getDesignImage(image, layer, hideAllTransformer) {
  // 选中框
  const transformer = initTransformer();
  transformer.visible(false);

  const rect = new Konva.Image(konvaRectConfig({ image: image }));
  transformer.nodes([rect]);
  layer.add(transformer);

  rect.on('click', function () {
    hideAllTransformer(layer, rect);
    transformer.visible(true);
  });
  // rect.on('mouseover', function () {});
  // rect.on('mouseout', function () {});
  rect.on('dragstart', function () {
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
 * @param {Object} layer 图层
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

  konvaText.on('click', function () {
    hideAllTransformer(layer);
    transformer.visible(true);
  });
  // rect.on('mouseover', function () {});
  // rect.on('mouseout', function () {});
  konvaText.on('dragstart', function () {
    hideAllTransformer(layer);
    transformer.visible(true);
  });
  // rect.on('dragmove', function () {});
  // rect.on('dragend', function () {});

  return Promise.resolve({ text: konvaText, transformer });
}
