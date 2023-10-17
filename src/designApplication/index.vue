<template>
  <div class="design-application-container">
    <AppLeft class="design-left" />
    <AppCenter class="design-center" />
    <AppRight class="design-right" />
  </div>
</template>

<script>
import AppLeft from './components/layout/left.vue';
import AppCenter from './components/layout/center.vue';
import AppRight from './components/layout/right.vue';
export default {
  components: {
    AppLeft,
    AppCenter,
    AppRight,
  },
};
</script>

<style lang="less">
@import url('src/designApplication/components/layout/leftTabs/commomStyle.less');
</style>
<style scoped lang="less">
@paddingBottom: 35px; // 底部留白(为了能滚动到顶部刚好灰色线条)
.design-application-container {
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
    border: 1px solid darkolivegreen;
  }
}
</style>
