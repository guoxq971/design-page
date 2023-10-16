// import Konva from 'konva';
import { Konva } from '@/designApplication/core/canvas/konva';
import store from '@/store';

/**
 * 绘制区域
 * @param {ParseViewItem} view 视图
 * @returns {Konva.Rect}
 * */
export function drawAreaDash(view) {
  const canvasSize = store.state.designApplication.config.canvasSize;
  return new Konva.Rect({
    width: canvasSize.width,
    height: canvasSize.height,
    stroke: 'black',
    strokeWidth: 1,
    dash: [5, 5],
    dashEnabled: true,
    fillEnabled: true,
    listening: false,
    // fill: 'pink',
  });
}

/**
 * 初始化产品绘制区域-绘制区域 (裁剪区域, 超出隐藏)
 * @param {StaticViewItem} staticView 视图
 * @param {ParseViewItem} view 视图
 * @returns {{clip: Konva.Group, konvaPath: Konva.Path}}
 * */
export function initProdArea(staticView, view) {
  const canvasConfig = store.state.designApplication.config.canvas;
  const canvasSize = store.state.designApplication.config.canvasSize;
  const offsetX = staticView.offset.x * (canvasSize.ratio - 1);
  const offsetY = staticView.offset.y * (canvasSize.ratio - 1);
  const x = staticView.offset.x + offsetX;
  const y = staticView.offset.y + offsetY;
  let d = staticView.print?.d;

  if (!d) {
    const width = staticView.print.width;
    const height = staticView.print.height;
    d = `M0,0 L${width},0 L${width},${height} L0,${height} Z`;
  }

  const konvaPath = new Konva.Path({
    x: x,
    y: y,
    data: d,
    fill: canvasConfig.clipStoreFill,
    stroke: canvasConfig.clipStoreColor, //'magenta',
    strokeWidth: 0, //canvasConfig.clipStoreWidth,
    type: 'path',
    scaleX: canvasSize.ratio,
    scaleY: canvasSize.ratio,
  });

  // 裁剪区域
  const clip = createClip(x, y, konvaPath);

  return { clip, konvaPath };
}

/**
 * 创建clip
 * @param {number} x x
 * @param {number} y y
 * @param {Konva.Path} konvaPath konvaPath
 * @returns {Konva.Group}
 * */
function createClip(x, y, konvaPath) {
  const isClip = store.state.designApplication.config.canvas.isClip;
  const canvasSize = store.state.designApplication.config.canvasSize;

  return new Konva.Group({
    x: x,
    y: y,
    scaleX: canvasSize.ratio,
    scaleY: canvasSize.ratio,
    clipFunc: function (ctx, group) {
      switch (isClip) {
        case true:
          clipFunc(ctx, konvaPath);
          break;
        case false:
          ctx.rect(0, 0, canvasSize.width, canvasSize.height);
          break;
      }
    },
  });
}

/**
 * 裁剪函数
 * @param {CanvasRenderingContext2D} ctx ctx
 * @param {Konva.Path} konvaPath konvaPath
 * */
function clipFunc(ctx, konvaPath) {
  // 将 path 的数据转换成 canvas 的绘制路径
  ctx.beginPath();
  ctx.moveTo(konvaPath.dataArray[0].points[0], konvaPath.dataArray[0].points[1]);
  for (let i = 1; i < konvaPath.dataArray.length; i++) {
    const data = konvaPath.dataArray[i];
    switch (data.command) {
      case 'L':
        ctx.lineTo(data.points[0], data.points[1]);
        break;
      case 'Q':
        ctx.quadraticCurveTo(data.points[0], data.points[1], data.points[2], data.points[3]);
        break;
      case 'C':
        ctx.bezierCurveTo(data.points[0], data.points[1], data.points[2], data.points[3], data.points[4], data.points[5]);
        break;
      case 'Z':
        ctx.closePath();
        break;
    }
  }
  ctx.closePath();
}
