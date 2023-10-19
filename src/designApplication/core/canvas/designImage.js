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
 * @returns {Promise<{image: Konva.Rect, transformer: Konva.Transformer}>}
 * */
export async function getDesignImage(image, layer, hideAllTransformer) {
  // 选中框
  const transformer = initTransformer();
  transformer.visible(false);

  const rect = new Konva.Image(konvaRectConfig({ image: image }));
  transformer.nodes([rect]);
  layer.add(transformer);

  rect.on('click', function () {
    hideAllTransformer(layer);
    transformer.visible(true);
  });
  rect.on('mouseover', function () {});
  rect.on('mouseout', function () {});
  rect.on('dragstart', function () {
    hideAllTransformer(layer);
    transformer.visible(true);
  });
  rect.on('dragmove', function () {});
  rect.on('dragend', function () {});

  return Promise.resolve({ image: rect, transformer });
}
