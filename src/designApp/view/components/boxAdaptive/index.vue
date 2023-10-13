<!--百分比盒子-->
<template>
  <div class="my-box-container" :style="{ width: width }">
    <div class="my-box-wrap" :style="{ paddingBottom: height }">
      <div class="my-box-item">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 宽度
    width: { type: String, default: '100%' },
    // 高度 (高度是宽度的百分比 || 固定值 px)
    height: { type: String, default: '100%' },
  },
};
</script>

<style scoped lang="less">
.my-box-container {
  //width: 25%;
  .my-box-wrap {
    width: 100%;
    height: 0;
    //padding-bottom: 45%;
    position: relative;
    .my-box-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
