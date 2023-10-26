/**
 * 通用产品列表接口的参数
 * @type {import('@/design').ProdListParams}
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
