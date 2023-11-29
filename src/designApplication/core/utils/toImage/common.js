import { updateImageApi, updateImageCheckApi } from '@/designApplication/apis/image';
import { uuid } from '@/designApplication/core/utils/uuid';
import moment from 'moment/moment';
import { changeDpiDataUrl } from '@/designApplication/core/utils/changeBase64Dpi';

/**
 * 修改图片DPI，转为file，上传到服务器
 * @param {string} base64
 * @param {{dpi?:number,name?:string}} param
 * @returns {Promise<{checkRes:import('@/design').UploadImageCheckItem,file:File}>}
 */
export async function changeDpiDataUrlWithUpload(base64, param) {
  const _param = Object.assign(
    {
      dpi: 180,
      name: `custom_${uuid()}.png`,
    },
    param,
  );

  base64 = changeDpiDataUrl(base64, _param.dpi);
  const blob = dataURLtoBlob(base64);
  const file = blobToFile(blob, _param.name);

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

  return { checkRes, file };
}

/**
 * 根据参数转换为指定参数的图片
 * @param {{width:number,height:number,callback:function}} param
 * @returns {Promise<string>} base64
 */
export async function designToImage(param) {
  const _param = Object.assign(
    {
      width: 500, // 宽
      height: 500, // 高
      callback: null, // 回调函数 (必须返回一个Konva.Image | Konva.text)
    },
    param,
  );

  if (!_param.width || !_param.height) {
    console.error('designToImage 失败 没有宽高');
    return Promise.reject();
  }

  if (!_param.callback) {
    console.error('designToImage 失败 没有回调函数');
    return Promise.reject();
  }

  // 创建一个div id="textToImage"
  const div = document.createElement('div');
  div.id = 'textToImage';
  div.style.width = _param.width + 'px';
  div.style.height = _param.height + 'px';
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
    width: _param.width,
    height: _param.height,
  });

  const layer = new Konva.Layer();
  stage.add(layer);

  // 创建设计
  const design = await _param.callback();

  layer.add(design);

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
