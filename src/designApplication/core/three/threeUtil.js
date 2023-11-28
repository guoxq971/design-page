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

    // 裁剪区域 (变色的关键)
    if (!view.canvas?.konvaPath) {
      console.error('view.canvas.konvaPath is null');
      return;
    }

    if (view.isHighlight) {
      console.log('当前视图正在高亮');
      return;
    }

    // 高亮 1=白 0=深, 值越小越深色
    // t1
    const p0 = { n: 0.95 };
    const p1 = { n: 0.18 };
    //t2
    const p2 = { n: 0.18 };
    const p3 = { n: 0.95 };

    // 当前颜色
    const _color = view.canvas.konvaPath.attrs.fill || '#ffffff';
    const changeColor = '#0c5de1'; //#4087ff
    const getColor = (n) => {
      let str = changeColor;

      // 判断颜色接近蓝色时，使用白色
      // if (['#32409A', '#0165FC', '#0099ff'].includes(_color.toLocaleUpperCase())) {
      if (isColorCloseToBlue(_color)) {
        str = '#ffffff';
      }

      // 将 str颜色 根据 n值 进行渐变，由深蓝色变为浅蓝色, n取值范围为 0~0.8, 0.8~0, 不要纯黑色，只要蓝色
      const color = new THREE.Color(str);
      color.lerp(new THREE.Color(_color), n);
      str = color.getStyle();

      return str;
    };

    // 开始
    const start = () => {
      view.canvas.konvaPath.setAttr('fill', changeColor);
      view.canvas.updateTexture();
      view.isHighlight = true;
    };

    // 过程
    const update = (n) => {
      try {
        view.canvas?.konvaPath.setAttr('fill', getColor(n));
        view.canvas?.updateTexture();
      } catch (e) {
        console.log('update error 高亮过程切换了1', e);
      }
    };

    // 结束
    const complete = () => {
      try {
        if (view) {
          view.canvas?.konvaPath.setAttr('fill', _color);
          view.canvas?.updateTexture();
          view.isHighlight = false;
        }
      } catch (e) {
        console.log('update error 高亮过程切换了2', e);
      }
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
        // console.log('位置相同, 不执行');
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

/**
 * 判断颜色是否接近蓝色
 * @param color
 * @param threshold
 * @returns {boolean}
 */
function isColorCloseToBlue(color, threshold = 200) {
  // 将颜色字符串转换为 RGB 数组
  const rgb = colorToRGB(color);

  // 蓝色的 RGB 值
  const blueColor = [0, 0, 255];

  // 计算颜色与蓝色的欧氏距离
  const distance = Math.sqrt(Math.pow(rgb[0] - blueColor[0], 2) + Math.pow(rgb[1] - blueColor[1], 2) + Math.pow(rgb[2] - blueColor[2], 2));

  // 如果距离小于阈值，则认为颜色接近蓝色
  return distance < threshold;
}

/**
 * 将颜色字符串转换为 RGB 数组
 * @param color
 * @returns {number[]|*|*[]}
 */
function colorToRGB(color) {
  // 如果颜色是十六进制格式，则转换为 RGB 格式
  if (color.startsWith('#')) {
    return [parseInt(color.slice(1, 3), 16), parseInt(color.slice(3, 5), 16), parseInt(color.slice(5, 7), 16)];
  }

  // 如果颜色是 RGB 格式，则直接返回
  if (color.startsWith('rgb(')) {
    return color.match(/\d+/g).map(Number);
  }

  // 如果颜色格式不受支持，则返回空数组
  return [];
}
