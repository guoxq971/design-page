<!--自适应盒子-->
<template>
  <div class="my-adaptive-wrap" :style="{ width: boxWidth, margin: margin }">
    <div class="my-adaptive-bd" :style="{ paddingBottom: height }">
      <div class="my-adaptive-context-bd">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'adaptiveBox',
  props: {
    width: { type: String, default: '100%' },
    height: { type: [String, Number], default: '100%' },
    margin: { type: String, default: '0.52%' },
  },
  computed: {
    boxWidth() {
      return `calc(${this.width} - ${this.margin} * 2)`;
    },
  },
};
</script>

<style scoped lang="less">
.my-adaptive-wrap {
  //width: 25%;
  .my-adaptive-bd {
    position: relative;
    top: 0;
    width: 100%;
    height: 0;
    //padding-bottom: 100%;

    .my-adaptive-context-bd {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      //padding: 3px;

      .my-adaptive-context {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
