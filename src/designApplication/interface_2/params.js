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
