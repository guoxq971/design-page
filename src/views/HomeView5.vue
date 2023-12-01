<template>
  <div>
    <div id="container" style="width: 500px; height: 500px; border: 1px solid"></div>
  </div>
</template>

<script>
import { Konva } from '@/designApplication/core/canvas/konva';
import image from '@/assets/300.jpg';
export default {
  data() {
    return {};
  },
  mounted() {
    // 创建舞台
    var stage = new Konva.Stage({
      container: 'container', // 选择一个 HTML 元素作为容器
      width: 500,
      height: 500,
    });

    const layer = new Konva.Layer();
    stage.add(layer);

    // 创建外部组
    var outerGroup = new Konva.Group({
      width: 500,
      height: 500,
    });

    // 创建外部矩形
    var outerRect = new Konva.Rect({
      width: 500,
      height: 500,
      fill: 'lightblue',
    });

    // 创建内部组
    var innerGroup = new Konva.Group({
      width: 100,
      height: 100,
    });

    // 创建内部矩形
    var innerRect = new Konva.Rect({
      width: 100,
      height: 100,
      fill: 'red',
      x: 200, // 调整内部矩形的 x 位置
      y: 200, // 调整内部矩形的 y 位置
    });

    // 将内部组添加到外部组
    outerGroup.add(outerRect);
    outerGroup.add(innerGroup);

    // 将内部矩形添加到内部组
    innerGroup.add(innerRect);

    // 将外部组添加到舞台
    layer.add(outerGroup);

    // // konva
    // const stage = new Konva.Stage({
    //   container: 'container',
    //   width: 800,
    //   height: 800,
    // });
    //
    // const layer = new Konva.Layer();
    // stage.add(layer);
    //
    // const imageObj = new Image();
    // imageObj.src = image;
    // imageObj.onload = function () {
    //   // 将图片在画布中平铺
    //   const pattern = new Konva.Rect({
    //     x: 0,
    //     y: 0,
    //     width: 800,
    //     height: 800,
    //     fillPatternImage: imageObj,
    //     fillPatternRepeat: 'repeat',
    //     fillPatternRotation: 0,
    //     fillPatternX: 10,
    //     fillPatternY: 10,
    //     fillPatternOffset: {
    //       x: 0,
    //       y: 0,
    //     },
    //     fillPatternScale: {
    //       x: 1,
    //       y: 1,
    //     },
    //   });
    //
    //   // 设置平铺
    //
    //   layer.add(pattern);
    // };
  },
};
</script>
