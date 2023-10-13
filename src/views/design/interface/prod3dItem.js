export class Prod3dItem {
  constructor(obj) {
    // 主键
    this.seqId = obj.seqId;
    // 模板号
    this.templateNo = obj.templateNo;
    // 模型路径
    this.glbPath = obj.glbPath;
    // 压缩包路径
    this.zipPath = obj.zipPath;
    // 视图列表
    this.viewList = obj.viewList;
    // 颜色列表
    this.colorList = obj.colorList;
    // 3d配置是否开启 0-开启 1-关闭
    this.openflag = obj.openflag;
    // 裁片打印图是否开启(是否启用uv作为模型的车线) 0-开启 1-关闭
    this.uvdflag = obj.uvdflag;
    // 是否加载3d模型
    this.isLoadModel = isLoad(this);
  }
}

/**
 * 是否加载3d模型
 * @param {Object} obj 模型配置
 * @returns {Boolean} 是否加载3d模型
 * */
function isLoad(obj) {
  if (!obj) return false;
  // 1.有模型路径 2.uvd和uvv必须配置 3.openflag要已开启
  const glbPath = obj.glbPath;
  const isUvd = obj.viewList.some((e) => e.uvD && e.uvV);
  const openflag = obj.openflag === 0;
  return glbPath && isUvd && openflag;
}
