import { config3dUtil } from '@/designApplication/interface/Config3d/config3dOfCommonResponse';
import store from '@/store';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { setModelBgc } from '@/designApplication/core/canvas_2/konvaCanvasAddHelp';
import { sleep } from '@/designApplication/core/utils/sleep';

/**
 * 人为操作工具类
 * @description 这些方法只会在用户操作时调用
 * @class OperationUtil
 * */
export class OperationUtil {
  /**
   * 双击2d (canvas 画布)
   * */
  static async doubleClickCanvas() {
    if (config3dUtil.isLoad3d(store.getters['designApplication/activeProd'].config3d)) {
      // 是否显示3d true-显示 false-隐藏
      let isShow = !store.state.designApplication.show3d;

      switch (isShow) {
        case true:
          // 显示3d，将2d canvas的底色设置为配置的颜色
          setModelBgc();
          break;

        case false:
          // 隐藏3d，将2d canvas的底色设置为 原来的颜色
          setModelBgc(false);
          break;
      }

      if (isShow) {
        await sleep(100);
      }

      // 设置是否显示3d
      store.commit('designApplication/setShow3d', isShow);
    }
  }

  /**
   * 双击3d (three)
   * */
  static doubleClickThree() {
    this.doubleClickCanvas();
  }
}
