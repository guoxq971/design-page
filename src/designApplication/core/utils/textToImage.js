import Konva from 'konva';
import moment from 'moment';
import { saveTextWordApi, updateImageApi, updateImageCheckApi } from '@/designApplication/apis/image';
import { changeDpiDataUrl } from '@/designApplication/core/utils/changeBase64Dpi';

/**
 * 保存文字参数
 * @param {import('@/design').SaveProdResponse} prodRes 参数
 * @param {SubmitParamType} param 参数
 */
export async function saveTextWord(prodRes, param) {
  const textList = param.configurations.filter((e) => e.isText);
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
 * @returns {Promise<{checkRes:import('@/design').UploadImageCheckItem,textParam:{}}>}
 */
export async function textToImageUpload(konvaText) {
  const viewId = konvaText.attrs.param.view.id;
  const viewWidth = konvaText.attrs.param.staticView.print.width;
  const viewHeight = konvaText.attrs.param.staticView.print.height;
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
  // 将文字转成图片上传到服务器, 得到designId
  let base64 = await textToImage(textParam, viewWidth, viewHeight);
  base64 = changeDpiDataUrl(base64, 180);
  const blob = dataURLtoBlob(base64);
  const file = blobToFile(blob, `${viewId}.png`);

  // 上传文件信息处理
  file.uid = moment().valueOf().toString().substr(0, 12);
  file.label = file.name.split('.')[0];
  file.raw = new window.File([file], file.name, { type: file.type });
  file.isCopyRightGrade = '0'; //侵权
  file.isFuGrade = '2'; //全幅
  file.newBasetype = '0'; //图片一级分类

  // 上传图片
  const imageRes = await uploadImage(file);

  // 设计图上传确认
  const checkRes = await designImageUploadConfirm(imageRes, file);

  return { checkRes, textParam };
}

/**
 * 设计图上传确认
 * @param {import('@/design').UploadImageResponse} imageRes
 * @param {File} file
 * @returns {Promise<any>}
 */
export async function designImageUploadConfirm(imageRes, file) {
  /**
   * @type {import('@/design').UploadImageCheckParams}
   */
  const obj = {
    fileName: imageRes.fileName,
    sjsTitle: file.sjsTitle || '',
    label: file.label,
    tags: file.tags || '',
    main_type: [4],
    // 侵权
    isCopyRightGrade: file.isCopyRightGrade || '',
    // 全幅
    isFuGrade: file.isFuGrade || '',
    // 图片一级分类
    newBasetype: file.newBasetype || '',
    // 图片二级分类
    newNexttype: file.newNexttype || '',
    // 小组一级分类
    teamBasetype: file.teamBasetype || '',
    // 小组二级分类
    teamNexttype: file.teamNexttype || '',
    width: imageRes.width,
    height: imageRes.height,
    imageName: imageRes.imageName,
    imageDir: imageRes.imageDir,
    orgImage: imageRes.orgImage,
    dpi: imageRes.dpi,
    thumbImage: imageRes.thumbImage,
    designImage: imageRes.designImage,
    imageType: imageRes.imageType,
  };
  const res = await updateImageCheckApi(obj);

  return res;
}

/**
 * 将图片上传到服务器, 得到designId
 * @param {File} file
 * @returns {Promise<import('@/design').UploadImageResponse>}
 */
export async function uploadImage(file) {
  const form = new FormData();
  const param = {
    id: file.uid,
    name: file.label, //file.label-去掉后缀的名称 file.name-没有去掉后缀
    type: file.raw.type,
    lastModifiedDate: file.raw.lastModifiedDate,
    size: file.size,
    file: file.raw,
    cut1500Flag: '',
  };
  for (let key in param) {
    form.append(key, param[key]);
  }

  return await updateImageApi(form);
}

/**
 * blob转file
 * @param theBlob
 * @param {string} fileName
 * @returns {*}
 */
export function blobToFile(theBlob, fileName) {
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

/**
 * 将base64转换为blob
 * @param {string} dataurl
 * @returns {module:node:buffer.Blob}
 */
export function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * 文字转png图片
 * @param {import('@/design').TextParam} param
 * @param {number} width
 * @param {number} height
 * @returns {Promise<string>} base64
 */
export async function textToImage(param, width, height) {
  // 创建一个div id="textToImage"
  const div = document.createElement('div');
  div.id = 'textToImage';
  div.style.width = width + 'px';
  div.style.height = height + 'px';
  div.style.position = 'absolute';
  div.style.top = '-9999px';
  div.style.left = '-9999px';
  div.style.zIndex = '-9999';
  // 背景色为透明
  div.style.backgroundColor = 'transparent';
  document.body.appendChild(div);

  // 创建konva的canvas
  const stage = new Konva.Stage({
    container: 'textToImage',
    width,
    height,
  });

  const layer = new Konva.Layer();
  stage.add(layer);
  // 创建文字
  const fontStyle = [param.fontWeight, param.fontItalic].filter(Boolean).join(' ');
  const text = new Konva.Text({
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
    fontFamily: param.fontFamily,
    fill: param.fontColor,
  });
  layer.add(text);

  // 获取图片
  const url = await new Promise((resolve) => {
    stage.toImage({
      callback(img) {
        resolve(img.src);
      },
    });
  });

  // 销毁
  stage.destroy();
  div.remove();

  return url;
}
