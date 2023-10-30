import { ListData, ResponseData, ResponseDataOld } from './global';
import { KonvaCanvas } from '../core/canvas_2/konvaCanvas.js';
import type { Texture } from 'three';

/**
 * @interface ProdItemResponse
 * @description: 产品列表返回值
 */
export interface ProdItemResponse {
  seqId: string; //主键
  templateName: string; // 模板名称
  templateNo: string; // 模板编号
  templateNameShow: string; // 模板显示的title
  templateModel: string; // 模板型号
  dpi: number; // dpi
  imgFull: string; // 是否全幅
  views: any[]; // 视图 Array
  appearances: any[]; // 颜色 Array
  sizes: any[]; // 尺码 Array
  printAreas: any[]; // 印刷区域 Array
  pointoutPrintAreas: any[]; // Array 指定印刷区域

  /*以下是没有用到的字段*/
  id: string; // 产品id(模板编号)
  name: string; // 产品名称
  cnName: string; // 产品名称
  shortDescription: string; // 产品名称(一般是空)
  description: string; // 产品描述(一般是空)
  brand: string; // 品牌(一般是空)
  designWidth: string; // 设计宽度(没用到)
  designHeight: string; // 设计高度(没用到)
  amType: string; // 类型(一般是空)
  templateType: string; // 模板类型(没用到)
  collectId: string; // 收藏id (没用到, 一般是空)
  proembryoFlag: number; // 是否有详情(没用到)
  secondCalculateNum: number; // 第二次计算数量(没用到)
  thirdCalculateNum: number; // 第三次计算数量(没用到)
  hasDetail: boolean; // 是否有详情(没用到)
  isHotStamping: boolean; // 是否有烫金(没用到)
  collectFlag: boolean; // 是否收藏(没用到)
  isCanSynthesi: boolean; // 是否可以合成(没用到)
  defaultValues: object; // 默认值 Object
  configDesign: object; // 配置设计(没用到) Object
}

/**
 * @interface ProdListParams
 * @description: 产品列表参数
 * @param {number} limit - 限制条数
 * @param {boolean} fullData - 是否返回完整数据
 * @param {boolean} isFbaTemplate - 是否是FBA产品 0-通用产品 1-FBA产品
 * @param {number} pageNo - 页码
 * @param {number} pageSize - 页大小
 * @param {string} category1 - 一级分类
 * @param {string} category2 - 二级分类
 * @param {string} tempalteNoOrName - 模板编号或名称
 */
export interface ProdListParams {
  mediaType: string;
  locale: string;
  limit: number;
  fullData: boolean;
  isFbaTemplate: boolean;
  pageNo: number;
  pageSize: number;
  category1: string;
  category2: string;
  tempalteNoOrName: string;
}

/**
 * @interface ProdListResponseData
 * @description: 产品列表返回值
 */
export interface ProdListResponseData extends ResponseDataOld {
  productTypes: ProdItemResponse[];
  count: number;
  limit: number;
}

/**
 * @interface ParseColorItem
 * @description: 解析颜色数据
 */
export interface ParseColorItem {
  id: string;
  name: string;
  colorCode: string;
  views: any[];
  multiAngleImages: any[];
}

/**
 * 解析后的尺码数据
 */
export interface ParseSizeItem {
  id: number;
  name: string;
  sizeType: string;
  measures: any[];
}

/**
 * @interface ParseViewItem
 * @description: 解析视图数据
 */
export interface ParseViewItem {
  id: number;
  name: string;
  offset: { x: number; y: number };
  canvas: KonvaCanvas;
  texture: Texture;
  updateTexture: (num: number | string | null) => void;
  rect: { x: number; y: number; width: number; height: number };
  activeImageUuid: string;
}

/**
 * @interface ParsePrintItem
 * @description: 解析印刷区域数据
 */
export interface ParsePrintItem {
  id: number;
  d: string;
  viewId: string;
  width: number;
  height: number;
}

/**
 * @interface ParsePrintoutItem
 * @description: 解析指定印刷区域数据
 */
export interface ParsePrintoutItem {
  id: number;
  size: object;
  stitching: string;
  v: string;
}

/**
 * @interface ShowImage
 * @description: 展示用的数据 Object
 */
interface ShowImage {
  image: string;
  texture: string;
  thumbImg: string;
}

/**
 * 价格列表的item
 */
export interface PriceListItem {
  price: number;
  num: number;
}
/**
 * 接口返回值 - 产品价格 - data - resListItem[]
 * @property templateProperty 是否是特殊价格 0-尺码 1-颜色 2-正常
 */
interface resListItem {
  templateProperty: string;
  priceList: PriceListItem[];
}

/**
 * 接口返回值 - 产品价格 - data
 */
export interface ProdPriceResponseData {
  resList: resListItem[];
  templateType: string;
}

/**
 * 产品价格接口 - 组装后的返回值
 * @property {PriceListItem[]} list 价格列表
 * @property {string} isSpecial 是否是特殊价格 ''-没有 0-尺码 1-颜色 2-正常
 */
export interface GetProdPriceApiType {
  list: PriceListItem[];
  isSpecial: string;
}

/**
 * 接口返回值 - 产品价格
 */
export interface ProdPriceResponse extends ResponseData<ProdPriceResponseData> {}

/**
 * @interface ProdListDataItem
 * @description: 产品列表项(解析后)
 */
