import store from '@/store';

/**
 * 设计图的工具
 */
export class DesignImageUtil {
  /**
   * 获取设计图相关参数
   */
  static getImage() {}

  /**
   * 设置当前激活的设计图
   * @param {import('@/design').CanvasImage} image
   * @param {import('@/design').ParseViewItem} view
   */
  static setActiveImage(image, view = null) {
    store.dispatch('designApplication/setActiveImageUuid', { uuid: image.attrs.uuid });
  }

  /**
   * 设置当前激活的设计图为空
   * @param {import('@/design').ParseViewItem} view
   */
  static setActiveImageNull(view = null) {
    store.dispatch('designApplication/setActiveImageUuid', { uuid: '', view });
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
    image.moveUp();
  }

  /**
   * 图层移动 - 置顶
   */
  static layerMoveTop() {}

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
