import { ResponseData, ResponseDataOld } from './global';

/**
 * 设计图收藏列表的接口返回值的 list 的 item
 */
export interface CollectImageListItem {
  seqId: string;
  imageCode: string;
  imageName: string;
  imageSjsTitle: string;
  imageTitle: string;
  imageTag: string;
  imageDir: string;
  imageDirDfs: string;
  imageType: string;
  thumbImage: string;
  designImage: string;
  hdDesignImage: string;
  orgImage: string;
  width: string;
  height: string;
  useflag: string;
  printType: string;
  price: string;
  copyright: string;
  isAll: string;
  isBackground: string;
  isWhite: string;
  risk: string;
  tenantId: string;
  createtime: string;
  createuser: string;
  updatetime: string;
  updateuser: string;
  descUser: string;
  descTime: string;
  basetype: string;
  nexttype: string;
  uploadType: string;
  isDelete: string;
  gxCompany: string;
  quality: string;
  mytypeText: string;
  orderNum: string;
  designLabel1: string;
  designLabel2: string;
  highlight: string;
  newTypeId: string;
  isNewType: string;
  dpi: string;
  adminType: string;
  bigImage: string;
  quickimgid: string;
  orderNums: string;
  rownumber: number;
  isBg: boolean;
  size: {
    width: string;
    height: string;
    unit: string;
  };
  designImg: string;
}

/**
 * 设计图收藏列表的接口返回值
 */
export interface CollectImageListResponse extends ResponseDataOld {
  list: CollectImageListItem[];
}

/**
 * 设计图列表的接口返回值的 list 的 item
 */
export interface ImageListItem {
  name: string;
  description: string;
  isAll: string;
  imageCode: string;
  orderNums: string;
  count: string;
  dpi: string;
  standard: {
    width: string;
    height: string;
    size: string;
    unit: string;
  };
  creator: string;
  size: {
    width: string;
    height: string;
    unit: string;
  };
  colors: [];
  designCategories: [
    {
      id: string;
    },
  ];
  id: string;
  isBg: boolean;
  tortType: string;
  previewImg: string;
  designImg: string;
  hdDesignImage: string;
  isRisk: string;
  lowRiskWords: string;
  highRiskWords: string;
  isHasRisk: string;

  /*自定义*/
  isAdminOrg?: boolean; //是否是管理图库的图
}

/**
 * 管理图库的接口返回
 */
export interface GetListImageAdmin {
  total: number;
  list: ImageListItem[];
}

/**
 * 上传设计图的接口返回值
 */
export interface UploadImageResponse extends ResponseDataOld {
  isCanUploadImg: boolean;
  id: string;
  fileName: string;
  dpi: number;
  width: number;
  height: number;
  imageName: string;
  imageDir: string;
  orgImage: string;
  thumbImage: string;
  designImage: string;
  imageType: string;
  designId: string;
}

/**
 * 上传设计图 - 确认 的接口参数
 * @param {null | number | string} mainType 上传的类型 1主题图 2背景图 3主题图&背景图 4文字 5镜像图 6平铺图
 */
export interface UploadImageCheckParams {
  fileName: string;
  sjsTitle: string;
  label: string;
  tags: string;
  main_type: number[];
  isCopyRightGrade: string;
  isFuGrade: string;
  newBasetype: string;
  newNexttype: string;
  teamBasetype: string;
  teamNexttype: string;
  width: number;
  height: number;
  imageName: string;
  imageDir: string;
  orgImage: string;
  dpi: number;
  thumbImage: string;
  designImage: string;
  imageType: string;
}

/**
 * 上传设计图 - 确认 的接口返回值
 */
export interface UploadImageCheckItem {
  imageCode: number;
  seqId: string;
}

/**
 * 上传设计图 - 确认 的接口返回值
 */
export interface UploadImageCheckResponse extends ResponseData<UploadImageCheckItem> {}

/**
 * 文字参数
 */
export interface TextParam {
  text: string;
  fontColor: string;
  fontSize: number;
  fontFamily: string; //'微软雅黑',
  fontWeight: string; //normal,bold
  fontItalic: string; //normal,italic
  textDecoration: string; //none,underline,overline,line-through
  textAlign: string; //left,center,right
  lineHeight: number; //字体行高
  letterSpacing: number; //字体间距
}

/**
 * 文字参数
 */
export interface TextToImageParam {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  offsetX: number;
  offsetY: number;
}

/**
 * 保存文字信息的接口参数
 */
export interface SaveTextParams {
  productId: string;
  productCode: number;
  wordParam: string;
}
