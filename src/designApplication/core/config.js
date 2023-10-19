const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
const CANVAS_RATIO = 1.3;

/**
 * 配置
 * @namespace config
 * @property {string} workerContainerId worker容器id
 * @property {string} threeContainerId three容器id
 * @property {string} canvasContainerId canvas容器id
 * @property {object} canvasSize canvas尺寸
 * @property {number} canvasSize.width canvas宽度
 * @property {number} canvasSize.height canvas高度
 * @property {number} canvasSize.ratio canvas缩放比例
 * @property {CanvasConfig} canvas canvas配置
 * */
export class Config {
  // 一些容器的id
  workerContainerId = 'worker-container';
  threeContainerId = 'three-container';
  canvasContainerId = 'canvas-container';

  // 左侧预览图的尺寸配置
  previewSize = {
    width: 73,
    gapRight: 10,
    positionLeft: 73 + 10,
  };

  // canvas的尺寸配置
  canvasSize = {
    width: CANVAS_WIDTH * CANVAS_RATIO,
    height: CANVAS_HEIGHT * CANVAS_RATIO,
    ratio: CANVAS_RATIO,
  };

  // konva canvas的配置
  canvas = new CanvasConfig();
}

/**
 * canvas 配置
 * @namespace CanvasConfig
 * @property {boolean} isClip 是否裁剪 true-裁剪 false-不裁剪
 * @property {number} clipStoreWidth 裁剪框宽度
 * @property {string} clipStoreColor 裁剪框颜色
 * @property {string} clipStoreFill 裁剪框填充色
 *
 * @property {boolean} isV 是否展示车线 true-展示 false-不展示
 * @property {number} vStoreWidth 车线宽度
 * @property {string} vStoreColor 车线颜色
 * @property {number[]} vDash 车线虚线
 *
 * @property {boolean} isShowProductImage 是否展示产品图片 true-产品图片 false-设计图
 * */
class CanvasConfig {
  isClip = true;
  clipStoreWidth = 0;
  clipStoreColor = 'red';
  clipStoreFill = null; //'#fff'; //背景色

  isV = false;
  vStoreWidth = 1.5;
  vStoreColor = 'red';
  vDash = [5, 5];

  isShowProductImage = true;
}
