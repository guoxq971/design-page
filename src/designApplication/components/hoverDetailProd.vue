<!--鼠标经过的浮框 - 产品-->
<template>
  <el-card class="hover-container">
    <!--图片-->
    <div class="image-wrap">
      <div class="num">{{ detail.detail.views.length }}面定制</div>
      <img class="image" :src="detail.showImage.thumbImg" alt="" />
      <img class="image" :src="detail.showImage.texture" alt="" />
    </div>

    <!--标题 - 副标题-->
    <div class="title">{{ detail.templateName }}</div>
    <div class="title-2">(编号:{{ detail.templateNo }}, 型号:{{ detail.templateModel }})</div>

    <!--颜色-->
    <div class="model-info-color">
      <div class="model-info-color-item" v-for="item in detail.colorList" :key="item.id">
        <div :style="{ backgroundColor: item.colorCode }"></div>
      </div>
    </div>

    <!--尺码-->
    <div class="model-info-color">
      <div class="model-info-color-size" v-for="item in detail.sizeList" :key="item.id">
        {{ item.name }}
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    detail: { type: Object, default: () => ({}) },
  },
};
</script>

<style scoped lang="less">
.hover-container {
  position: absolute;
  z-index: 7;
  top: -53px;
  right: -277px;
  width: 265px;

  /deep/ .el-card__body {
    padding: 7px;
  }

  .title {
    font-size: 13px;
    font-weight: bold;
    margin: 8px 0;
    letter-spacing: 0.4px;
  }

  .title-2 {
    color: #c0c4cc;
    font-size: 12px;
    margin-bottom: 8px;
    letter-spacing: 0.4px;
  }

  .image-wrap {
    position: relative;
    width: 100%;
    height: 245px;
    background-color: #f5f7fa;
    border-radius: 4px;
    overflow: hidden;
    .image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .num {
      position: absolute;
      z-index: 2;
      right: 4px;
      bottom: 2px;
      padding: 1px;
      border: 1px solid #66b1ff;
      border-radius: 4px;
      background-color: #66b1ff;
      color: #fff;
    }
  }
}

// 颜色 and 尺码
.model-info-color {
  display: flex;
  max-width: 430px;
  flex-wrap: wrap;

  .model-info-color-item {
    width: 19px;
    border: #d6d2d2 solid 1px;
    border-radius: 4px;
    height: 19px;
    margin-right: 4px;
    margin-bottom: 8px;
    display: flex;
    justify-content: center;
    align-items: center;

    & div {
      width: 13px;
      height: 13px;
      border-radius: 3px;
    }
  }

  .model-info-color-size {
    border: 1px solid #ccc;
    padding: 0 3px;
    margin-right: 4px;
    border-radius: 4px;
    background-color: #fff;
    margin-bottom: 8px;
    //margin-bottom: 5px;
    font-size: 13px;
  }
}
</style>
