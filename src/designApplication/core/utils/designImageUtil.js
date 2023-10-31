import store from '@/store';
import { remove, visibleImage } from '@/designApplication/core/canvas_2/konvaCanvasAddHelp';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

/**
 * 设计图的工具
 */
export class DesignImageUtil {
  /**
   * 获取设计图相关参数
   * @param {string|null} uuid
   * @param {import('@/design').ParseViewItem} view
   */
  static getImage(uuid = null, view = null) {
    view = view || store.getters['designApplication/activeView'];
    if (!view) return null;
    if (uuid === null) uuid = view.activeImageUuid;
    return view.canvas.getImageList().find((e) => e.attrs.uuid === uuid);
  }

  /**
   * 当前是否有激活的设计图
   * @param {import('@/design').ParseViewItem} view
   * @returns {boolean} 是否有激活的设计图 true-有 false-无
   */
  static hasActiveImage(view = null) {
    view = view || store.getters['designApplication/activeView'];
    if (!view) return false;
    return !!view?.activeImageUuid;
  }

  /**
   * 设置当前激活的设计图
   * @param {import('@/design').CanvasImage} image
   * @param {import('@/design').ParseViewItem} view
   */
  static setActiveImage(image, view = null) {
    store.dispatch('designApplication/setActiveImageUuid', { uuid: image.attrs.uuid });
    image.attrs.konvaCanvas.hideAllTransformer();
    image.attrs.transformer.visible(true);
  }

  /**
   * 设置当前激活的设计图为空
   * @param {import('@/design').ParseViewItem} view
   */
  static setActiveImageNull(view = null) {
    store.dispatch('designApplication/setActiveImageUuid', { uuid: '', view });
  }

  /**
   * 选中设计图
   * @param {import('@/design').CanvasImage} image
   */
  static selectedImage(image) {
    DesignerUtil.hideAllTransformer();
    image.attrs.transformer.visible(true);
  }

  /**
   * 移除当前设计图
   * @param {import('@/design').CanvasImage} image
   */
  static deleteImage(image) {
    const view = image.attrs.view;
    const konvaCanvas = image.attrs.konvaCanvas;
    const activeImageUuid = view.activeImageUuid;

    // 移除设计图
    remove(konvaCanvas, image, image.attrs.transformer);

    // 当前视图的激活id如果是当前移除的id,则设置激活id为空
    if (activeImageUuid === image.attrs.uuid) {
      DesignImageUtil.setActiveImageNull(view);
    }
  }

  /**
   * 设计图 - 显示|隐藏
   * @param {import('@/design').CanvasImage} image
   */
  static setImageVisible(image) {
    const view = image.attrs.view;
    const transformer = image.attrs.transformer;
    const konvaCanvas = image.attrs.konvaCanvas;
    const activeImageUuid = view.activeImageUuid;

    // 显示|隐藏 设计图
    visibleImage(konvaCanvas, image, transformer);

    // 当前视图的激活id如果是当前移除的id,则设置激活id为空
    if (activeImageUuid === image.attrs.uuid) {
      DesignImageUtil.setActiveImageNull(view);
    }
  }

  /**
   * 图层移动 - 上移
   */
  static layerMoveUp(image) {
    image.moveUp();
  }

  /**
   * 图层移动 - 下移
   */
  static layerMoveDown(image) {
    image.moveDown();
  }

  /**
   * 图层移动 - 置顶
   * @param {import('@/design').CanvasImage} image
   */
  static layerMoveTop(image) {
    image.moveToTop();
  }

  /**
   * 图层移动 - 置底
   */
  static layerMoveBottom() {}

  /**
   * 翻转 - 水平方向
   */
  static filterHorizontal() {}

  /**
   * 翻转 - 垂直方向
   */
  static filterVertical() {}

  /**
   * 定位 - 水平居中
   * @param {import('@/design').CanvasImage} image
   */
  static positionHorizontalCenter(image) {
    const konvaCanvas = image.attrs.konvaCanvas;
    const cx = image.attrs.param.x;
    const cy = image.attrs.param.y;
    const offsetX = konvaCanvas.clip.attrs.x / konvaCanvas.clip.attrs.scaleX;
    const offsetY = konvaCanvas.clip.attrs.y / konvaCanvas.clip.attrs.scaleY;
    image.setAttr('x', -offsetX + cx);
  }

  /**
   * 定位 - 垂直居中
   * @param {import('@/design').CanvasImage} image
   */
  static positionVerticalCenter(image) {
    const konvaCanvas = image.attrs.konvaCanvas;
    const cx = image.attrs.param.x;
    const cy = image.attrs.param.y;
    const offsetX = konvaCanvas.clip.attrs.x / konvaCanvas.clip.attrs.scaleX;
    const offsetY = konvaCanvas.clip.attrs.y / konvaCanvas.clip.attrs.scaleY;
    image.setAttr('y', -offsetY + cy);
  }

  /**
   * 缩放 - 放大
   * @param {import('@/design').CanvasImage} image
   */
  static scaleUp(image) {
    const step = 1.05;
    const { x, y, scaleX, scaleY, param } = image.attrs;

    const resultScaleX = scaleX * step;
    const resultScaleY = scaleY * step;

    const resultWidth = param.imageDOM.width * resultScaleX;
    const resultWeight = param.imageDOM.height * resultScaleY;

    const diffWidth = param.imageDOM.width * scaleX - resultWidth;
    const diffHeight = param.imageDOM.height * scaleY - resultWeight;

    const resultX = x - diffWidth / 2;
    const resultY = y - diffHeight / 2;
    // console.log('resultX', resultX);
    // console.log('resultY', resultY);
    // console.log('x', x);
    // console.log('y', y);

    image.setAttrs({
      scaleX: resultScaleX,
      scaleY: resultScaleY,
    });

    setTimeout(() => {
      image.setAttrs({
        x: resultX,
        y: resultY,
      });
    });
  }

  /**
   * 缩放 - 缩小
   * @param {import('@/design').CanvasImage} image
   */
  static scaleDown(image) {}

  /**
   * 缩放 - 最大化
   */
  static scaleMax() {}

  /**
   * 缩放 - 宽度最大化
   */
  static scaleMaxWidth() {}

  /**
   * 缩放 - 高度最大化
   */
  static scaleMaxHeight() {}

  /**
   * 旋转 - 右旋转
   */
  static rotationUp() {}

  /**
   * 旋转 - 左旋转
   */
  static rotationDown() {}
}
