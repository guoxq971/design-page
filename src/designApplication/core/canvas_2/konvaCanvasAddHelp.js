import { drawRotation, initTransformer } from '@/designApplication/core/canvas/selectBorder';
import { Konva } from '@/designApplication/core/canvas/konva';
import { konvaRectConfig } from '@/designApplication/core/canvas/konvaConfig';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import store from '@/store';
import { Message } from 'element-ui';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';

/**
 * 获取设计图
 * @param {import('@/design').AddParamOfImage} param 参数
 * @param {Konva.Layer} layer 图层
 * @param {import('@/design').KonvaCanvas.hideAllTransformer} hideAllTransformer 隐藏所有选中框
 * @returns {Promise<{image: import('@/design').CanvasImage, transformer: Konva.Transformer}>}
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
    hideAllTransformer(layer, this);
    this.attrs.transformer.visible(true);
  });
  // rect.on('mouseover', function () {});
  // rect.on('mouseout', function () {});
  rect.on('dragstart', function (event) {
    hideAllTransformer(layer, this);
    this.attrs.transformer.visible(true);
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
  const style = [param.fontStyle, param.fontWeight];
  const fontStyle = style.join(' ');
  text.setAttrs({
    text: param.text,
    fill: param.fontColor || '#000',
    fontSize: param.fontSize || 20,
    fontFamily: param.fontFamily || 'Calibri',
    fontStyle: fontStyle, // 样式
    // fontStyle: param.fontStyle || 'normal', // 斜体
    // fontWeight: param.fontWeight || 'normal', // 加粗
    textDecoration: param.textDecoration || 'none', // 下划线
    textAnchor: param.textAlign || 'left', // 文字对齐方式
    letterSpacing: param.letterSpacing || 0, // 字间距
    lineHeight: param.lineHeight || 1, // 行间距
  });
}

/**
 * 给Transformer添加监听事件
 * @param {Konva.Transformer} transformer 选中框
 * @param {import('@/design').CanvasImage} image 节点
 */
export function setProxyTransformer(transformer, image) {
  transformer.setAttrs({
    view: image.attrs.view,
    image: image,
  });

  // 监听 visible
  transformer.attrs = new Proxy(transformer.attrs, {
    set: (target, key, value) => {
      if (key === 'visible' && value === true && transformer.visible() === false) {
        // 当前视图激活的设计图
        store.dispatch('designApplication/setActiveImageUuid', { uuid: image.attrs.uuid });
      }
      target[key] = value;
      return true;
    },
  });

  // 监听 缩放尺寸
  transformer.setAttr('boundBoxFunc', (oldBox, newBox) => {
    // 绘制旋转角度
    drawRotation(transformer, oldBox, newBox);

    // 是否放大
    const isUp = newBox.width > oldBox.width || newBox.height > oldBox.height;

    if (isUp && image.attrs.type === canvasDefine.image && isCollision(image)) {
      return oldBox; // 返回旧的
    } else {
      return newBox; // 返回新的(成功放大)
    }
  });
}

/**
 * 设计图碰撞检测
 * @param {import('@/design').CanvasImage} image
 * @param {{scaleX:number,scaleY:number}} param
 * @returns {boolean} 是否碰撞 true-是 false-否
 */
let messageInstance = null;
export function isCollision(image, param = {}) {
  param = Object.assign({ scaleX: image.scaleX(), scaleY: image.scaleY() }, param);

  const inch = image.attrs.param.inch;
  const imgSize = image.attrs.param.imageDOM;
  const w = imgSize.width * param.scaleX;
  const h = imgSize.height * param.scaleY;

  if (w >= inch.width || h >= inch.height) {
    if (!messageInstance) {
      messageInstance = Message.warning({
        message: '已经最大了，不能再大了',
        onClose: () => (messageInstance = null),
      });
    }

    // 缩放到最大
    image.setAttrs({
      scaleX: inch.width / imgSize.width,
      scaleY: inch.height / imgSize.height,
    });

    return true;
  }

  return false;
}

