import store from '@/store';
import { getPositionCenter, getScaleMax, isCollision, remove, visibleImage } from '@/designApplication/core/canvas_2/konvaCanvasAddHelp';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { Message } from 'element-ui';

/**
 * 设计图的工具
 */
export class DesignImageUtil {
  static STEP_UP = 1 + 0.02;
  static STEP_DOWN = 1 - 0.02;

  /**
   * 传入的设计图是否已经被收藏
   * @param {import('@/design').CanvasImage} image
   * @returns {boolean|import('@/design').CollectImageListItem} 是否已经被收藏 设计图详情-已收藏 false-未收藏
   */
  static hasCollect(image) {
    const detail = image.attrs.detail;
    let collectImageList = [];
    if (detail.isBg) {
      collectImageList = store.state.designApplication.collectBgImageList;
    } else {
      collectImageList = store.state.designApplication.collectImageList;
    }

    let id = '';
    // detail.quickimgid 有值就是从 收藏列表 进来的
    if (detail.quickimgid) {
      id = detail.seqId;
    } else {
      id = image.attrs.detail.id;
    }

    const result = collectImageList.find((e) => e.seqId === id);
    if (result) {
      return result;
    }
    return false;
  }

  /**
   * 判断是否有激活的设计图
   * @returns {Promise<never>|Promise<Awaited<CanvasImage|CanvasText|CanvasBgc>>}
   */
  static hasActiveImageMessage() {
    if (!DesignImageUtil.hasActiveImage()) {
      Message.warning('请先选择设计图');
      return Promise.reject({ msg: '请先选择设计图' });
    }
    const image = DesignImageUtil.getImage();
    return Promise.resolve(image);
  }

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
   * 设置当前激活的设计图为空
   * @param {import('@/design').ParseViewItem} view
   */
  static setActiveImageNull(view = null) {
    store.dispatch('designApplication/setActiveImageUuid', { uuid: '', view });
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
   * @param {import('@/design').CanvasImage} image
   */
  static layerMoveBottom(image) {
    image.moveToBottom();
  }

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
    const { x } = getPositionCenter(image);

    image.setAttr('x', x);
  }

  /**
   * 定位 - 垂直居中
   * @param {import('@/design').CanvasImage} image
   */
  static positionVerticalCenter(image) {
    const { y } = getPositionCenter(image);

    image.setAttr('y', y);
  }

  /**
   * 缩放 - 放大
   * @param {import('@/design').CanvasImage} image
   */
  static scaleUp(image) {
    const step = this.STEP_UP;
    const { scaleX, scaleY } = image.attrs;

    // 缩放后的比例
    const resultScaleX = scaleX * step;
    const resultScaleY = scaleY * step;

    // 碰撞检测
    if (isCollision(image, { scaleX: resultScaleX, scaleY: resultScaleY })) {
      return;
    }

    image.setAttrs({
      scaleX: resultScaleX,
      scaleY: resultScaleY,
    });
  }

  /**
   * 缩放 - 缩小
   * @param {import('@/design').CanvasImage} image
   */
  static scaleDown(image) {
    const step = this.STEP_DOWN;
    const { scaleX, scaleY, param } = image.attrs;

    const resultScaleX = scaleX * step;
    const resultScaleY = scaleY * step;

    image.setAttrs({
      scaleX: resultScaleX,
      scaleY: resultScaleY,
    });
  }

  /**
   * 缩放 - 最大化
   * @param {import('@/design').CanvasImage} image
   */
  static scaleMax(image) {
    const { scaleX, scaleY } = getScaleMax(image);

    // 设计图 旋转归0
    DesignImageUtil.rotation(image, 0);

    image.setAttrs({
      scaleX: scaleX,
      scaleY: scaleY,
    });
  }

  /**
   * 缩放 - 宽度最大化
   * @param {import('@/design').CanvasImage} image
   */
  static scaleMaxWidth(image) {
    const { scaleX, scaleY } = getScaleMax(image, 'width');

    // 设计图 旋转归0
    DesignImageUtil.rotation(image, 0);

    image.setAttrs({
      scaleX: scaleX,
      scaleY: scaleY,
    });
  }

  /**
   * 缩放 - 高度最大化
   * @param {import('@/design').CanvasImage} image
   */
  static scaleMaxHeight(image) {
    const { scaleX, scaleY } = getScaleMax(image, 'height');

    // 设计图 旋转归0
    DesignImageUtil.rotation(image, 0);

    image.setAttrs({
      scaleX: scaleX,
      scaleY: scaleY,
    });
  }

  /**
   * 旋转
   * @param {import('@/design').CanvasImage} image
   * @param {number} angle 旋转角度
   */
  static rotation(image, angle = null) {
    if (angle === null) angle = image.rotation() + 1;

    const transformer = image.attrs.transformer;
    const resultRotation = angle;

    transformer.rotation(resultRotation);
    image.rotation(resultRotation);
  }
}
