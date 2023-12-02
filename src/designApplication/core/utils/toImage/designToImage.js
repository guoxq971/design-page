import Konva from 'konva';
import { loadImage } from '@/designApplication/core/utils/loadImage';
import { changeDpiDataUrlWithUpload, designToImage } from '@/designApplication/core/utils/toImage/common';
import { uuid } from '@/designApplication/core/utils/uuid';

/**
 * 设计图转换为图片
 * @param {Konva.Image} konvaImage
 * @returns {Promise<{checkRes:import('@/design').UploadImageCheckItem}>}
 */
export async function designToImageUpload(konvaImage) {
  const viewId = konvaImage.attrs.param.view.id;

  // 加载图片
  const image = await loadImage(konvaImage.attrs.detail.designImg);

  const param = {
    scaleX: konvaImage.attrs.scaleX,
    scaleY: konvaImage.attrs.scaleY,
    image,
  };

  // 转换为指定参数的图片
  let base64 = await _designToImage(param, image.width, image.height);

  // 修改图片DPI，转为file，上传到服务器
  const name = `custom_${uuid()}_${viewId}.png`;
  const { checkRes } = await changeDpiDataUrlWithUpload(base64, { name: name });

  return { checkRes };
}

/**
 * 设计转png图片
 * @returns {Promise<string>} base64
 */
export async function _designToImage(param, width, height) {
  const opt = {
    width: param.image.width,
    height: param.image.height,
    callback: async () => {
      return new Konva.Image({
        x: 0,
        y: 0,
        width: param.image.width,
        height: param.image.height,
        scaleX: param.scaleX < 0 ? -1 : 1,
        scaleY: param.scaleY < 0 ? -1 : 1,
        offsetX: param.scaleX < 0 ? param.image.width : 0,
        offsetY: param.scaleY < 0 ? param.image.height : 0,
        fillPatternImage: param.image, // 填充图片 (与fill互斥)
      });
    },
  };

  return designToImage(opt);
}
