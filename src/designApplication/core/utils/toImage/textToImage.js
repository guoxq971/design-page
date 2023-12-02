import Konva from 'konva';
import { saveTextWordApi } from '@/designApplication/apis/image';
import { changeDpiDataUrlWithUpload, designToImage } from '@/designApplication/core/utils/toImage/common';
import { uuid } from '@/designApplication/core/utils/uuid';

/**
 * 保存文字参数
 * @param {import('@/design').SaveProdResponse} prodRes 参数
 * @param {SubmitParamType} param 参数
 */
export async function saveTextWord(prodRes, param) {
  const textList = param.configurations?.filter((e) => e.isText) || [];
  if (textList.length === 0) return;

  await saveTextWordApi({
    productId: prodRes.id,
    productCode: prodRes.code,
    wordParam: JSON.stringify(textList.map((e) => e.bmParam)),
  });
}

/**
 * 文字转png图片并上传
 * @param {Konva.Text} konvaText
 * @returns {Promise<{checkRes:import('@/design').UploadImageCheckItem,textParam:{},imgWidth:number,imgHeight:number}>}
 */
export async function textToImageUpload(konvaText) {
  const viewId = konvaText.attrs.param.view.id;
  const imgWidth = konvaText.attrs.param.staticView.print.width;
  const imgHeight = konvaText.attrs.param.staticView.print.height;
  const textParam = {
    offsetX: konvaText.attrs.offsetX,
    offsetY: konvaText.attrs.offsetY,
    x: konvaText.attrs.x,
    y: konvaText.attrs.y,
    rotation: konvaText.attrs.rotation || 0,
    scaleX: konvaText.attrs.scaleX || 1,
    scaleY: konvaText.attrs.scaleY || 1,
    text: konvaText.attrs.text,
    fontColor: konvaText.attrs.fontColor,
    fontSize: konvaText.attrs.fontSize,
    fontFamily: konvaText.attrs.fontFamily,
    fontWeight: konvaText.attrs.fontWeight,
    fontItalic: konvaText.attrs.fontItalic,
    textDecoration: konvaText.attrs.textDecoration,
  };
  // 将文字通过konva canvas转成图片, 上传到服务器, 得到designId
  const base64 = await textToImage(textParam, imgWidth, imgHeight);

  // 修改图片DPI，转为file，上传到服务器
  const name = `custom_${uuid()}_${viewId}.png`;
  const { checkRes } = await changeDpiDataUrlWithUpload(base64, { name: name });

  return { checkRes, textParam, imgWidth, imgHeight };
}

/**
 * 文字转png图片
 * @param {import('@/design').TextToImageParam} param
 * @param {number} width
 * @param {number} height
 * @returns {Promise<string>} base64
 */
export async function textToImage(param, width, height) {
  const opt = {
    width: width,
    height: height,
    callback: async () => {
      // 创建文字
      const fontStyle = [param.fontWeight, param.fontItalic].filter(Boolean).join(' ');
      return new Konva.Text({
        x: param.x,
        y: param.y,
        offsetX: param.offsetX,
        offsetY: param.offsetY,
        scaleX: param.scaleX,
        scaleY: param.scaleY,
        rotation: param.rotation,
        text: param.text,
        fontSize: param.fontSize,
        fontStyle: fontStyle,
        textDecoration: param.textDecoration, // 下划线
        fontFamily: param.fontFamily,
        fill: param.fontColor,
      });
    },
  };

  return await designToImage(opt);
}
