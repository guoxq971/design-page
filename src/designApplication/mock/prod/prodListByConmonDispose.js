import { ProdItemDetail, UseProdDetail } from '@/designApplication/interface/commonProd';
import { prodCommonResult } from '@/designApplication/mock/prod/prodListByConmon';
import { ParseProdItem } from '@/designApplication/interface/commonProdParse';
import { ParseViewItem } from '@/designApplication/interface/parseViewItem';
import { ParsePrintItem } from '@/designApplication/interface/parsePrintItem';
import { ParseColorItem } from '@/designApplication/interface/parseColorItem';
import { ParseSizeItem } from '@/designApplication/interface/parseSizeItem';
import { fetchProdListByCommon } from '@/designApplication/mock/prod/prodListByCommon2';
import { GetListByCommonProd } from '@/designApplication/interface/getList';

/**
 * 解析通用产品的数据
 * @param {Object|null} params 参数
 * @returns {Promise<GetListByCommonProd>} 通用产品的数据
 * */
export async function parseCommonProd(params) {
  const result = new GetListByCommonProd();
  const res = await fetchProdListByCommon(params); //通过接口获取数据
  // const res = prodCommonResult; //通过mock获取数据(写死的)
  if (res.retState !== '0') return Promise.resolve(result);
  // console.log(res);

  // 无数据
  if (!res.productTypes) return Promise.resolve(result);

  // 有数据, 进行解析
  for (let row of res.productTypes) {
    result.list.push(parseProdItemDetail(row));
  }
  result.total = res.count;

  return Promise.resolve(result);
}

/**
 * 解析
 * @param {ProdItemDetail} row 产品的接口数据
 * @returns {ParseProdItem} 产品的数据
 * */
export function parseProdItemDetail(row) {
  // 原始数据
  const prodItemDetail = new ProdItemDetail();
  Object.assign(prodItemDetail, row);

  // 解析后的数据
  const parseProdItem = new ParseProdItem();
  // 使用到的数据
  const use = new UseProdDetail();
  Object.assign(use, prodItemDetail);

  // 继承使用到的数据
  Object.assign(parseProdItem, use);
  parseProdItem.detail = prodItemDetail;

  // 展示图片
  const view = prodItemDetail.appearances[0].views[0];
  parseProdItem.showImage = {
    image: view.image,
    texture: view.texture,
    thumbImg: view.thumbImg,
  };

  // 颜色列表
  parseProdItem.colorList = parseColorList(prodItemDetail.appearances);

  // 尺码列表
  parseProdItem.sizeList = parseSizeList(prodItemDetail.sizes);

  // 印刷区域列表
  parseProdItem.printList = parsePrintList(prodItemDetail.printAreas);

  // 印刷指定区域列表
  parseProdItem.printoutList = parsePrintoutList(prodItemDetail.pointoutPrintAreas);

  // 视图列表 viewList
  parseProdItem.viewList = parseViewList(prodItemDetail.views);
  //TODO: 还有各种List没有解析处理，写到了在处理

  return parseProdItem;
}

/**
 * 解析印刷区域列表
 * @param {Array} printAreas 印刷区域列表的数据
 * @returns {Array<ParsePrintItem>} 印刷区域列表的数据
 * */
function parsePrintList(printAreas) {
  const list = [];
  for (let row of printAreas) {
    const parsePrintItem = new ParsePrintItem();
    parsePrintItem.id = row.id;
    parsePrintItem.d = row.boundary.soft.content?.svg.path.d; //车线
    parsePrintItem.width = row.boundary.size.width;
    parsePrintItem.height = row.boundary.size.height;
    list.push(parsePrintItem);
  }
  return list;
}

/**
 * 解析印刷指定区域列表
 * @param {Array} pointoutPrintAreas 印刷指定区域列表的数据
 * @returns {Array<ParseSizeItem>} 印刷指定区域列表的数据
 * */
function parsePrintoutList(pointoutPrintAreas) {
  const list = [];
  for (let row of pointoutPrintAreas) {
    const parseSizeItem = new ParseSizeItem();
    parseSizeItem.id = row.id;
    parseSizeItem.size = row.size;
    parseSizeItem.stitching = row.soft.v; //车线
    parseSizeItem.v = row.soft.v; //车线
    list.push(parseSizeItem);
  }
  return list;
}

/**
 * 解析视图
 * @param {Array} views 视图的数据
 * @returns {Array<ParseViewItem>} 视图的数据
 * */
function parseViewList(views) {
  const list = [];
  for (let row of views) {
    const parseViewItem = new ParseViewItem();
    parseViewItem.id = row.id;
    parseViewItem.name = row.name;
    parseViewItem.offset = row.viewMaps[0].offset;
    parseViewItem.canvas = null;
    parseViewItem.texture = null;
    parseViewItem.updateTexture = null;
    parseViewItem.rect = null;
    list.push(parseViewItem);
  }
  return list;
}

/**
 * 解析颜色
 * @param {Array} appearances 颜色的数据
 * @returns {Array<ParseColorItem>} 颜色的数据
 * */
function parseColorList(appearances) {
  const list = [];
  for (let row of appearances) {
    const parseColorItem = new ParseColorItem();
    parseColorItem.id = row.id;
    parseColorItem.name = row.name;
    parseColorItem.colorCode = row.colors[0].value;
    parseColorItem.views = row.views; //视图
    parseColorItem.multiAngleImages = row.multiAngleImages; //多角度图片
    list.push(parseColorItem);
  }
  return list;
}

/*
 * 解析尺码
 * @param {Array} sizes 尺码的数据
 * @returns {Array<ParseSizeItem>} 尺码的数据
 * */
function parseSizeList(sizes) {
  const list = [];
  for (let row of sizes) {
    const parseSizeItem = new ParseSizeItem();
    parseSizeItem.id = row.id;
    parseSizeItem.name = row.name;
    parseSizeItem.sizeType = row.sizeType;
    parseSizeItem.measures = row.measures;
    list.push(parseSizeItem);
  }
  return list;
}
