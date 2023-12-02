import { Konva } from '@/designApplication/core/canvas/konva';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';
import store from '@/store';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

/**
 * 平铺工具
 */
export class TileUtil {
  /**
   * 获取平铺图
   * @returns {*}
   */
  static find(image) {
    const view = DesignerUtil.getView();
    const clip = view.canvas.clip;

    return clip.children.find((e) => e.attrs.name === 'tile' && e.attrs.image.attrs.uuid === image.attrs.uuid);
  }

  /**
   * 新增平铺
   * @param image
   */
  static add(image) {
    const tile = TileUtil.find(image);
    if (tile) {
      tile.destroy();
    }

    onTile(image);
    const tileParam = store.state.designApplication.tile;
    image.setAttrs({
      isTile: true,
      tileParam,
    });
  }

  /**
   * 更新平铺
   */
  static update(image, type = '') {
    if (!image.attrs.isTile) return;
    return updateTile(image, type);
  }

  /**
   * 移除平铺
   */
  static remove(image) {
    if (!image.attrs.isTile) return;
    removeTile(image);
    image.setAttrs({
      isTile: false,
      tileParam: null,
    });
  }
}

/**
 * 移除平铺
 */
export function removeTile(image) {
  let clip = image.attrs.konvaCanvas.clip;
  // 如果存在平铺图
  const tile = TileUtil.find(image);
  if (tile) {
    tile?.destroy();
  }
}

/**
 * 平铺
 * @param image
 */
function onTile(image) {
  const info = getTileInfo(image);
  const params = store.state.designApplication.tile;

  // img的宽高 (一个小组2x2)
  const imgWidth = Math.abs(info.imageWidth) + params.gapX; //水平间距
  const imgHeight = Math.abs(info.imageHeight) + params.gapY; //垂直间距
  const imgGroupWidth = Math.abs(imgWidth) * 2;
  const imgGroupHeight = Math.abs(imgHeight) * 2;

  // console.log(info.a / imgWidth, info.a / imgHeight);

  // const n = 1;
  const n = Math.ceil(Math.max(info.a / imgGroupWidth, info.a / imgGroupHeight)) + 1;
  const num = 2 * n - 1;

  // const list = [
  //   [{ index: 0 }, { index: 0 }, { index: 0 }],
  //   [{ index: 0 }, { index: 0 }, { index: 0 }],
  //   [{ index: 0 }, { index: 0 }, { index: 0 }],
  // ];

  // 生成二维数组
  const list = [];
  for (let i = 0; i < num; i++) {
    let arr = [];
    for (let j = 0; j < num; j++) {
      arr.push({ rowIndex: i, colIndex: j });
    }
    list.push(arr);
  }

  // 最外层的组
  const group = createGroup(image);

  // 设置大组的偏移量
  const baseOffsetX = info.imageWidth / 2;
  const baseOffsetY = info.imageHeight / 2;
  group.setAttrs({
    offsetX: Math.abs(baseOffsetX + imgGroupWidth * (n - 1)),
    offsetY: Math.abs(baseOffsetY + imgGroupHeight * (n - 1)),
  });

  // 创建图片
  list.forEach((rowList, rowIndex) => {
    rowList.forEach((item, colIndex) => {
      const img = createImageGroup(info, imgWidth, imgHeight, rowIndex, colIndex, params);
      group.add(img);
    });
  });

  // console.log('image', image);

  // 添加到clip
  info.clip.add(group);

  group.zIndex(image.zIndex());

  // 置底
  // group.moveToBottom();

  image.attrs.konvaCanvas.updateTexture('tile', 10);
}

/**
 * 更新平铺图
 */
function updateTile(image, type = '') {
  const clip = image.attrs.konvaCanvas.clip;
  // 如果存在平铺图
  const tile = TileUtil.find(image);
  if (tile) {
    if (type === '') {
      tile?.destroy();
      setTimeout(() => TileUtil.add(image));
    } else if (type === 'rotation') {
      tile.rotation(image.attrs.rotation);
    } else if (type === 'move') {
      tile.setAttrs({
        x: image.x(),
        y: image.y(),
      });
    }
  }

  return tile;
}

/**
 * 获取平铺需要的信息
 * @param {Konva.Image} image
 */
function getTileInfo(image) {
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
function createImageGroup(info, width, height, rowIndex, colIndex, params) {
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
    rowIndex,
    colIndex,
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
function createGroup(image) {
  const info = getTileInfo(image);

  return new Konva.Group({
    name: 'tile',
    image,
    x: Math.abs(info.currentX),
    y: Math.abs(info.currentY),
    width: info.a,
    height: info.a,
    rotation: image.attrs.rotation,
    visible: image.attrs.visible,
  });
}
