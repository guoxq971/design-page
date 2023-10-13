import { ModelViewItem } from '../interface/modelItem';
import { createCanvasTexture } from '../utils/createTexture';
import { draw } from '../utils/modelViewUtil';
import * as THREE from 'three';

/**
 * 获取模型视图列表
 * @param {object} prod 产品数据
 * @param {array} meshList 模型网格列表
 * @param {object} config3d 3d配置数据
 * @return {array} 模型视图列表
 * */
export function getViewList(prod, meshList, config3d) {
  const prodViewList = prod.viewList; // 2d视图列表

  return config3d.viewList.map((v) => {
    // 模型视图对应的2d视图数据
    const prodView = prodViewList.find((item) => item.id == v.viewId);
    // 模型视图对应的网格
    const mesh = findMesh(meshList, v.materialName);

    // 初始化模型视图数据
    const modelView = new ModelViewItem();
    modelView.prodView = prodView; //可能没有
    modelView.viewConfig = v;
    modelView.colorConfig = getColorConfig(prod, v.materialName, config3d);
    modelView.mesh = mesh;

    // 有2d视图时，设置画布背景颜色(底色), 创建纹理, 设置纹理, 添加事件
    if (prodView) {
      prodView.fabricCanvas.setBgColor(modelView.colorConfig.colorCode); //设置画布背景颜色(底色)

      mesh.material.map = createCanvasTexture(); //设置纹理
      mesh.material.map.image = prodView.fabricCanvas.getTextureCanvas(); //替换纹理图片为canvas
      prodView.fabricCanvas.addEvent(() => draw(modelView));
    } else {
      // 无2d视图时，设置网格颜色(底色)
      mesh.material.color = new THREE.Color(modelView.colorConfig.colorCode);
    }

    return modelView;
  });
}

/**
 * 获取3d颜色对象
 * @param {object} prod 产品数据
 * @param {string} materialName 材质名称
 * @param {object} config3d 3d配置数据
 * @return {object} 3d颜色对象
 * */
function getColorConfig(prod, materialName, config3d) {
  // 当前选中的颜色
  const activeProdColor = prod.activeColor;
  // 当前选中的颜色对应的3d颜色配置
  const modelColor = config3d.colorList.find((e) => e.colorName === activeProdColor.name);

  return modelColor?.list.find((e) => e.materialName === materialName);
}

/**
 * 查找网格
 * @param {array} meshList 模型网格列表
 * @param {string} materialName 材质名称
 * @return {Mesh} 网格
 * */
function findMesh(meshList, materialName) {
  // [iron_sheet, iron sheet], materialName如果存在下划线，会被分割成两个字符串
  const names = [materialName];

  if (materialName.indexOf('_') > -1) {
    names.push(materialName.replace('_', ' '));
  }

  return meshList.find((mesh) => names.includes(mesh.name));
}
