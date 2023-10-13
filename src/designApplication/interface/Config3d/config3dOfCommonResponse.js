/**
 * 3d配置工具类
 * @class config3dUtil
 * @method isLoad3d 是否能加载3d
 * */
export class config3dUtil {
  /**
   * 是否能加载3d
   * @param {Config3d} config3d 3d配置
   * @returns {boolean} 是否能加载3d true-能加载 false-不能加载
   * */
  static isLoad3d(config3d) {
    let flag = true;

    // 视图配置已不存在
    if (!config3d.viewList || config3d.viewList.length === 0) {
      console.error('视图配置已不存在', config3d);
      flag = false;
    }

    // 配置为空
    if (!config3d) flag = false;

    // 未上传3d
    if (config3d.hasUpload3d === 0) flag = false;

    // 未开启3d
    if (config3d.openflag3d === 1) flag = false;

    return flag;
  }

  /**
   * 获取可使用精细产品的列表
   * @param {Prod3dConfigByRefineListItem[]} refineList
   * @returns {Prod3dConfigByRefineListItem[]} 可使用精细产品的列表
   * */
  static getOpenRefineList(refineList) {
    return refineList.filter((e) => {
      // 是否上传2d模板
      const isUpload2d = e.hasUpload2d === 1;
      // 是否开启2d模板
      const isOpen2d = e.openflag2d === 0;

      return isUpload2d && isOpen2d;
    });
  }
}

/**
 * 通用模板3d配置的响应数据
 * @class Config3d
 * @property {string} seqId 主键
 * @property {string} templateNo 模板编号
 * @property {string} zipPath 压缩包路径
 * @property {string} glbPath glb路径
 * @property {boolean} hasUpload2d 是否已上传2d 1-已上传 0-未上传
 * @property {boolean} hasUpload3d 是否已上传3d 1-已上传 0-未上传
 * @property {boolean} openflag2d 是否开启2d 0-开启 1-关闭
 * @property {boolean} openflag3d 是否开启3d 0-开启 1-关闭
 * @property {boolean} uvdflag 是否开启uvd 0-开启 1-关闭
 * @property {Config3dOfViewItem[]} viewList 视图列表
 * @property {Config3dOfColorItem[]} colorList 颜色列表
 * */
export class Config3d {
  seqId;
  templateNo;
  zipPath;
  glbPath;
  hasUpload2d;
  hasUpload3d;
  openflag2d;
  openflag3d;
  uvdflag;
  viewList;
  colorList;
}

/**
 * 模板3d配置的响应数据的viewList中的每一项
 * @class Config3dOfCommonViewItem
 * @property {string} seqId 主键
 * @property {number} configType 配置类型 1-通用 2-精细
 * @property {string} templateId 模板id
 * @property {string} templateNo 模板编号
 * @property {number} viewId 视图id
 * @property {string} viewName 视图名称(产品模板那边手动填写的)
 * @property {string} materialName 材质名称
 * @property {string|null} size 尺码(通用为null，精细为尺码名称)
 * @property {number} sortNo 排序号
 * @property {number} useflag 是否启用 0-启用 1-禁用
 * @property {string|null} uvD 视图的uv展示字符串(可能为空)
 * @property {string|null} uvV 视图的uv展示字符串(可能为空)
 * @property {number|null} viewRelation 视图关联(可能为空,关联的是viewId)
 * @property {string|null} cameraPosition 相机位置(可能为空)
 * @property {string|null} cameraRotation 相机旋转(可能为空)
 * @property {string} updateTime 更新时间
 * @property {string} updateUser 更新人
 * @property {string} createTime 创建时间
 * @property {string} createUser 创建人
 * */
export class Config3dOfViewItem {
  seqId;
  configType;
  templateId;
  templateNo;
  viewId;
  viewName;
  materialName;
  size;
  sortNo;
  useflag;
  uvD;
  uvV;
  viewRelation;
  cameraPosition;
  cameraRotation;

  updateTime;
  updateUser;
  createTime;
  createUser;
}

/**
 * 模板3d配置的响应数据的colorList中的每一项
 * @class Config3dOfColorItem
 * @property {string|null} colorCode 颜色编码
 * @property {string} colorName 颜色名称
 * @property {Array<Config3dOfColorListItem>} list 颜色列表
 */
export class Config3dOfColorItem {
  colorCode;
  colorName;
  list = [];
}

/**
 * 模板3d配置的响应数据的colorList中的list的每一项
 * @class Config3dOfColorListItem
 * @property {number} configType 配置类型 1-通用 2-精细
 * @property {number} viewId 视图id
 * @property {string} templateId 模板id
 * @property {string} templateNo 模板编号
 * @property {string|null} size 尺码(通用为null，精细为尺码名称)
 * @property {string} colorCode 颜色编码
 * @property {string} colorName 颜色名称
 * @property {string} materialName 材质名称
 * @property {number} useflag 是否启用 0-启用 1-禁用
 * @property {string|null} viewName 视图名称(产品模板那边手动填写的)
 * @property {number|null} sortNo 排序号
 * @property {string} createTime 创建时间
 * @property {string} createUser 创建人
 * @property {string} updateTime 更新时间
 */
export class Config3dOfColorListItem {
  configType;
  viewId;
  templateId;
  templateNo;
  size;
  colorCode;
  colorName;
  materialName;
  viewName;
  useflag;
  sortNo;
  createTime;
  createUser;
  updateTime;
}
