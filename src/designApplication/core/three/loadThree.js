import { MyThree } from '@/designApplication/core/three/index';
import { loadModel } from '@/designApplication/core/utils/loadModel';
import { MeshItem } from '@/designApplication/interface/meshItem';
import store from '@/store';
import * as THREE from 'three';
import { ProdItem } from '@/designApplication/interface/prodItem';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

/**
 * 加载three参数
 * @class LoadThreeParam
 * @property {string} id 容器id
 * @property {string} path 模型路径
 * @property {boolean} loading 是否显示加载动画
 * @property {ProdItem} prodItem 产品
 * */
class LoadThreeParam {
  id = 'three-container';
  path;
  loading = false;
  prodItem;
}

/**
 * 加载three
 * @function loadThree
 * @param {LoadThreeParam} param 参数
 * */
export async function loadThree(param = new LoadThreeParam()) {
  param = Object.assign(new LoadThreeParam(), param);
  if (param.prodItem) {
    param.path = 'http://file.testcustomwe.com/' + param.prodItem.config3d.glbPath;
  }

  try {
    param.loading && loading3dOpen();

    // 初始化three
    const t = new MyThree({ id: param.id, templateNo: param.prodItem.detail.templateNo });

    // 保存到prodItem
    if (param.prodItem) {
      param.prodItem.three = t;
    }

    // 加载模型
    const result = await loadModel(param.path);
    t.scene.add(result.model);
    t.model = result.model;
    t.meshList = result.meshList;
    t.meshPlusList = result.meshList.map((e) => {
      const meshItem = new MeshItem();
      meshItem.mesh = e;
      meshItem.canvas = null;
      meshItem.view = getViewByMaterialName(meshItem.mesh.name, param.prodItem);
      return meshItem;
    });

    // 加载canvas材质 and 模型底色
    loadCanvasTexture(t.meshPlusList);
  } finally {
    param.loading && loading3dClose();
  }
}

function loading3dOpen() {
  store.commit('designApplication/setLoading3d', true);
}

function loading3dClose() {
  store.commit('designApplication/setLoading3d', false);
}

/**
 * 根据材质名称获取对应的视图
 * @param {string} materialName 材质名称
 * @param {import('@/design').ProdItemData} prodItem 产品
 * @returns {import('@/design').ParseViewItem|null} 视图
 * */
function getViewByMaterialName(materialName, prodItem) {
  const config3dView = prodItem.config3d.viewList.find((e) => e.materialName === materialName);
  let view = null;
  if (config3dView) {
    view = prodItem.viewList.find((e) => e.id == config3dView.viewId);
  }

  return view;
}

/**
 * 加载 canvas 到对应的 mesh 上
 * @param {MeshItem[]} meshPlusList 模型的材质列表
 * */
function loadCanvasTexture(meshPlusList) {
  const config = DesignerUtil.getConfig();
  if (!config) {
    console.error('加载 canvas 到对应的 mesh 上 失败，config 为空');
    return;
  }
  meshPlusList.forEach((item) => {
    const { mesh, view } = item;
    const color3dItem = config.get3dColorItemByMaterialName(mesh.name);

    if (!color3dItem) {
      console.error('加载 canvas 到对应的 mesh 上 失败，color3dItem 为空');
      return;
    }

    // 如果是玻璃材质，不需要处理
    if (DesignerUtil.hasGlass(color3dItem.colorCode)) {
      console.log('玻璃材质', mesh.name);
      return;
    }
    // 这是没有canvas的mesh, 要设置底色
    if (!view) {
      console.log('没有canvas的mesh', mesh.name);
      mesh.material.color.set(color3dItem.colorCode);
      return;
    }

    const canvas = view.canvas?.stage.content.querySelectorAll('canvas');
    if (!canvas) {
      console.error('加载 canvas 到对应的 mesh 上 失败，canvas 为空');
      return;
    }
    const targetCanvas = canvas[0];
    item.canvas = targetCanvas;

    const texture = new THREE.CanvasTexture(targetCanvas);
    texture.encoding = THREE.sRGBEncoding; // 设置编码格式
    texture.flipY = false; // 纹理是否沿y轴翻转

    mesh.material.map = texture;
    mesh.material.needsUpdate = true;

    view.texture = texture;
    view.updateTexture = (num) => {
      // console.log('执行了更新', num);
      texture.needsUpdate = true;
    };
  });
}
