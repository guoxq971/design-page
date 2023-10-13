/**
 * 精细列表
 * @class Prod3dConfigByRefineListItem
 * @property {string} seqId 主键
 * @property {string} templateNo 模板编号
 * @property {string} size 尺码
 * @property {string} sizeType 尺码类型
 * @property {number} useflag 是否启用 0-启用 1-禁用
 * @property {number} uvdflag 是否启用uvd 0-启用 1-禁用
 * @property {string} glbPath glb路径
 * @property {string} gltlPath gltl路径
 * @property {number} hasUpload2d 是否已上传2d 1-已上传 0-未上传
 * @property {number} hasUpload3d 是否已上传3d 1-已上传 0-未上传
 * @property {number} openflag2d 是否开启2d 0-开启 1-关闭
 * @property {number} openflag3d 是否开启3d 0-开启 1-关闭
 * @property {number} hasUpload2dCommon 是否已上传2d通用 1-已上传 0-未上传
 * @property {number} hasUpload3dCommon 是否已上传3d通用 1-已上传 0-未上传
 * @property {number} openflag2dCommon 是否开启2d通用 0-开启 1-关闭
 * @property {number} openflag3dCommon 是否开启3d通用 0-开启 1-关闭
 * */
export class Prod3dConfigByRefineListItem {
  seqId;
  templateNo;
  size;
  sizeType;
  useflag;
  uvdflag;
  glbPath;
  gltlPath;
  hasUpload2d;
  hasUpload3d;
  openflag2d;
  openflag3d;
  hasUpload2dCommon;
  hasUpload3dCommon;
  openflag2dCommon;
  openflag3dCommon;
}
