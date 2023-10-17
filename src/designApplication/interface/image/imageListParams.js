/**
 * 列表参数 - 没有用到的字段
 * */
class NoUseImageListParams {
  designerId = ''; //插画师  -1全部 1无风险 2微风险 3较风险 4高风险
  tort_type = -1; //风险等级   -1全部 1无风险 2微风险 3较风险 4高风险
  isAll = ''; //是否全幅 ''-全部 1-是 0-否
  copyright = ''; //是否侵权 ''-全部 1-是 0-否 2-漂白
  quality = ''; //图片质量 0-未分类 1-精品 2-良
  imageType = ''; //图片格式 -1全部
  'qty[from]' = ''; //出单次数开始
  'qty[to]' = ''; //出单次数开始
  'width[from]' = ''; //宽度范围开始
  'width[to]' = ''; //宽度范围结束
  'height[from]' = ''; //高度范围开始
  'height[to]' = ''; //高度范围结束
  'created[from]' = ''; //上传时间范围开始
  'created[to]' = ''; //上传时间范围开始
  'modified[from]' = ''; //最近修改时间范围开始
  'modified[to]' = ''; //最近修改时间范围开始
  mediaType = 'json';
  gxtype1 = ''; //共享类-一级下拉
  gxtype2 = ''; //共享类-二级下拉
  gxsx = 0; //共享类-筛选未使用的共享类 0-不筛选 1-筛选
  templateNo = '';
  orderImg = '';
  gxcopyright = ''; //共享类-是否侵权 ''-全部 1-是 0-否 2-漂白
  gxImgQuality = ''; //共享类-图片质量 0-未分类 1-精品 2-良
  gxSearchText = '';
}

/**
 * 列表参数 - 我的图库
 * @class ImageListParams
 * @constructor
 * @param {String} query - 标题、编号
 * @param {String} typeId - 所有图案
 *
 * @param {String} gxSearchText - 共享类-搜索关键字
 * @param {String} customerId - 子账号 (-1=专享共享图)
 * @param {String} designerId - 插画师  -1全部 1无风险 2微风险 3较风险 4高风险
 * @param {String} tort_type - 风险等级   -1全部 1无风险 2微风险 3较风险 4高风险
 *
 * @param {String} isAll - 是否全幅 ''-全部 1-是 0-否
 * @param {String} copyright - 是否侵权 ''-全部 1-侵权 0-非侵权 2-漂白
 * @param {String} imageType - 图片格式 ''-全部 .png-.png .jpg-.jpg
 *
 * @param {String} quality - 图片质量 0-未分类 1-精品 2-良
 * @param {String} qty[from] - 出单次数开始
 * @param {String} qty[to] - 出单次数开始
 * @param {String} width[from] - 宽度范围开始
 * @param {String} width[to] - 宽度范围结束
 * @param {String} height[from] - 高度范围开始
 * @param {String} height[to] - 高度范围结束
 * @param {String} created[from] - 上传时间范围开始
 * @param {String} created[to] - 上传时间范围开始
 * @param {String} modified[from] - 最近修改时间范围开始
 * @param {String} modified[to] - 最近修改时间范围开始
 * @param {String} mediaType - json
 * @param {String} gxtype1 - 共享类-一级下拉
 * @param {String} gxtype2 - 共享类-二级下拉
 * @param {String} gxsx - 共享类-属性下拉
 * @param {String} templateNo - 模板编号
 * @param {String} gxImgQuality - 共享类-图片质量 0-未分类 1-精品 2-良
 * @param {number} limit - 每页条数
 * @param {number} offset - 页码偏移量
 *
 * @param {number} total - 总条数
 * @param {number} pageNum - 当前页码
 * @param {number} pageSize - 每页条数
 * */
export class ImageListParams extends NoUseImageListParams {
  query = ''; //标题、编号
  typeId = ''; //【请选择图片来源-专属共享类】所有图案
  customerId = ''; //【请选择图片来源-非专属共享类】子账号 (-1=专享共享图)

  limit = 24;
  offset = 0;

  total = 0;
  pageNum = 1;
  pageSize = 24;
}

/**
 * 列表参数 - 共享图库
 * */
export class ShareImageListParams extends ImageListParams {
  tort_type = '';
  typeId = '';
  gxtype1 = '';
  gxtype2 = '';
}

/**
 * 列表参数 - 小组图库
 * */
export class GroupImageListParams extends ImageListParams {
  queryAll = '';
  tort_type = -1;
  gxsx = 0;
}

/**
 * 管理员图库
 * @class AdminImageListParams
 * @constructor
 * @param {String} pageNum - 当前页码
 * @param {String} pageSize - 每页条数
 * @param {String} queryinput - 标题、编号
 * @param {String} adminType - 图片类型
 * @param {String} isAll - 是否全幅 ''-全部 1-是 0-否
 * @param {String} copyright - 是否侵权 ''-全部 1-侵权 0-非侵权 2-漂白
 * @param {String} imageType - 图片格式 ''-全部 .png-.png .jpg-.jpg
 * @param {String} sortMode - 查询单数;
 *
 * @param {String} query - 标题、编号
 * @param {String} total -
 * @param {String} offset -
 * */
export class AdminImageListParams {
  pageNum = 1;
  pageSize = 24;
  queryinput = '';
  adminType = '';
  isAll = '';
  copyright = '';
  imageType = '';
  sortMode = 1;

  query;
  total;
  offset;
}
