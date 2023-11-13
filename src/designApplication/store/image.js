import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import store from '@/store';
import { Message } from 'element-ui';
import { inchToPx, printAreaToImageRatio } from '@/designApplication/store/util';
import { loadImage } from '@/designApplication/core/utils/loadImage';

export const image_state = {};
export const image_getters = {};
export const image_mutations = {};

export const image_actions = {
  /**
   * 设置当前激活的设计图id
   * @param {*} vuex context
   * @param {string} uuid 设计图uuid
   * @param {import('@/design').ParseViewItem} view 视图
   */
  setActiveImageUuid({ state, commit, dispatch, getters }, { uuid, view }) {
    view = view || DesignerUtil.getView();
    if (!view) return console.error('获取view失败');
    view.activeImageUuid = uuid;
  },
  /**
   * 选中设计图
   * @param {*} vuex context
   * @param {ImageListByMyImage} detail 设计图详情
   * @param {string|number|null} viewId
   * */
  async setImage({ state, commit, dispatch, getters }, { detail, viewId }) {
    try {
      // 应用设计图之前的校验 --start
      await dispose_HotStamping(getters.activeProd.detail, detail);
      // 应用设计图之前的校验 --end

      viewId = viewId || store.state.designApplication.activeViewId;
      const view = state.prodStore.getView(viewId);

      /**
       * 静态数据
       * @type {import('@/design').StaticViewItem}
       * @returns {Promise<Konva.Image>}
       */
      const staticView = state.prodStore.getStatic()?.viewList.find((e) => e.id === viewId);

      if (!view || !staticView) {
        Message.warning('设计图需要加载到的view获取失败!');
        return;
      }

      // 画布的参数配置
      const canvasWidth = staticView.print.width;
      const canvasHeight = staticView.print.height;

      // 设计图单位转换(原图）
      const inch = inchToPx(detail.size, getters.activeProd.detail.dpi);
      // 设计图与产品dpi的换算
      const result = printAreaToImageRatio(inch, staticView.print);

      // 图片展示的宽高
      const width = result.size.width;
      const height = result.size.height;

      // 加载的远程图片（使用的图片）
      const imageDOM = await loadImage(detail.designImg);

      // 图片在画布展示的比例
      const scaleX = width / imageDOM.width;
      const scaleY = height / imageDOM.height;

      // console.log('dom size', imageDOM.width, imageDOM.height);
      // console.log('show size', width, height);
      // console.log('scale', scaleX, scaleY);

      // 图片在画布展示的位置
      const x = canvasWidth / 2 - width / 2 + staticView.offset.x;
      const y = canvasHeight / 2 - height / 2 + staticView.offset.y;

      /**
       * 图片展示的参数
       *@type {import('@/design').AddParamOfImage}
       */
      const param = {
        x,
        y,
        width,
        height,
        scaleX,
        scaleY,
        imageDOM,
        detail,
        view,
        staticView,
        inch,
      };

      const image = await view.canvas.addImage(param);

      return image;
    } catch (e) {
      console.log('e', e);
    } finally {
      //
    }
  },
};

/**
 * 烫印产品处理
 * @param {object} prodDetail - 产品
 * @param {object} imageDetail - 设计图详情数据
 * @return {Promise<Boolean>} - 是否能将设计图插入到产品中
 * */
export const dispose_HotStamping = (prodDetail, imageDetail) => {
  // [230703 zjb] 所有烫印模板dpi改为150
  const maxDpi = 150;

  // 非烫印模板，直接返回
  if (!prodDetail.isHotStamping) {
    return Promise.resolve(true);
  }

  // 烫印模板，只能使用png格式的设计图，且分辨率≥maxDpi 像素/英寸
  if (imageDetail.designImg.split('.').pop() !== 'png') {
    const msg = '烫印模板仅允许使用png格式设计图';
    Message.warning(msg);
    return Promise.reject(msg);
  }
  if (imageDetail.dpi < maxDpi) {
    let msg = `烫印模板仅允许使用分辨率≥${maxDpi} 像素/英寸的设计图；解决方法：通过PS调整图片分辨率，然后重新上传该图片！`;
    Message.warning(msg);
    return Promise.reject(msg);
  }

  return Promise.resolve(true);
};
