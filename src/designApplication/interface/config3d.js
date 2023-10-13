/**
 * 产品的3d配置信息
 * @typedef {Object} Config3d
 * @property {string} templateNo 模板编号
 * @property {string} glbPath glb文件路径
 * @property {string} zipPath zip文件路径
 * @property {number} openflag2d 是否启用2d配置 0-开启 1-关闭
 * @property {number} openflag3d 是否启用3d配置 0-开启 1-关闭
 * @property {number} uvdflag 是否开启uvd 0-开启 1-关闭 (裁片打印图)
 * @property {number} hasUpload2d 是否上传2d文件 1-已上传 0-未上传
 * @property {number} hasUpload3d 是否上传3d文件 1-已上传 0-未上传
 * @property {string} seqId 主键
 * @property {Config3dViewItem[]} viewList 视图列表
 * @property {Config3dColorItem[]} colorList 颜色列表
 * */
export class Config3d {
  templateNo;
  glbPath;
  zipPath;
  openflag2d;
  openflag3d;
  uvdflag;
  hasUpload2d;
  hasUpload3d;
  seqId;
  viewList;
  colorList;
}

/**
 * 产品的3d配置信息-视图item
 * @typedef {Object} Config3dViewItem
 * @property {string} seqId 主键
 * @property {string} templateId 模板id
 * @property {string} templateNo 模板编号
 * @property {string} viewId 视图id
 * @property {string|null} viewRelation 视图关系
 * @property {string} viewName 视图名称
 * @property {string} materialName 材质名称
 * @property {string} uvD uvD
 * @property {string} uvV uvV
 * @property {number} useflag 是否启用 0-启用 1-关闭
 * @property {number} sortNo 排序号
 * @property {string} cameraPosition 相机位置
 * @property {string} cameraRotation 相机旋转
 * @property {number} configType 配置类型 0-通用 1-精细
 * @property {string|null} size 尺寸
 * @property {string} createUser 创建人
 * @property {string} createTime 创建时间
 * @property {string} updateUser 更新人
 * @property {string} updateTime 更新时间
 * */
export class Config3dViewItem {
  seqId;
  templateId;
  templateNo;
  viewId;
  viewRelation;
  viewName;
  materialName;
  uvD;
  uvV;
  useflag;
  sortNo;
  cameraPosition;
  cameraRotation;
  configType;
  size;
  createUser;
  createTime;
  updateUser;
  updateTime;
}

/**
 * 产品的3d配置信息-颜色item
 * @typedef {Object} Config3dColorItem
 * @property {string} colorName 颜色名称
 * @property {string} colorCode 颜色编码
 * @property {Config3dColorListItem[]} list 视图列表
 * */
export class Config3dColorItem {
  colorName;
  colorCode;
  list;
}

/**
 * 产品的3d配置信息列表-颜色item
 * @typedef {Object} Config3dColorListItem
 * @property {string} seqId 主键
 * @property {string} templateId 模板id
 * @property {string} templateNo 模板编号
 * @property {string} colorName 颜色名称
 * @property {number} viewId 视图id
 * @property {string} colorCode 颜色编码
 * @property {number} useflag 是否启用 0-启用 1-关闭
 * @property {number} sortNo 排序号
 * @property {string} createUser 创建人
 * @property {string} createTime 创建时间
 * @property {string} updateUser 更新人
 * @property {string} updateTime 更新时间
 * @property {string} viewName 视图名称
 * @property {string} materialName 材质名称
 * @property {number} configType 配置类型 0-通用 1-精细
 * @property {string|null} size 尺寸
 * */
export class Config3dColorListItem {
  seqId;
  templateId;
  templateNo;
  colorName;
  viewId;
  colorCode;
  useflag;
  sortNo;
  createUser;
  createTime;
  updateUser;
  updateTime;
  viewName;
  materialName;
  configType;
  size;
}
