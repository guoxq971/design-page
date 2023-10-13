import Konva from 'konva';

/**
 * 初始化产品绘制区域-绘制区域 (裁剪区域, 超出隐藏)
 * @param {StaticViewItem} view 视图
 * @returns {{clip: Konva.Group, konvaPath: Konva.Path}}
 * */
export function initProdArea(view) {
  const x = view.offset.x;
  const y = view.offset.y;
  let d = view.print?.d;
  const width = view.print.width;
  const height = view.print.height;
  if (!d) {
    d = `M0,0 L${width},0 L${width},${height} L0,${height} Z`;
  }

  const konvaPath = new Konva.Path({
    x: x,
    y: y,
    data: d,
    fill: '#f2f2f2',
    stroke: 'magenta',
    strokeWidth: 2,
    type: 'path',
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
  return new Konva.Group({
    x: x,
    y: y,
    clipFunc: function (ctx, group) {
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
    },
  });
}
