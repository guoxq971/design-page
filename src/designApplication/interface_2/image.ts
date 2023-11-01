import { ResponseDataOld } from './global';

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
