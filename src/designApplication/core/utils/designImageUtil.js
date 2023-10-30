import store from '@/store';

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
   * 移除当前设计图
   * @param {import('@/design').CanvasImage} image
   */
  static deleteImage(image) {
    image.attrs.remove();
  }

  /**
   * 设计图 - 显示|隐藏
   * @param {import('@/design').CanvasImage} image
   */
  static setImageVisible(image) {
    image.attrs.visibleFn();
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
   */
  static positionHorizontalCenter() {}

  /**
   * 定位 - 垂直居中
   */
  static positionVerticalCenter() {}

  /**
   * 缩放 - 放大
   */
  static scaleUp() {}

  /**
   * 缩放 - 缩小
   */
  static scaleDown() {}

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
