/**
 * px转换为mm
 * @param {number} size 尺寸
 * @param {number} dpi dpi
 * @returns {width:number,height:number} 宽高
 * */
export function inchToPx(size, dpi) {
  // const dpi = getters.activeProd.detail.dpi; // 当前产品的dpi
  //全局的
  // px -> mm
  let a = function (size, dpi) {
    return (25.4 * size) / dpi;
  };
  return {
    height: a(size.height, dpi),
    width: a(size.width, dpi),
  };
}

/**
 * 获取图片在打印区域的比例
 * @param {object} imageSize 图片的宽高
 * @param {object} printAreaSize 打印区域的宽高
 * */
export function printAreaToImageRatio(imageSize, printAreaSize) {
  // 宽高的比例
  let widthRatio = '';
  let heightRatio = '';
  if (imageSize.width > printAreaSize.width) {
    widthRatio = printAreaSize.width / imageSize.width;
  } else {
    widthRatio = 1;
  }
  if (imageSize.height * widthRatio > printAreaSize.height) {
    heightRatio = printAreaSize.height / (imageSize.height * widthRatio);
  } else {
    heightRatio = 1;
  }
  return {
    widthRatio: widthRatio,
    heightRatio: heightRatio,
    ratio: {
      value: widthRatio * heightRatio,
      width: widthRatio,
      height: heightRatio,
    },
    size: {
      width: imageSize.width * widthRatio * heightRatio,
      height: imageSize.height * widthRatio * heightRatio,
    },
  };
}

/**
 * 该模板的2d是否能够使用
 * @param {import('@/design').ProdConfig3dResponseRefineData} config 模板配置
 * @returns {boolean} 是否能够使用 true-能够使用 false-不能使用
 */
export function isTemplateCanUse(config) {
  // 是否已经上传2d配置
  const yetUpload2d = config.hasUpload2d === 1;
  // 是否开启了2d配置
  const yetOpen2d = config.openflag2d === 0;

  return yetUpload2d && yetOpen2d;
}
