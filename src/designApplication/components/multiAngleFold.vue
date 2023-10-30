<template>
  <div :class="{ 'cursor-zoom-in': cursorZoomIn }" :style="{ width: picWidth, height: picHeight }" class="box-wrap" :data-name="typeName">
    <img :style="{ width: picWidth, height: picHeight }" :src="image" alt="" class="img-1 z-index-1" />
    <img :style="{ width: picWidth, height: picHeight }" v-if="mask" :src="mask" alt="" class="img-1 z-index-2" />
    <img :style="{ width: picWidth, height: picHeight }" v-if="texture" :src="texture" alt="" class="img-1 z-index-3" />
  </div>
</template>

<script>
export default {
  props: {
    // 放大镜 cursor: zoom-in
    cursorZoomIn: { type: Boolean, default: false },
    // 尺码，如果有尺码，宽高就不生效
    size: { type: [String, Number], default: -1 },
    width: { type: [String, Number], default: 330 },
    height: { type: [String, Number], default: 330 },
    // 类型名称(标记） 简单 | 复杂
    typeName: { type: String, default: '' },
    // 图片地址
    image: { type: String, default: '' },
    mask: { type: String, default: '' },
    texture: { type: String, default: '' },
  },
  computed: {
    picWidth() {
      let width = this.width;
      if (this.size !== -1) {
        width = this.size;
      }
      if (width.toString().indexOf('px') === -1) {
        width = `${width}px`;
      }
      return width;
    },
    picHeight() {
      let height = this.height;
      if (this.size !== -1) {
        height = this.size;
      }
      if (height.toString().indexOf('px') === -1) {
        height = `${height}px`;
      }
      return height;
    },
  },
};
</script>

<style scoped lang="less">
@width: 330px;
@height: 330px;
.cursor-zoom-in {
  cursor: zoom-in;
}

.box-wrap {
  width: @width;
  height: @height;
  position: relative;
}
.img-1 {
  width: @width;
  height: @height;
  position: absolute;
}
.z-index-1 {
  z-index: 1;
}
.z-index-2 {
  z-index: 2;
}
.z-index-3 {
  z-index: 3;
}
</style>
