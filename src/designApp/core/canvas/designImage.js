import Konva from 'konva';
import { konvaRectConfig } from '@/designApp/core/canvas/konvaConfig';
import { loadImage } from '@/designApp/core/utils/loadImage';
import { initTransformer } from '@/designApp/core/canvas/selectBorder';

/**
 * 获取设计图
 * @param {String} image 图片地址
 * @param {Object} layer 图层
 * @returns {Promise<{image: Konva.Rect, transformer: Konva.Transformer}>}
 * */
export async function getDesignImage(image, layer) {
  const img = await loadImage(image);
  // 选中框
  const transformer = initTransformer();
  transformer.visible(false);

  const rect = new Konva.Rect(konvaRectConfig({ image: img }));
  transformer.nodes([rect]);
  layer.add(transformer);

  rect.on('click', function () {
    layer.children.forEach((item) => {
      item.className === 'Transformer' && item.visible(false);
    });
    transformer.visible(true);
  });
  rect.on('mouseover', function () {});
  rect.on('mouseout', function () {});
  rect.on('dragstart', function () {
    layer.children.forEach((item) => {
      item.className === 'Transformer' && item.visible(false);
    });
    transformer.visible(true);
  });
  rect.on('dragmove', function () {});
  rect.on('dragend', function () {});

  return Promise.resolve({ image: rect, transformer });
}
