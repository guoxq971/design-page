/**
 * 更新模型
 * @param {ModelViewItem} modelView 模型视图
 * */
export function draw(modelView) {
  modelView.mesh.material.map.needsUpdate = true;
}

/**
 * 是否有激活的对象
 * @param {ModelViewItem} modelView 模型视图
 * @return {boolean} 是否有激活的对象 true: 有 false: 没有
 * */
export function hasActiveObject(modelView) {
  return modelView?.prodView.fabricCanvas.canvas.getActiveObject();
}
