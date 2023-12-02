import { changeDpiDataUrlWithUpload, designToImage } from '@/designApplication/core/utils/toImage/common';
import { uuid } from '@/designApplication/core/utils/uuid';

/**
 * 平铺图转换为图片
 */
export async function TileToImage(konvaImage) {
  const viewId = konvaImage.attrs.param.view.id;
  const staticView = konvaImage.attrs.param.staticView;
  const clip = konvaImage.attrs.konvaCanvas.clip.clone();
  clip.children = clip.children.filter((e) => e.attrs.name === 'tile');

  // 放大倍数，用于提高图片清晰度
  const scale = 5;

  // 平铺图处理
  const width = staticView.print.width * scale;
  const height = staticView.print.height * scale;
  clip.scaleX(scale);
  clip.scaleY(scale);
  clip.x(0); //clip.x() * widthScale
  clip.y(0); //clip.y() * heightScale
  clip.clipFunc((ctx) => {
    ctx.rect(0, 0, width, height);
  });

  // 转为base64
  const base64 = await designToImage({
    width: width,
    height: height,
    test: false,
    callback: async () => {
      return clip;
    },
  });

  // 修改图片DPI，转为file，上传到服务器
  const name = `custom_${uuid()}_${viewId}.png`;
  const { checkRes } = await changeDpiDataUrlWithUpload(base64, { name: name });

  return {
    checkRes,
    width: staticView.print.width,
    height: staticView.print.height,
  };
}
