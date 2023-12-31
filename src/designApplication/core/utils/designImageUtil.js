import store from '@/store';
import { getPositionCenter, getScaleMax, isCollision, remove, supplementImageList, visibleImage } from '@/designApplication/core/canvas_2/konvaCanvasAddHelp';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { Message } from 'element-ui';
import { isCollide } from '@/designApplication/core/utils/common';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';
import { TileUtil } from '@/designApplication/components/layout/right/hoverComponents/tileUtil';

/**
 * 设计图的工具
 */
export class DesignImageUtil {
  static STEP_UP = 1 + 0.02;
  static STEP_DOWN = 1 - 0.02;

  /**
   * 获取设计图信息
   */
  static getImageInfo(image) {
    if (!image) {
      console.error('获取设计图信息失败, image is null');
      return;
    }
    if (image.attrs.name === canvasDefine.bgc) {
      console.error('获取设计图信息失败, image is bgc');
      return;
    }
    // 设计图当前的宽高
    const width = image.width() * image.scaleX() * (image.scaleX() >= 0 ? 1 : -1);
    const height = image.height() * image.scaleY() * (image.scaleY() >= 0 ? 1 : -1);

    // 设计图当前的坐标
    const x = image.x() - width / 2;
    const y = image.y() - height / 2;

    // 设计图当前的旋转角度
    const rotation = image.rotation() < 0 ? 360 + image.rotation() : image.rotation();

    return {
      image,
      x,
      y,
      width,
      height,
      rotation,
      scaleX: image.scaleX(),
      scaleY: image.scaleY(),
    };
  }

  /**
   * 对设计图进行碰撞检测
   * @param {import('@/design').CanvasImage} image
   */
  static isCollide(image) {
    if (image.attrs.type !== canvasDefine.image) return;
    if (!image.attrs.view.isCollide) return;
    const path = image.attrs.view.canvas.konvaPath;

    // 碰撞检测
    const result = isCollide(image, path);
    image.attrs.isCollide = result;

    // 碰撞检测后的样式
    if (result) {
      image.attrs.transformer.setAttrs({
        borderDash: [5, 5],
        borderStroke: 'red',
        borderStrokeWidth: 2.5,
      });
    } else {
      image.attrs.transformer.setAttrs({
        borderDash: [],
        borderStroke: '#4087ff',
        borderStrokeWidth: 1.5,
      });
    }
  }

  /**
   * 传入的设计图是否已经被收藏
   * @param {import('@/design').CanvasImage} image
   * @returns {boolean|import('@/design').CollectImageListItem} 是否已经被收藏 设计图详情-已收藏 false-未收藏
   */
  static hasCollect(image) {
    const detail = image.attrs.detail;
    return DesignerUtil.hasCollectImage(detail);
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

    // 后置函数
    afterFn(image, 'selectedImage');
  }

  /**
   * 删除/移除当前设计图
   * @param {import('@/design').CanvasImage} image
   */
  static deleteImage(image) {
    const view = image.attrs.view;
    const konvaCanvas = image.attrs.konvaCanvas;
    const activeImageUuid = view.activeImageUuid;

    // 移除设计图
    remove(konvaCanvas, image, image.attrs.transformer);

    // 移除平铺图
    TileUtil.remove(image);

    // 当前视图的激活id如果是当前移除的id,则设置激活id为空
    if (activeImageUuid === image.attrs.uuid) {
      DesignImageUtil.setActiveImageNull(view);
    }

    // 后置函数
    afterFn(image, 'deleteImage');
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

    // 后置函数
    afterFn(image, 'setImageVisible');
  }

  /**
   * 图层移动 - 上移
   */
  static layerMoveUp(image) {
    image.moveUp();

    // 后置函数
    afterFn(image, 'layerMoveUp');
  }

  /**
   * 图层移动 - 下移
   */
  static layerMoveDown(image) {
    image.moveDown();

    // 后置函数
    afterFn(image, 'layerMoveDown');
  }

  /**
   * 图层移动 - 置顶
   * @param {import('@/design').CanvasImage} image
   */
  static layerMoveTop(image) {
    image.moveToTop();

    // 后置函数
    afterFn(image, 'layerMoveTop');
  }

  /**
   * 图层移动 - 置底
   * @param {import('@/design').CanvasImage} image
   */
  static layerMoveBottom(image) {
    image.moveToBottom();

    // 后置函数
    afterFn(image, 'layerMoveBottom');
  }

  /**
   * 翻转 - 水平方向
   */
  static flipX(image) {
    image.setAttrs({
      scaleX: -image.scaleX(),
      isFlipX: !image.attrs.isFlipX,
    });

    // 后置函数
    afterFn(image, 'flipX');
  }

  /**
   * 翻转 - 垂直方向
   */
  static flipY(image) {
    image.setAttrs({
      scaleY: -image.scaleY(),
      isFlipY: !image.attrs.isFlipY,
    });
    // 后置函数
    afterFn(image, 'flipY');
  }

  /**
   * 定位 - 水平居中
   * @param {import('@/design').CanvasImage} image
   */
  static positionHorizontalCenter(image) {
    const { x } = getPositionCenter(image);

    image.setAttr('x', x);

    // 后置函数
    afterFn(image, 'positionHorizontalCenter');
  }

  /**
   * 定位 - 垂直居中
   * @param {import('@/design').CanvasImage} image
   */
  static positionVerticalCenter(image) {
    const { y } = getPositionCenter(image);

    image.setAttr('y', y);

    // 后置函数
    afterFn(image, 'positionVerticalCenter');
  }

  /**
   * 缩放 - 放大
   * @param {import('@/design').CanvasImage} image
   */
  static scaleUp(image) {
    const step = this.STEP_UP;

    // 缩放后的比例
    const resultScaleX = image.scaleX() * step;
    const resultScaleY = image.scaleY() * step;

    // 碰撞检测
    if (isCollision(image, { scaleX: resultScaleX, scaleY: resultScaleY })) {
      return;
    }

    image.setAttrs({
      scaleX: resultScaleX,
      scaleY: resultScaleY,
    });

    // 后置函数
    afterFn(image, 'scaleUp');
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

    // 后置函数
    afterFn(image, 'scaleDown');
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

    // 后置函数
    afterFn(image, 'scaleMax');
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

    // 后置函数
    afterFn(image, 'scaleMaxWidth');
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

    // 后置函数
    afterFn(image, 'scaleMaxHeight');
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

    // 后置函数
    afterFn(image, 'rotation');
  }

  /**
   * 更新材质
   * @param  image
   * @param type
   */
  static updateTexture(image, type = '') {
    let konvaCanvas;

    if (image.attrs.type === canvasDefine.image) {
      konvaCanvas = image.attrs.konvaCanvas;
    }

    // 更新材质
    if (konvaCanvas) {
      konvaCanvas.updateTexture(type, 50);
    }
  }
}

/**
 * 所有操作的后置函数
 */
function afterFn(image, type) {
  if (store.state.designApplication.isSupplement) {
    // 补充设计图
    // supplementImageList(image.attrs.view);
  }

  // 更新平铺图
  let tile;
  if (!['deleteImage'].includes(type)) {
    tile = TileUtil.update(image);
  }

  if (!tile) {
    // 更新材质
    if (image && image.attrs.konvaCanvas) {
      DesignImageUtil.updateTexture(image, type);
    }
  }
}
