import store from '@/store';
import { config3dUtil } from '@/designApplication/interface/Config3d/config3dOfCommonResponse';
import * as TWEEN from '@tweenjs/tween.js';
import lodash from 'lodash';
import * as THREE from 'three';

/**
 * three.js 工具类
 */
export class ThreeUtil {
  /**
   * 高亮对应模型视图
   * @param {number|string} viewId 视图id
   * @param {import('@/design').ProdItemData} prodItem 产品
   */
  static highlightView(viewId, prodItem) {
    const view = prodItem.viewList.find((e) => e.id == viewId);
    if (!view) {
      return;
    }

    if (!view.canvas?.konvaPath) {
      console.error('view.canvas.konvaPath is null');
      return;
    }

    // 高亮 1=白 0=深, 值越小越深色
    // t1
    const p0 = { n: 0.9 };
    const p1 = { n: 0.28 };
    //t2
    const p2 = { n: 0.28 };
    const p3 = { n: 1 };

    const getColor = (n) => {
      let str = '#4087ff';
      // 将 str颜色 根据 n值 进行渐变，由深蓝色变为浅蓝色, n取值范围为 0~0.8, 0.8~0, 不要纯黑色，只要蓝色
      const color = new THREE.Color(str);
      color.lerp(new THREE.Color('#ffffff'), n);
      str = color.getStyle();

      return str;
    };

    const _color = view.canvas.konvaPath.attrs.fill;

    const start = () => {
      view.canvas.konvaPath.setAttr('fill', '#4087ff');
      view.canvas.updateTexture();
    };

    const update = (n) => {
      view.canvas.konvaPath.setAttr('fill', getColor(n));
      view.canvas.updateTexture();
    };

    const complete = () => {
      view.canvas.konvaPath.setAttr('fill', _color);
      view.canvas.updateTexture();
    };

    // 动画
    const t1 = new TWEEN.Tween(p0)
      .delay(200)
      .to(p1, 400)
      .onUpdate(({ n }) => {
        update(n);
      })
      .onStart(() => {
        start();
      })
      .easing(TWEEN.Easing.Quadratic.InOut);
    const t2 = new TWEEN.Tween(p2)
      .to(p3, 700)
      .onUpdate(({ n }) => {
        update(n);
      })
      .onComplete(() => {
        complete();
      })
      .easing(TWEEN.Easing.Quadratic.InOut);
    t1.chain(t2);
    t1.start();
  }

  /**
   * 旋转相机
   * @param {THREE.Camera} camera 相机
   * @param {Object} position 坐标
   * @param {boolean} animate 是否动画
   */
  static async rotateCamera(camera, position, animate = true) {
    return new Promise((resolve, reject) => {
      // 放大系数
      const ratio = store.state.designApplication.config.canvasSize.ratio;
      const _position = lodash.cloneDeep(position);
      _position.x = _position.x / ratio / 1.5;
      _position.y = _position.y / ratio / 1.5;
      _position.z = _position.z / ratio / 1.5;

      // 位置相同, 不执行, 数值取值范围为 0.01
      if (Math.abs(camera.position.x - _position.x) < 0.01 && Math.abs(camera.position.y - _position.y) < 0.01 && Math.abs(camera.position.z - _position.z) < 0.01) {
        console.log('位置相同, 不执行');
        resolve();
        return;
      }

      // no animate
      if (!animate) {
        camera.position.set(_position.x, _position.y, _position.z);
        camera.lookAt(0, 0, 0);
        resolve();
        return;
      }

      // animate
      if (animate) {
        new TWEEN.Tween(camera.position)
          .to(_position, 800)
          .onUpdate(() => {
            camera.lookAt(camera.position);
          })
          .onComplete(() => {
            resolve();
          })
          .easing(TWEEN.Easing.Quintic.InOut)
          .start();
      }
    });
  }
}

/**
 * 操作选中视角 - three相关操作
 * @param {number} viewId 视角id
 * @param {import('@/design').ProdItemData} prodItem 产品
 */
export async function onSelectViewWithThree(viewId, prodItem) {
  const currentViewId = store.state.designApplication.activeViewId;
  const show3d = store.state.designApplication.show3d;
  prodItem = prodItem || store.getters['designApplication/activeProd'];

  // 如果当前展示3d && 有3d模型
  if (show3d && config3dUtil.isLoad3d(prodItem.config3d) && prodItem.three) {
    const configView = prodItem.config3d.viewList.find((e) => e.viewId == viewId);

    // 1. 有配置相机视角 => 渲染指定相机视角
    if (configView && configView.cameraPosition) {
      const cameraPosition = JSON.parse(configView.cameraPosition);
      await ThreeUtil.rotateCamera(prodItem.three.camera, cameraPosition);
    }

    // 2. => 高亮对应视图
    ThreeUtil.highlightView(viewId, prodItem);
  }
}
