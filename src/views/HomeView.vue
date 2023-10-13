<template>
  <div class="layout-container">
    <div class="head-wrap">头部</div>
    <div class="body-wrap">
      <div class="menu-wrap">菜单</div>
      <div class="blank-wrap">
        <div class="nav-wrap">导航栏</div>
        <div class="blank-view">
          <designApp />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import designApp from '@/designApp/view/layout';
import designApp from '@/designApplication';
export default {
  components: {
    designApp,
  },
};
</script>

<style scoped lang="less">
@headHeight: 48px;
@navHeight: 40px;
@blankViewHeight: calc(100vh - @headHeight - @navHeight);
.layout-container {
  background-color: #f2f2f2;
  .head-wrap {
    width: 100%;
    height: @headHeight;
    background-color: #4087ff;
  }
  .body-wrap {
    display: flex;
    .menu-wrap {
      width: 64px;
    }
    .blank-wrap {
      flex: 1;
      overflow: auto;
      .nav-wrap {
        height: @navHeight;
      }
      .blank-view {
        width: 100%;
        height: @blankViewHeight;
      }
    }
  }
}
</style>
