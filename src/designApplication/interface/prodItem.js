import { ParseProdItem } from '@/designApplication/interface/commonProdParse';
import { Message } from 'element-ui';
import { MyThree } from '@/designApplication/core/three';

/**
 * 产品工具类
 * @class
 * @method disposeCommon 处理通用产品数据
 * */
export class ProdUtil {
  /**
   * 处理产品数据 (通用产品)
   * @param {import('@/design').ProdListDataItem} detail 产品数据
   * @param {import('@/design').ProdConfig3dResponseData} config3d 3d配置
   * @returns {import('@/design').ProdListDataItem} 产品
   * */
  static disposeCommon(detail, config3d) {
    // 初始化产品, 并添加到仓库
    const prod = new ProdItem();
    prod.detail = detail;
    prod.type = ProdType.common;
    prod.sizeId = '';
    prod.viewList = detail.viewList;
    prod.colorList = detail.colorList;
    prod.sizeList = detail.sizeList;
    prod.three = null;
    prod.config3d = config3d;

    return prod;
  }

  /**
   * 处理产品数据 (精细产品, 仅仅是初始化)
   * @param {import('@/design').ProdConfig3dResponseRefineData} refineItemResponse 精细列表的接口返回值
   * @param {import('@/design').ProdListDataItem} detail 产品数据
   * @returns {ProdItem} 产品
   * */
  static disposeRefine(refineItemResponse, detail) {
    const sizeId = detail.sizeList.find((e) => e.name === refineItemResponse.size)?.id;
    if (!sizeId) {
      Message.warning('精细模板初始化失败!');
      throw new Error('disposeRefine: sizeId is null');
    }

    // 初始化产品, 并添加到仓库
    const prod = new ProdItem();
    prod.detail = null;
    prod.type = ProdType.refine;
    prod.size = refineItemResponse.size;
    prod.sizeType = refineItemResponse.sizeType;
    prod.sizeId = sizeId;
    prod.viewList = [];
    prod.colorList = [];
    prod.sizeList = [];
    prod.three = null;
    prod.config3d = refineItemResponse;

    return prod;
  }
}

/**
 * 产品
 * @class
 * @property {ParseProdItem} detail 产品详情
 * @property {number} type 产品类型 1-通用产品 2-精细产品
 * @property {string} sizeId 尺码id (精细产品才有)
 * @property {ParseViewItem[]} viewList 视图列表
 * @property {Array<any>} colorList 颜色列表
 * @property {Array<any>} sizeList 尺码列表
 * @property {MyThree} three three对象
 * @property {Config3d|null} config3d 3d配置
 * @property {Array<any>} priceList 价格列表
 * @property {string} isSpecial 价格参数
 * */
export class ProdItem {
  detail = new ParseProdItem();
  type;
  sizeId;
  size;
  sizeType;
  viewList;
  colorList;
  sizeList;
  three;
  config3d;
  priceList = [];
  isSpecial = '';
}

/**
 * 产品类型
 * @enum {number}
 * @property {number} common 通用产品
 * @property {number} refine 精细产品
 * */
export class ProdType {
  static common = 1;
  static refine = 2;

  static isCommon(type) {
    return type === ProdType.common;
  }

  static isRefine(type) {
    return type === ProdType.refine;
  }
}
