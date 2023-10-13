export class ModelItem {
  model; //模型
  config; //3d配置数据
  prod; //产品对象 【new ProdItem()】
  viewList = []; //模型视图列表 【new ModelViewItem()】
}

export class ModelViewItem {
  mesh; //模型网格 【new THREE.Mesh()】

  prodView; //2d视图对象 【new ProdViewItem()】
  viewConfig; //3d视图配置的接口数据
  colorConfig; //3d颜色配置的接口数据
}
