// import Konva from 'konva';
import { Konva } from '@/designApplication/core/canvas/konva';
import { konvaTransformerConfig } from '@/designApplication/core/canvas/konvaConfig';
import { queue_define, useQueue } from '@/designApplication/core/utils/useQueue';

class CustomTransformer extends Konva.Transformer {
  customName = 'CustomTransformer';
  constructor(config) {
    super(config);
  }

  setVisible(visible) {
    this.fire('visibleChange', { visible });
    super.setVisible(visible);
  }
}

/**
 * 绘制旋转角度
 * @param transformer
 * @param oldBox
 * @param newBox
 */
export function drawRotation(transformer, oldBox, newBox) {
  const text = transformer.children.find((e) => e.attrs.name === 'rotationText');
  if (text && transformer.nodes()) {
    const node = transformer.nodes()[0];

    // 如果当前是旋转操作
    if (oldBox.rotation !== newBox.rotation) {
      // 旋转的角度和坐标
      let t = node.rotation().toFixed();
      if (t < 0) {
        t = 360 + +t;
      }
      text.text(t + '°');
      text.offsetX((text.width() - newBox.width) / 2);
    }
  }
}

/**
 * 获取选中框
 * @param {Object} layer 图层
 * @returns {Konva.Transformer} 选中框
 * */
export function initTransformer(layer) {
  let node;

  // 选中框
  // const transformer = new Konva.Transformer(konvaTransformerConfig());
  const transformer = new CustomTransformer(konvaTransformerConfig());

  function updateTransformer() {
    text.text('');

    // 更新模型纹理
    transformer.attrs.image.attrs.konvaCanvas.updateTexture('transformend', 50);

    // 操作记录
    useQueue().add(queue_define.transformer_end);
  }

  transformer.setAttrs({
    updateTransformer,
  });

  // transformer.on('transform', (transform) => {});
  // transformer.on('transformstart', (transform) => {});
  transformer.on('transformend', updateTransformer);

  // 正上方添加旋转角度的text
  const text = new Konva.Text({
    text: '',
    fontSize: 20,
    fontFamily: 'Calibri',
    align: 'center',
    fill: '#4087ff',
    offset: { x: 0, y: 100 },
  });
  text.setAttr('name', 'rotationText');
  transformer.add(text);

  // transformer.boundBoxFunc(function (oldBox, newBox) {
  //   // 旋转操作时, 画出度数
  //   drawRotation(transformer, oldBox, newBox);
  //
  //   return newBox;
  // });

  return transformer;
}
