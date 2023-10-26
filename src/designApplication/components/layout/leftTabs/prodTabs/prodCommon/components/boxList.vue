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
        <div class="box-wrap" v-for="item in list" :key="'commonProd' + item.seqId" @click="onSetProd(item)">
          <boxContainer @mouseleave="mouseleave" @mouseenter="mouseenter" :detail="item" :active="isActive(item)" :prod="item.showImage.thumbImg" :bg="item.showImage.texture" />
        </div>
        <div v-for="item in 4" class="box-wrap" />
      </div>
    </div>

    <!--hover 详情-->
    <hoverDetailProd v-if="hoverActive" :detail="hoverActive" @mouseleave.native="mouseleave" @mouseenter.native="mouseenter" />
  </div>
</template>

<script>
import boxContainer from '@/designApplication/components/boxContainer.vue';
import hoverDetailProd from '@/designApplication/components/hoverDetailProd.vue';
import { ParseProdItem } from '@/designApplication/interface/commonProdParse';

export default {
  components: {
    boxContainer,
    hoverDetailProd,
  },
  props: {
    // 获取产品列表
    getList: { type: Function, default: () => {} },
    /**
     * 产品列表
     * @see {import('@/design').ProdListDataItem[]}
     * */
    list: { type: Array, default: () => [] },
  },
  data() {
    return {
      hoverTimer: null, // 鼠标悬浮定时器
      hoverActive: null, // 鼠标悬浮的产品
    };
  },
  computed: {
    isActive() {
      return (item) => this.$store.state.designApplication.prodStore.has(item);
    },
  },
  methods: {
    // 选中产品
    onSetProd(item) {
      // 如果一样的产品，不做处理
      if (this.$store.state.designApplication.prodStore.has(item)) return;
      // 设置选中产品 vuex
      this.$store.dispatch('designApplication/setProd', item);
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
@import url('src/designApplication/components/layout/leftTabs/commonBoxList.less');
</style>
