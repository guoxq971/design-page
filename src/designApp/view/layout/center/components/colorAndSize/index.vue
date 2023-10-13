<!--颜色和尺码-->
<template>
  <div>
    <!--颜色-->
    <div class="model-info-color">
      <div class="model-info-color-item" v-for="item in prod.colorList" :key="item.id" @click="onColor(item)" :class="{ action: activeColor && item.id === activeColor.id }">
        <div :style="{ backgroundColor: item.colorCode }"></div>
      </div>
    </div>

    <!--尺码-->
    <div>
      <div class="model-info-color" id="design-size-list">
        <div class="model-info-color-size" v-for="item in prod.sizeList" :key="item.id" @click="onSize(item)" :class="{ action: item.id === activeSize.id }">
          <span>{{ item.name }}</span>
          <!--<span v-if="isShowFlag(item)" class="flag-wrap">设计</span>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState({
      prod: (state) => state.designApp.prod,
      activeColor: (state) => state.designApp.prod.activeColor,
      activeSize: (state) => state.designApp.prod.activeSize,
    }),
  },
  methods: {
    // 选择颜色
    onColor(item) {
      if (this.activeColor && this.activeColor.id === item.id) return;
      this.$store.dispatch('designApp/setActiveColor', item);
    },
    // 选择尺码
    onSize(item) {
      if (this.activeSize && this.activeSize.id === item.id) return;
      this.$store.dispatch('designApp/setActiveSize', item);
    },
  },
};
</script>

<style scoped lang="less">
.action {
  border: 2px solid #0099ff !important;
}
// 颜色/尺码
.model-info-color {
  margin: 4px 0;
  display: flex;
  flex-wrap: wrap;

  .model-info-color-item {
    //transition: all 0.3s;
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
</style>
