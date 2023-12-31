import { ImageListByMyImage } from '@/designApplication/interface/image/imageList';

/**
 * 请取列表
 * @class GetList
 * @param {Array} list 列表
 * @param {Number} total 总数
 * */
export class GetList {
  list = [];
  total = 0;
}

/**
 * 通用产品列表
 * @class GetListByCommonProd
 * @param {ParseProdItem[]} list 列表
 * @param {Number} total 总数
 * */
export class GetListByCommonProd extends GetList {
  list = [];
  total = 0;
}

/**
 * 我的图库列表
 * @class GetListByMyImage
 * @param {ImageListByMyImage[]} list 列表
 * @param {Number} total 总数
 * */
export class GetListByMyImage extends GetList {
  list = [];
  total = 0;
}
