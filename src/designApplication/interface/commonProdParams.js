/**
 * 通用产品列表接口的参数
 * @class CommonProdParams
 * @constructor
 * @param {Number} limit - 限制条数
 * @param {Boolean} fullData - 是否返回完整数据
 * @param {Boolean} isFbaTemplate - 是否是FBA产品 0-通用产品 1-FBA产品
 * @param {Number} pageNo - 页码
 * @param {Number} pageSize - 页大小
 * @param {String} category1 - 一级分类
 * @param {String} category2 - 二级分类
 * @param {String} tempalteNoOrName - 模板编号或名称
 * */
export class CommonProdParams {
  mediaType = 'json';
  locale = 'zh_CN';
  limit = 100;
  fullData = true;
  isFbaTemplate = 0;
  pageNo = 1;
  pageSize = 4 * 7;
  category1;
  category2;
  tempalteNoOrName;
}

/**
 * 产品列表 - 接口参数 - FBA产品
 * @class FbaProdParams
 * */
export class FbaProdParams extends CommonProdParams {
  isFbaTemplate = 1;
}

/**
 * 产品列表 - 接口参数 - 收藏产品
 * @class FbaProdParams
 * @param {String} custom_category - 自定义分类
 * */
export class CollectProdParams extends CommonProdParams {
  custom_category = 0;
  isFull = 0;
  isNew = 0;
  collectFlag = 1;
}
