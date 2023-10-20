// import Konva from 'konva';
import { Konva } from '@/designApplication/core/canvas/konva';
import { konvaTransformerConfig } from './konvaConfig';

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
 * 获取选中框
 * @param {Object} layer 图层
 * @returns {Konva.Transformer} 选中框
 * */
export function initTransformer(layer) {
  let node;

  // 选中框
  // const transformer = new Konva.Transformer(konvaTransformerConfig());
  const transformer = new CustomTransformer(konvaTransformerConfig());

  // transformer.on('transform', (transform) => {});
  // transformer.on('transformstart', (transform) => {});
  transformer.on('transformend', (transform) => {
    text.text('');
  });

  // 正上方添加旋转角度的text
  const text = new Konva.Text({
    text: '',
    fontSize: 20,
    fontFamily: 'Calibri',
    align: 'center',
    fill: '#4087ff',
    offset: { x: 0, y: 100 },
  });
  transformer.add(text);

  transformer.boundBoxFunc(function (oldBox, newBox) {
    if (transformer.nodes()) {
      node = transformer.nodes()[0];

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
    return newBox;
  });

  return transformer;
}
