import { CommonProdItem, UseProdDetail } from '@/designApp/interface/commonProd';
import { prodCommonResult } from '@/designApp/mock/prod/prodListByConmon';
import { CommonProdItemParse } from '@/designApp/interface/commonProdParse';

/**
 * 解析通用产品的数据
 * @param {Object} data 通用产品的接口数据
 * @returns {Promise<Array<CommonProdItemParse>>} 通用产品的数据
 * */
export async function parseCommonProd(data = null) {
  if (!data) data = prodCommonResult;
  const list = [];

  // 无数据
  if (!data) return Promise.resolve(list);

  // 数据错误
  if (data && data.retState !== '0') return Promise.resolve(list);

  // 有数据, 进行解析
  for (let row of data.productTypes) {
    list.push(parse(row));
  }

  return Promise.resolve(list);
}

/**
 * 解析
 * @param {Object} row 通用产品的接口数据
 * @returns {CommonProdItemParse} 通用产品的数据
 * */
function parse(row) {
  // 原始数据
  const commonProd = new CommonProdItem();
  Object.assign(commonProd, row);

  // 解析后的数据
  const commonProdItemParse = new CommonProdItemParse();
  // 使用到的数据
  const use = new UseProdDetail();
  Object.assign(use, commonProd);

  // 继承使用到的数据
  Object.assign(commonProdItemParse, use);
  commonProdItemParse.detail = commonProd;

  // 展示图片
  const view = commonProd.appearances[0].views[0];
  commonProdItemParse.showImage = {
    image: view.image,
    texture: view.texture,
    thumbImg: view.thumbImg,
  };

  // 颜色列表
  commonProdItemParse.colorList = parseColorList(commonProd.appearances);

  // 尺码列表
  commonProdItemParse.sizeList = parseSizeList(commonProd.sizes);

  // 印刷区域列表
  commonProdItemParse.printList = parsePrintList(commonProd.printAreas);

  // 印刷指定区域列表
  commonProdItemParse.printoutList = parsePrintoutList(commonProd.pointoutPrintAreas);

  // 视图列表
  commonProdItemParse.viewList = parseViewList(commonProd.views);
  //TODO: 还有各种List没有解析处理，写到了在处理

  return commonProdItemParse;
}

/**
 * 解析印刷区域列表
 * @param {Array} printAreas 印刷区域列表的数据
 * @returns {Array} 印刷区域列表的数据
 * */
function parsePrintList(printAreas) {
  const list = [];
  for (let row of printAreas) {
    list.push({
      id: row.id,
      d: row.boundary.soft.content?.svg.path.d,
      width: row.boundary.size.width,
      height: row.boundary.size.height,
    });
  }
  return list;
}

/**
 * 解析印刷指定区域列表
 * @param {Array} pointoutPrintAreas 印刷指定区域列表的数据
 * @returns {Array} 印刷指定区域列表的数据
 * */
function parsePrintoutList(pointoutPrintAreas) {
  const list = [];
  for (let row of pointoutPrintAreas) {
    list.push({
      id: row.id,
      size: row.size,
      stitching: row.soft.v, //车线
      v: row.soft.v, //车线
    });
  }
  return list;
}

/**
 * 解析视图
 * @param {Array} views 视图的数据
 * @returns {Array} 视图的数据
 * */
function parseViewList(views) {
  const list = [];
  for (let row of views) {
    list.push({
      id: row.id,
      name: row.name,
      offset: row.viewMaps[0].offset,
      canvas: null,
      three: null,
    });
  }
  return list;
}

/**
 * 解析颜色
 * @param {Array} appearances 颜色的数据
 * @returns {Array} 颜色的数据
 * */
function parseColorList(appearances) {
  const list = [];
  for (let row of appearances) {
    list.push({
      id: row.id,
      name: row.name,
      colorCode: row.colors[0].value,
      views: row.views, //视图
      multiAngleImages: row.multiAngleImages, //多角度图片
    });
  }
  return list;
}

/*
 * 解析尺码
 * @param {Array} sizes 尺码的数据
 * @returns {Array} 尺码的数据
 * */
function parseSizeList(sizes) {
  const list = [];
  for (let row of sizes) {
    list.push({
      id: row.id,
      name: row.name,
      sizeType: row.sizeType,
      measures: row.measures,
    });
  }
  return list;
}
