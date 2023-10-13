/**
 * konva的rect配置
 * @param {Object} param 参数
 * @param {Object} param.image 图片
 * @param {Boolean} param.draggable 是否可拖动
 * @returns {Konva.Rect} konva的rect配置
 * */
export const konvaRectConfig = (param) => {
  const { image } = param;

  const width = image.width;
  const height = image.height;

  return {
    width: width, // 宽度
    height: height, // 高度

    // 坐标,旋转,缩放 --start
    x: 0, // 距离左边的距离
    y: 0, // 距离上边的距离
    scale: { x: 1, y: 1 }, // 缩放比例
    // scaleX: 1, // 缩放比例
    // scaleY: 1, // 缩放比例
    rotation: 0, // 旋转角度
    // 坐标,旋转,缩放 --end

    // 拖动 --start
    draggable: true, // 允许拖动
    dragDistance: 1, // 拖动距离 (拖动多少距离才算拖动)
    // 拖动限制
    dragBoundFunc: function (pos) {
      return {
        x: pos.x,
        y: pos.y,
      };
    },
    // 拖动 --end

    id: 'rect', // id (唯一标识)
    name: 'rect', // 名称 (可重复)
    cornerRadius: 0, // 圆角
    offset: { x: 0, y: 0 }, // 偏移量 (作用于x,y)
    // offsetX: 0, // 偏移量
    // offsetY: 0, // 偏移量
    opacity: 1, // 透明度
    visible: true, // 是否可见
    listening: true, // 是否监听事件
    fillEnabled: true, // 是否填充 (启用或禁用填充的标志)
    perfectDrawEnabled: true, // 是否启用完美优化绘制 (true: 启用, false: 禁用)
    fillPriority: 'pattern', // 填充优先级 (color: 颜色优先, pattern: 图片优先)

    // 没测出有什么作用 --start
    // lineJoin: 'round', // 线条连接 (round: 圆角, bevel: 斜角, miter: 尖角)
    // lineCap: 'round', // 线条末端 (round: 圆角, square: 方角, butt: 平角)
    // dashEnabled: true, // 是否启用虚线 (true: 启用, false: 禁用)
    // dash: [10, 5], // 虚线 (数组: [虚线长度, 间隙长度], null: 实线)
    // 没测出有什么作用 --end

    //  图片 --start
    fillPatternImage: image, // 填充图片 (与fill互斥)
    fillPatternX: 0, // 图片的x坐标 (类似于background-position-x)
    fillPatternY: 0, // 图片的y坐标 (类似于background-position-y)
    fillPatternOffset: { x: 0, y: 0 }, // 图片的偏移量
    // fillPatternOffsetX: 0, // 图片的x偏移量
    // fillPatternOffsetY: 0, // 图片的y偏移量
    fillPatternScale: { x: 1, y: 1 }, // 图片的缩放比例
    // fillPatternScaleX: 1, // 图片的x缩放比例
    // fillPatternScaleY: 1, // 图片的y缩放比例
    fillPatternRotation: 0, // 图片的旋转角度
    fillPatternRepeat: 'no-repeat', // 图片的重复方式 (no-repeat:不重复 repeat-x:水平重复 repeat-y:垂直重复 repeat:水平垂直重复)
    //  图片 --end

    // 填充色 --start
    fill: null, // 填充色(这个属性与 fillPatternImage 互斥)  transparent:透明 null:无
    // 填充色 --end

    // 渐变色 --start  (对image无效)
    // fillLinearGradientColorStops: [0, 'red', 0.5, 'green', 1, 'blue'], // 渐变的颜色
    fillLinearGradientStartPoint: { x: 0, y: 0 }, // 渐变的起点
    // fillLinearGradientStartPointX: 0, // 渐变的起点x坐标
    // fillLinearGradientStartPointY: 0, // 渐变的起点y坐标
    fillLinearGradientEndPoint: { x: 100, y: 100 }, // 渐变的终点
    // fillLinearGradientEndPointX: 0, // 渐变的终点x坐标
    // fillLinearGradientEndPointY: 0, // 渐变的终点y坐标
    // 渐变色 --end

    // 圆形渐变色 --start  (对image无效)
    // fillRadialGradientColorStops: [0, 'red', 0.5, 'green', 1, 'blue'], // 渐变的颜色
    fillRadialGradientStartRadius: 0, // 渐变的起始半径
    fillRadialGradientEndRadius: 200, // 渐变的终止半径
    fillRadialGradientStartPoint: { x: 100, y: 100 }, // 渐变的起点
    // fillRadialGradientStartPointX: 0, // 渐变的起点x坐标
    // fillRadialGradientStartPointY: 0, // 渐变的起点y坐标
    fillRadialGradientEndPoint: { x: 50, y: 50 }, // 渐变的终点
    // fillRadialGradientEndPointX: 0, // 渐变的终点x坐标
    // fillRadialGradientEndPointY: 0, // 渐变的终点y坐标
    // 圆形渐变色 --end

    // 阴影--start
    shadowEnabled: false, // 是否启用阴影 (true: 启用, false: 禁用)
    shadowColor: 'red', // 阴影颜色
    shadowBlur: 10, // 阴影模糊度
    shadowOffset: { x: 10, y: 10 }, // 阴影偏移量
    // shadowOffsetX: 10, // 阴影水平偏移量
    // shadowOffsetY: 10, // 阴影垂直偏移量
    shadowOpacity: 0.5, // 阴影透明度
    shadowForStrokeEnabled: true, // 是否启用描边阴影 (true: 启用, false: 禁用)
    // 阴影--end

    // 描边--start
    strokeEnabled: false, // 是否启用描边 (true: 启用, false: 禁用)
    stroke: 'red', // 描边颜色 (null: 无描边)
    strokeWidth: 20, // 描边宽度
    fillAfterStrokeEnabled: true, // 描边后填充 (true: 描边后填充, false: 描边前填充)
    hitStrokeWidth: 20, // 点击描边宽度 (0: 不可点击描边, >0: 可点击描边)
    // strokeHitEnabled: true, // 是否启用描边点击 (true: 启用, false: 禁用)
    strokeScaleEnabled: true, // 是否启用描边缩放 (true: 启用, false: 禁用)
    // 描边--end
  };
};