export interface ProdListDataItem extends ProdItemResponse {
  viewList: ParseViewItem[]; // 视图
  printList: ParsePrintItem[]; // 印刷区域
  colorList: ParseColorItem[]; // 颜色
  sizeList: ParseSizeItem[]; // 尺码
  printoutList: ParsePrintoutItem[]; // 指定印刷区域
  detail: ProdItemResponse; // 接口返回值详情
  priceList: PriceListItem[]; // 价格列表
  isSpecial: string; // 是否是特殊价格 ‘’-没有 0-尺码 1-颜色 2-正常
  // 展示用的数据 Object
  showImage: ShowImage;
}

/**
 * @interface ProdListData
 * @description: 产品列表数据(解析后)
 */
export interface ProdListData extends ListData<ProdListDataItem> {}

/**
 * @interface ProdConfig3dViewItem
 * @description: 产品的3d配置 - viewList的item
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
 */
interface ProdConfig3dViewItem {
  viewId: number;
  sortNo: number;
  useflag: number;
  configType: number;
  seqId: string;
  templateId: string;
  templateNo: string;
  viewName: string;
  materialName: string;
  size: string | null;
  uvD: string;
  uvV: string;
  viewRelation: string;
  cameraPosition: string;
  cameraRotation: string;

  updateTime: null;
  updateUser: null;
  createTime: null;
  createUser: null;
}

/**
 * @interface ProdConfig3dColorListItem
 * @description: 产品的3d配置 - colorList的list的item
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
interface ProdConfig3dColorListItem {
  viewId: number;
  configType: number;
  useflag: number;
  templateId: string;
  templateNo: string;
  size: string | null;
  colorCode: string;
  colorName: string;
  materialName: string;
  viewName: string;
  sortNo: number | null;
  createTime: string;
  createUser: string;
  updateTime: string;
}

/**
 * @interface ProdConfig3dColorItem
 * @description: 产品的3d配置 - colorList的item
 */
interface ProdConfig3dColorItem {
  colorCode: string;
  colorName: string | null;
  list: ProdConfig3dColorListItem[];
}

/**
 * @interface ProdConfig3dResponseData
 * @description 产品配置 -3d 接口返回值 data
 * @property {string} seqId 主键
 * @property {string} templateNo 模板编号
 * @property {string} zipPath 压缩包路径
 * @property {string} glbPath glb路径
 * @property {boolean} hasUpload2d 是否已上传2d 1-已上传 0-未上传
 * @property {boolean} hasUpload3d 是否已上传3d 1-已上传 0-未上传
 * @property {boolean} openflag2d 是否开启2d 0-开启 1-关闭
 * @property {boolean} openflag3d 是否开启3d 0-开启 1-关闭
 * @property {boolean} uvdflag 是否开启uvd 0-开启 1-关闭
 * @property {ProdConfig3dViewItem[]} viewList 视图列表
 * @property {ProdConfig3dColorItem[]} colorList 颜色列表
 */
interface ProdConfig3dResponseData {
  templateNo: string;
  glbPath: string;
  zipPath: string;
  openflag2d: number;
  openflag3d: number;
  uvdflag: number;
  hasUpload2d: number;
  hasUpload3d: number;
  seqId: string;
  viewList: ProdConfig3dViewItem[];
  colorList: ProdConfig3dColorItem[];
}

/**
 * @interface ProdConfig3dResponse
 * @description 产品配置 -3d 接口返回值
 */
export interface ProdConfig3dResponse extends ResponseData<ProdConfig3dResponseData> {}

/**
 * @interface ProdConfig3dResponseRefineData
 * @description 产品配置 -3d 接口返回值 (精细) data
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
 */
export interface ProdConfig3dResponseRefineData {
  hasUpload2d: number;
  hasUpload3d: number;
  useflag: number;
  hasUpload2dCommon: number;
  hasUpload3dCommon: number;
  openflag2dCommon: number;
  openflag3dCommon: number;
  openflag2d: number;
  openflag3d: number;
  uvdflag: number;
  templateNo: string;
  size: string;
  sizeType: string;
  glbPath: string;
  gltlPath: string;
  zipPath: string;
  seqId: string;
}

/**
 * @interface ProdConfig3dResponseRefine
 * @description 产品配置 -3d 接口返回值 (精细)
 */
export interface ProdConfig3dResponseRefine extends ResponseData<ProdConfig3dResponseRefineData[]> {}

/**
 * @interface ActiveStaticProdData
 * @description 当前激活产品的静态数据 - viewList的item
 * @property {string} id 视图id
 * @property {string} name 视图名称
 * @property {string} prod 视图产品图
 * @property {string} bg 视图背景图
 * @property {ShowImage} showImage 视图产品图
 * @property {object} offset 视图偏移量 {x, y}
 * @property {string|null|undefined} v 中间的车线(红色)
 * @property {ParsePrintItem} print 视图打印区域
 * @property {ParsePrintoutItem} printout 视图打印区域
 */
export interface StaticViewItem {
  id: string; // 视图id
  name: string; // 视图名称
  prod: string; // 视图产品图
  showImage: ShowImage; // 视图产品图
  bg: string; // 视图背景图
  offset: { x: number; y: number }; // 视图偏移量 {x, y}
  v: string; //中间的车线(红色)

  print: ParsePrintItem; // 视图打印区域
  printout: ParsePrintoutItem; // 视图打印区域
}

/**
 * @interface ActiveStaticProdData
 * @description 当前激活产品的静态数据
 */
export interface ActiveStaticProdData {
  // 视图列表
  viewList: StaticViewItem[];
  // 产品
  prod: ProdListDataItem;
}
