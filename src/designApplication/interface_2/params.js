/**
 * 保存接口的入参
 */
export class SubmitParamType {
  fullSvg = {};
  appearance = {
    id: '',
  };
  defaultValues = {
    defaultView: {
      id: '',
    },
  };
  productType = {
    id: '',
  };
  restrictions = {
    freeColorSelection: false,
    example: false,
  };
  creator = 'Tablomat8';
  saveNumBtn = '';
  templateType = '';
  // 视图
  configurations = [];
  static_batchid;
  adminImage;
  isUseMirror;
  isNeedCopy;
}

/**
 * 设计图参数
 */
export class ConfigurationItem {
  bmParam = {
    type: 'img',
    designId: '',
    imageCode: '',

    // new 文字参数
    textParam: {},

    // new 图片参数
    imgParam: {
      x: 0, //图片x坐标
      y: 0, //图片y坐标
      width: 0, //图片宽度(缩放后)
      height: 0, //图片高度(缩放后)
      angle: 0, //旋转角度
      scaleX: 1, //x轴缩放比例
      scaleY: 1, //y轴缩放比例
    },

    // new 平铺属性
    tileParam: {}, //平铺属性
    isTile: false, // 是否平铺

    // new 翻转属性
    isFlipX: false, // 沿着x轴翻转
    isFlipY: false, // 沿着y轴翻转
    flipImageCode: '', // 翻转后的图片code
    flipImageDesignId: '', // 翻转后的图片designId

    // old
    // size: {},
    // imageOrgUrl: '',
    // orgDesignId: '',
    // isTiled: 0,
    // tiledParam: {},
    // isReverse: false,
    // reverseParam: {},
    // matrixObj: {},
  };
  isCopy = '';
  isText = false;
  textId = '';
  content = {
    dpi: '',
    unit: 'mm',
    svg: {
      image: {
        designId: '',
        height: '',
        width: '',
        transform: '',
        isBg: '',
        hspacing: 0,
        vspacing: 0,
        printColorRGBs: '',
        tileType: '',
      },
    },
  };
  offset = { x: '', y: '', unit: 'mm' };
  printArea = { id: '' };
  printType = { id: 17 };
  restrictions = { changeable: true };
  type = 'design';
}
