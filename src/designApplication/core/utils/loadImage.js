/**
 * 加载图片
 * @param src
 * @returns {Promise<Image>}
 * */
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = src;
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error('图片加载失败'));
    };
  });
}
