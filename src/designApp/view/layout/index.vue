<template>
  <div class="design-container">
    <designLeft class="design-left" />
    <designCenter class="design-center" />
    <designRight class="design-right" />
  </div>
</template>

<script>
import designCenter from './center';
import designLeft from './left';
import designRight from './right';
export default {
  components: { designCenter, designLeft, designRight },
};
</script>

<style scoped lang="less">
@paddingBottom: 35px; // 底部留白(为了能滚动到顶部刚好灰色线条)
.design-container {
  display: flex;
  overflow: hidden;
  min-width: 1600px;
  background-color: rgb(242, 242, 242);
  border-top: 1px solid rgb(204, 204, 204);
  padding: 10px 10px @paddingBottom 10px;

  .design-left {
    flex: 1;
    min-width: 380px;
  }
  .design-center {
    flex: 3;
    position: relative;
    z-index: 2;
  }
  .design-right {
    flex: 1;
    min-width: 380px;
    //background-color: darkolivegreen;
  }
}
</style>
