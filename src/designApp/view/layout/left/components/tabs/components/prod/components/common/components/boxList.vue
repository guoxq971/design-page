<!--通用产品-列表-->
<template>
  <div class="list-container">
    <div class="box-list">
      <!--空数据-->
      <div class="empty" v-if="list.length === 0">
        <el-empty description="" />
      </div>

      <!--数据盒子-->
      <div class="list" v-else>
        <div class="box-wrap" v-for="item in list" :key="item.seqId" @click="onSetProd(item)">
          <boxContainer @mouseleave="mouseleave" @mouseenter="mouseenter" :detail="item" :active="item.isActive" :prod="item.showImage.thumbImg" :bg="item.showImage.texture" />
        </div>
        <div v-for="item in 4" class="box-wrap" />
      </div>
    </div>

    <!--hover 详情-->
    <hoverDetailProd v-if="hoverActive" :detail="hoverActive" @mouseleave.native="mouseleave" @mouseenter.native="mouseenter" />
  </div>
</template>

<script>
import boxContainer from '@/designApp/view/components/boxContainer';
import hoverDetailProd from '@/designApp/view/components/hoverDetailProd';
export default {
  components: {
    boxContainer,
    hoverDetailProd,
  },
  props: {
    // 获取产品列表
    getList: { type: Function, default: () => {} },
    // 产品列表
    list: { type: Array, default: () => [] },
  },
  data() {
    return {
      hoverTimer: null, // 鼠标悬浮定时器
      hoverActive: null, // 鼠标悬浮的产品
    };
  },
  methods: {
    // 选中产品
    onSetProd(item) {
      this.list.forEach((item) => this.$set(item, 'isActive', false));
      this.$set(item, 'isActive', true);
      this.$store.dispatch('designApp/setProd', item);
    },
    // 鼠标进入
    mouseenter(item) {
      clearTimeout(this.hoverTimer);
      if (item && item.seqId) this.hoverActive = item;
    },
    // 鼠标离开
    mouseleave(item) {
      this.hoverTimer = setTimeout(() => (this.hoverActive = null), 300);
    },
  },
};
</script>

<style scoped lang="less">
@num: 4; // 每行显示个数
.list-container {
  position: relative;
  .box-list {
    min-height: 580px;
    overflow: auto;

    .list {
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: space-between;
      overflow: auto;
      padding: 3px 4.5px 8px 4.5px;

      .box-wrap {
        width: calc(100% / @num);
      }
    }

    .empty {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