/**
 * 最大化操作的缩放比例
 * @param {import('@/design').CanvasImage} image
 * @param {'width'|'height'|''} type
 */
export function getScaleMax(image, type = '') {
  const param = image.attrs.param;
  const staticView = param.staticView;

  const iSize = param.inch;
  const pSize = staticView.print;
  const l = iSize.width / pSize.width; // l:设计图宽/打印区宽
  const p = iSize.height / pSize.height; // p:设计图高/打印区高
  let u = Math.min(l, p); // 取较小值
  if ('width' === type) u = l;
  if ('height' === type) u = p;
  if (u < 1) u = 1;

  const width = iSize.width / u;
  const height = iSize.height / u;
  const scaleX = width / (param.imageDOM.width * param.scaleX);
  const scaleY = height / (param.imageDOM.height * param.scaleY);

  return {
    scaleX: scaleX * param.scaleX,
    scaleY: scaleY * param.scaleY,
  };
}

/**
 * 获取居中坐标的信息
 * @param {import('@/design').CanvasImage} image
 */
export function getPositionCenter(image) {
  const { konvaCanvas, param, scaleX, scaleY } = image.attrs;

  const staticView = param.staticView;

  // 画布高宽
  const canvasWidth = staticView.print.width;
  const canvasHeight = staticView.print.height;

  // 设计图高宽
  const imageWidth = param.imageDOM.width * scaleX;
  const imageHeight = param.imageDOM.height * scaleY;

  // 居中坐标
  const centerX = (canvasWidth - imageWidth) / 2;
  const centerY = (canvasHeight - imageHeight) / 2;

  // 画布偏移量
  const offsetX = konvaCanvas.clip.attrs.x / konvaCanvas.clip.attrs.scaleX - staticView.offset.x;
  const offsetY = konvaCanvas.clip.attrs.y / konvaCanvas.clip.attrs.scaleY - staticView.offset.y;

  // 居中坐标
  const x = -offsetX + centerX + imageWidth / 2;
  const y = -offsetY + centerY + imageHeight / 2;

  // 左上角坐标
  const leftTopX = x - centerX;
  const leftTopY = y - centerY;

  // 右上角坐标
  const rightTopX = x + centerX;
  const rightTopY = y - centerY;

  // 左下角坐标
  const leftBottomX = x - centerX;
  const leftBottomY = y + centerY;

  // 右下角坐标
  const rightBottomX = x + centerX;
  const rightBottomY = y + centerY;

  // 左中坐标
  const leftCenterX = x - centerX;
  const leftCenterY = y;

  // 右中坐标
  const rightCenterX = x + centerX;
  const rightCenterY = y;

  // 上中坐标
  const topCenterX = x;
  const topCenterY = y - centerY;

  // 下中坐标
  const bottomCenterX = x;
  const bottomCenterY = y + centerY;

  return {
    centerX,
    centerY,
    offsetX,
    offsetY,
    x,
    y,
    leftTopX,
    leftTopY,
    rightTopX,
    rightTopY,
    leftBottomX,
    leftBottomY,
    rightBottomX,
    rightBottomY,
    leftCenterX,
    leftCenterY,
    rightCenterX,
    rightCenterY,
    topCenterX,
    topCenterY,
    bottomCenterX,
    bottomCenterY,
  };
}

/**
 * 获取45度倍速的角度, 例：传入 30, 返回 45 ,传入 50, 返回 90 ，传入100, 返回 135
 * @param {number} angle 角度
 * @param {string} type 方向 right: 向右 left: 向左
 * @returns {number} 角度
 */
export function getAngleMultiple(angle, type = 'right') {
  let num;
  if (type === 'right') {
    num = Math.ceil(angle / 45);
    angle % 45 === 0 && num++;
  }
  if (type === 'left') {
    num = Math.floor(angle / 45);
    angle % 45 === 0 && num--;
  }
  return num * 45;
}
