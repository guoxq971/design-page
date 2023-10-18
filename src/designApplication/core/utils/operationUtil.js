import { config3dUtil } from '@/designApplication/interface/Config3d/config3dOfCommonResponse';
import store from '@/store';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

/**
 * 人为操作工具类
 * @description 这些方法只会在用户操作时调用
 * @class OperationUtil
 * */
export class OperationUtil {
  /**
   * 双击2d (canvas 画布)
   * */
  static doubleClickCanvas() {
    if (config3dUtil.isLoad3d(store.getters['designApplication/activeProd'].config3d)) {
      // 是否显示3d true-显示 false-隐藏
      let isShow = !store.state.designApplication.show3d;

      // 获取当前激活的产品
      const prodItem = DesignerUtil.getActiveProd();

      switch (isShow) {
        case true:
          // 显示3d，将2d canvas的底色设置为配置的颜色
          for (let view of prodItem.viewList) {
            const config = DesignerUtil.getConfig();
            const color3dItem = config.get3dColorItemByViewId(view.id);
            const isGlass = DesignerUtil.hasGlass(color3dItem?.colorCode);

            if (view.canvas && !isGlass) {
              view.canvas.changeBgc(color3dItem.colorCode);
            }
          }
          break;

        case false:
          // 隐藏3d，将2d canvas的底色设置为 null
          for (let view of prodItem.viewList) {
            // TODO: 设置为已选择的背景色, 未选择则为null
            const color = null;
            if (view.canvas) {
              view.canvas.changeBgc(color);
            }
          }
          break;
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
