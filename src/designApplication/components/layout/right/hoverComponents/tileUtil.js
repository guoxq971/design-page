import { Konva } from '@/designApplication/core/canvas/konva';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';

/**
 * 获取平铺需要的信息
 * @param {Konva.Image} image
 */
export function getTileInfo(image) {
  const param = image.attrs.param;

  // 舞台的宽高
  const a = Math.max(param.staticView.print.width, param.staticView.print.height);
  const stageWidth = a;
  const stageHeight = a;

  // 图片当前的坐标
  const currentX = image.x();
  const currentY = image.y();

  // 图片的宽高
  const imageWidth = image.width() * image.scaleX();
  const imageHeight = image.height() * image.scaleY();

  return {
    clip: image.attrs.konvaCanvas.clip,
    image,
    stageWidth,
    stageHeight,
    a,
    currentX,
    currentY,
    imageWidth,
    imageHeight,
  };
}

/**
 * 创建单个图片
 * @returns {Konva.Group}
 */
function createImg(rIndex, cIndex, width, height, info, params, rowIndex, colIndex, item) {
  // 交错偏移量
  let x = cIndex * width;
  let y = rIndex * height;
  if (params.offset > 0) {
    if (params.offsetType === 'x' && [3, 4].includes(item.gIndex)) {
      x += params.offset;
    } else if (params.offsetType === 'y' && [2, 4].includes(item.gIndex)) {
      y += params.offset;
    }
  }

  // 镜像
  let scaleX = 1;
  let scaleY = 1;
  let offsetX = 0;
  let offsetY = 0;
  let flipX = info.image.attrs.isFlipX ? -1 : 1;
  let flipY = info.image.attrs.isFlipY ? -1 : 1;
  if (info.image.attrs.isFlipX) {
    scaleX = -1;
  }
  if (info.image.attrs.isFlipY) {
    scaleY = -1;
  }
  if (params.mirrorType !== 0) {
    switch (params.mirrorType) {
      // 水平镜像
      case 1:
        if ([3, 4].includes(item.gIndex)) {
          scaleY *= -1;
          offsetY = info.imageHeight * flipY;
        }
        break;

      // 垂直镜像
      case 2:
        if ([2, 4].includes(item.gIndex)) {
          scaleX *= -1;
          offsetX = info.imageWidth * flipX;
        }
        break;

      // 水平垂直镜像
      case 3:
        if ([1].includes(item.gIndex)) {
        }
        if ([2].includes(item.gIndex)) {
          scaleX *= -1;
          offsetX = info.imageWidth * flipX;
        }
        if ([3].includes(item.gIndex)) {
          scaleY *= -1;
          offsetY = info.imageHeight * flipY;
        }
        if ([4].includes(item.gIndex)) {
          scaleX *= -1;
          scaleY *= -1;
          offsetX = info.imageWidth * flipX;
          offsetY = info.imageHeight * flipY;
        }
        break;
    }
  }

  const g = new Konva.Group({
    x: x,
    y: y,
    width: Math.abs(width),
    height: Math.abs(height),
  });

  if (info.image.attrs.type === canvasDefine.image) {
    const img = new Konva.Image({
      width: Math.abs(info.imageWidth),
      height: Math.abs(info.imageHeight),
      image: info.image.attrs.fillPatternImage,
      scaleX: scaleX,
      scaleY: scaleY,
      offsetX: offsetX,
      offsetY: offsetY,
      draggable: false,
    });
    g.add(img);
  }

  // const text = new Konva.Text({
  //   text: item.gIndex,
  //   fontSize: 30,
  // });
  // g.add(text);

  return g;
}

/**
 * 创建image组 2*2
 */
export function createImageGroup(info, width, height, rowIndex, colIndex, params) {
  // 一组会生成 2*2 个图片
  const list = [
    [{ gIndex: 1 }, { gIndex: 2 }],
    [{ gIndex: 3 }, { gIndex: 4 }],
  ];

  width = Math.abs(width);
  height = Math.abs(height);

  // 组的坐标
  const x = colIndex * width * 2;
  const y = rowIndex * height * 2;
  const g2 = new Konva.Group({
    x: x,
    y: y,
    width: width * list[0].length,
    height: height * list.length,
  });

  // 生成图片
  list.forEach((row, rIndex) => {
    row.forEach((col, cIndex) => {
      const img = createImg(rIndex, cIndex, width, height, info, params, rowIndex, colIndex, col);
      g2.add(img);
    });
  });

  return g2;
}

/**
 * 创建最外层的group
 */
export function createGroup(image) {
  const info = getTileInfo(image);

  return new Konva.Group({
    name: 'tile',
    x: info.currentX,
    y: info.currentY,
    width: info.a,
    height: info.a,
    rotation: image.attrs.rotation,
    offset: {
      x: info.imageWidth / 2,
      y: info.imageHeight / 2,
    },
  });
}