/**
 * konva的transformer配置
 @param {Object} param 参数
 @param {Object} param.node 节点
 @param {Object} param.nodes 节点s
 @returns {Konva.Transformer} konva的Transformer配置
 * */
export const konvaTransformerConfig = (param = {}) => {
  const { node, nodes } = param;
  let _nodes = nodes || [];
  if (node) _nodes = [node];

  return {
    draggable: false, // 是否可拖拽
    nodes: _nodes, // 传入节点
    // shiftBehavior: 'resize', // 按住shift键时的行为 resize: 缩放 rotate: 旋转 [没测出什么效果]
    flipEnabled: true, // 允许翻转
    ignoreStroke: false, // 忽略边框 (锚点不会被边框遮挡)
    useSingleNodeRotation: false, // 是否使用单节点旋转
    shouldOverdrawWholeArea: true, // 是否允许绘制超出图形边界的区域

    // 旋转 --start
    rotateAnchorOffset: 50, // 旋转按钮的偏移量
    rotateAnchorCursor: 'pointer', // 旋转按钮的光标
    // rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315], // 旋转的角度
    // rotationSnapTolerance: 5, // 旋转的角度容差 (超过容差的角度会被吸附到最近的角度)
    // 旋转 --end

    // 边框 --start
    borderStrokeWidth: 1.5, // 边框的宽度
    borderDash: [], // 边框的虚线
    borderStroke: '#4087ff', // 边框的颜色
    // 边框 --end

    // 锚点 --start
    enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'], // 允许的锚点
    anchorFill: '#ffffff', // 锚点的填充色
    anchorStroke: '#4087ff', // 锚点的边框颜色
    anchorCornerRadius: 2, // 锚点的圆角
    anchorStrokeWidth: 1.5, // 锚点的边框宽度
    anchorSize: 15, // 锚点的大小
    // 锚点 --end

    // 缩放 --start
    keepRatio: true, // 保持比例 (缩放时保持比例)
    centeredScaling: true, // 是否启用中心缩放
    // 缩放 --end

    // 限制缩放的最大值 (缩放, 旋转时都会触发)
    boundBoxFunc(oldBox, newBox) {
      return newBox;
    },
  };
};
