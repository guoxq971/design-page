<!--价格-->
<template>
  <div class="price-wrap">
    <div class="text" v-if="!loadingPrice">10</div>
    <div class="text" v-else>
      <div class="el-icon-loading" style="font-size: 17px" />
    </div>
    <!--特殊颜色/尺码标识-->
    <div class="warning">尺码/颜色不同价</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loadingPrice: false, //价格加载中
    };
  },
};
</script>

<style scoped lang="less">
//价格
.price-wrap {
  display: flex;
  .text {
    height: 22px;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 17px;
    color: #ff7a3d;
  }
  .warning {
    background-color: orange;
    color: #fff;
    padding: 0 4px;
    border-radius: 4px;
    font-size: 15px;
    margin-left: 6px;
    font-weight: normal;
  }
}
</style>
