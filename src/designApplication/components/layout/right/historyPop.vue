<!--历史设计记录-->
<template>
  <transition name="el-fade-in-linear">
    <el-card v-show="isShow" class="history-wrap">
      <div class="header" slot="header">
        <div>我最近设计过的产品</div>
        <div class="close el-icon-close"></div>
      </div>
      <div class="body">
        <el-card class="box-wrap" v-for="item in 6" shadow="hover">
          <div class="close el-icon-circle-close"></div>
          <box-adaptive class="pic"></box-adaptive>
          <div class="title">123456</div>
        </el-card>
      </div>
      <div class="footer"></div>
    </el-card>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isShow: false,
    };
  },
};
</script>

<style scoped lang="less">
.history-wrap {
  /deep/ .el-card__header {
    padding: 0;
  }
  .header {
    padding: 7px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    font-weight: bold;
    cursor: default;

    .close {
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      &:hover {
        color: #409eff;
      }
    }
  }

  .body {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;

    .box-wrap {
      width: 33%;
      position: relative;

      .close {
        position: absolute;
        right: 8px;
        top: 7px;
        cursor: pointer;
        font-size: 16px;
        z-index: 2;
        &:hover {
          color: #409eff;
        }
      }

      .pic {
        background-color: pink;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
      }

      .title {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  .footer {
    height: 30px;
    background-color: green;
  }
}
</style>
