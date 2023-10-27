import store from '@/store';
import { Konva } from '@/designApplication/core/canvas/konva';
import { OperationUtil } from '@/designApplication/core/utils/operationUtil';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';

/**
 * 初始化 - 舞台
 * @param {import('@/design').InitParamOfKonvaCanvas} param 参数
 * @return {Konva.Stage} 舞台
 */
export function initStage(param) {
  const canvasSize = store.state.designApplication.config.canvasSize;

  return new Konva.Stage({
    container: param.id,
    width: canvasSize.width,
    height: canvasSize.height,
  });
}

/**
 * 初始化 - 图层
 * @param {import('@/design').InitParamOfKonvaCanvas} param 参数
 * @return {Konva.Layer}
 */
export function initLayer(param) {
  return new Konva.Layer();
}

/**
 * 初始化 - 虚线边框
 * @param {import('@/design').InitParamOfKonvaCanvas} param 参数
 * @return {Konva.Rect}
 */
export function initDashArea(param) {
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
 * 产品的边框
 * @param param
 * @returns {Konva.Path}
 */
export function initRect(param) {
  const staticView = param.staticView;
  const canvasConfig = store.state.designApplication.config.canvas;
  const canvasSize = store.state.designApplication.config.canvasSize;
  const isShowProdRect = store.state.designApplication.config.canvas.isShowProdRect;
  const offsetX = staticView.offset.x * (canvasSize.ratio - 1);
  const offsetY = staticView.offset.y * (canvasSize.ratio - 1);
  const x = staticView.offset.x + offsetX;
  const y = staticView.offset.y + offsetY;

  const width = staticView.print.width;
  const height = staticView.print.height;
  const d = `M0,0 L${width},0 L${width},${height} L0,${height} Z`;

  // 裁剪区域（边框）
  const path = new Konva.Path({
    x: x,
    y: y,
    data: d,
    fill: null,
    stroke: 'red',
    strokeWidth: 2,
    dash: [5, 5],
    type: 'path',
    scaleX: canvasSize.ratio,
    scaleY: canvasSize.ratio,
    visible: isShowProdRect,
  });

  return path;
}

/**
 * 初始化 - 车线
 * @param {import('@/design').InitParamOfKonvaCanvas} param 参数
 * @returns {Konva.Path | null}
 */
export function initV(param) {
  const canvasConfig = store.state.designApplication.config.canvas;
  const canvasSize = store.state.designApplication.config.canvasSize;
  const staticView = param.staticView;

  const offsetX = staticView.offset.x * (canvasSize.ratio - 1);
  const offsetY = staticView.offset.y * (canvasSize.ratio - 1);
  const x = staticView.offset.x + offsetX;
  const y = staticView.offset.y + offsetY;
  const v = staticView.v;
  if (!v) return;

  let resultV;

  resultV = new Konva.Path({
    x: x,
    y: y,
    data: v,
    fill: null,
    stroke: canvasConfig.vStoreColor,
    strokeWidth: canvasConfig.vStoreWidth,
    dash: canvasConfig.vDash,
    type: 'path',
    scaleX: canvasSize.ratio,
    scaleY: canvasSize.ratio,
    visible: canvasConfig.isV,
  });

  return resultV;
}

/**
 * 初始化裁剪区域
 * @param {import('@/design').InitParamOfKonvaCanvas} param 参数
 * @returns {{clip:Konva.Group, konvaPath:Konva.Path}}
 * */
export function initClip(param) {
  const staticView = param.staticView;
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

  // 裁剪区域（边框）
  const konvaPath = new Konva.Path({
    x: x,
    y: y,
    data: d,
    fill: canvasConfig.clipStoreFill,
    // stroke: 'magenta',
    // strokeWidth: 1,
    stroke: canvasConfig.clipStoreColor,
    strokeWidth: canvasConfig.clipStoreWidth,
    type: 'path',
    scaleX: canvasSize.ratio,
    scaleY: canvasSize.ratio,
  });

  // 裁剪区域
  const isClip = store.state.designApplication.config.canvas.isClip;
  const clip = new Konva.Group({
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
    clipFunc2: () =>
      function (ctx, group) {
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

  return { clip, konvaPath };
}

/**
 * 监听事件 - canvas
 */
export function addEvent(stage, layer, hideAllTransformer) {
  const { image, back, CustomTransformer, bgc } = canvasDefine;
  // 监听点击的位置是否有元素 (return的是不需要触发隐藏选中框)
  stage.on('mousedown', (e) => {
    if (e.target.attrs.name === image) return;
    if (e.target.attrs.name === 'rotater _anchor') return;
    if (e.target.attrs.name === 'top-right _anchor') return;
    if (e.target.attrs.name === 'top-left _anchor') return;
    if (e.target.attrs.name === 'bottom-left _anchor') return;
    if (e.target.attrs.name === 'bottom-right _anchor') return;

    if (e.target.attrs.name === back && e.target.parent && e.target.parent.customName === CustomTransformer) {
      if (e.target.parent._nodes && e.target.parent._nodes[0]?.attrs.name === bgc) {
        //
      } else {
        return;
      }
    }
    hideAllTransformer();
  });

  // 监听双击事件
  stage.on('dblclick', (e) => {
    // 选中非设计图 && 没有选中元素 && 事件是用户触发的
    if (e.target.attrs.type !== image && e.evt.isTrusted) {
      OperationUtil.doubleClickCanvas();
    }
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
