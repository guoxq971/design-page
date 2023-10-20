/**
 * 加载图片
 * @param src
 * @param param
 * @returns {Promise<HTMLImageElement>}
 * */
export function loadImage(src, param = {}) {
  param = Object.assign({}, param);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.crossOrigin = 'Anonymous';
    if (param.width) image.width = param.width;
    if (param.height) image.height = param.height;
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error('图片加载失败'));
    };
  });
}
