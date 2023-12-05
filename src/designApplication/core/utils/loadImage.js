const cache = {};

/**
 * 加载图片
 * @param src
 * @param param
 * @returns {Promise<HTMLImageElement>}
 * */
export function loadImage(src, param = {}) {
  param = Object.assign({}, param);
  return new Promise((resolve, reject) => {
    // 从缓存中获取
    if (cache[src]) {
      // console.log('从缓存中获取');
      resolve(cache[src]);
      return;
    }
    const image = new Image();
    image.src = src;
    image.crossOrigin = 'Anonymous';
    if (param.width) image.width = param.width;
    if (param.height) image.height = param.height;
    image.onload = () => {
      // console.log('加载图片');
      cache[src] = image;
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error('图片加载失败'));
    };
  });
}
