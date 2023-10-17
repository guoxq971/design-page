/**
 * 设计图列表-我的图库
 * @class ImageListByMyImage
 * @param {String} id 图片id
 * @param {String} name 图片名称
 * @param {String} description 图片描述
 * @param {String} imageCode 图片编码
 * @param {Number} orderNums 订单数量
 * @param {Number} count 下载次数
 * @param {Number} dpi 分辨率
 * @param {Object} standard 规格
 * @param {Object} size 尺寸
 * @param {any[]} colors 颜色
 * @param {any[]} designCategories 设计分类
 * @param {String} previewImg 预览图
 * @param {String} designImg 设计图
 * @param {String} hdDesignImage 高清设计图
 * @param {String} isAll 是否全幅 0-否 1-是
 * @param {Boolean} isBg 是否背景图 false-否 true-是
 * @param {String} tortType 侵权类型 1-不侵权 2-侵权
 * @param {String} isRisk 是否有风险 0-无风险 1-有风险
 * @param {String} isHasRisk 是否有风险词 0-无风险词汇 1-有风险词汇
 * @param {String} lowRiskWords 低风险词
 * @param {String} highRiskWords 高风险词
 * @param {String} creator 创建人
 * */
export class ImageListByMyImage {
  name;
  description;
  isAll;
  imageCode;
  orderNums;
  count;
  dpi;
  standard;
  creator;
  size;
  colors;
  designCategories;
  id;
  isBg;
  tortType;
  previewImg;
  designImg;
  hdDesignImage;
  isRisk;
  lowRiskWords;
  highRiskWords;
  isHasRisk;
}
