<template>
  <div class="prod-info-container" v-if="activeProd">
    <!--标题-->
    <div class="title">{{ activeProd.detail.templateNameShow }}</div>
    <!--价格-->
    <div class="price-wrap">
      <div class="text" v-if="!loading_price">10</div>
      <div class="text" v-else>
        <div class="el-icon-loading" style="font-size: 17px" />
      </div>
      <!--特殊颜色/尺码标识-->
      <div class="warning">尺码/颜色不同价</div>
    </div>

    <!--颜色-->
    <div class="model-info-color">
      <div class="model-info-color-item" v-for="item in activeProd.colorList" :key="item.id" @click="onColor(item)" :class="{ action: item.id === activeColorId }">
        <div :style="{ backgroundColor: item.colorCode }"></div>
      </div>
    </div>

    <!--尺码-->
    <div class="model-info-color" id="design-size-list">
      <div class="model-info-color-size" v-for="item in activeProd.sizeList" :key="item.id" @click="onSize(item)" :class="{ action: item.id === activeSizeId }">
        <span>{{ item.name }}</span>
        <!--<span v-if="isShowFlag(item)" class="flag-wrap">设计</span>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      loading_price: false,
    };
  },
  computed: {
    ...mapState({
      activeColorId: (state) => state.designApplication.activeColorId,
      activeSizeId: (state) => state.designApplication.activeSizeId,
    }),
    ...mapGetters({
      activeProd: 'designApplication/activeProd',
    }),
  },
  methods: {
    // 选择颜色
    onColor(item) {
      if (this.activeColorId === item.id) return;
      this.$store.dispatch('designApplication/setActiveColorId', item);
    },
    // 选择尺码
    onSize(item) {
      if (this.activeSizeId === item.id) return;
      this.$store.dispatch('designApplication/setActiveSizeId', item);
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">
.action {
  border: 2px solid #0099ff !important;
}
.prod-info-container {
  position: absolute;
  z-index: 3;
  //width: 100%;
  //display: flex;
  //flex-direction: column;
  //align-items: center;
  * {
    width: fit-content;
  }

  .title {
    font-weight: bold;
    font-size: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 7px;
  }

  .info-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: fit-content;
    padding: 5px;
  }

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

  // 颜色/尺码
  .model-info-color {
    margin: 4px 0;
    display: flex;
    flex-wrap: wrap;

    .model-info-color-item {
      cursor: pointer;
      width: 22px;
      height: 22px;
      border: solid 1px #d6d2d2; //#D6D2D2 transparent
      border-radius: 4px;
      margin-right: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.12),
        0 0 6px rgba(0, 0, 0, 0.04);

      & div {
        width: 16px;
        height: 16px;
        border-radius: 3px;
      }
    }

    .model-info-color-size {
      position: relative;
      cursor: pointer;
      border: 2px solid transparent;
      padding: 0 7px;
      margin-right: 7px;
      border-radius: 4px;
      background-color: #fff;
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.12),
        0 0 6px rgba(0, 0, 0, 0.04);
      //margin-bottom: 5px;
    }
  }
}
</style>
