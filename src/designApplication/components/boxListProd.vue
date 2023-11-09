<!--公用组件-产品列表-->
<template>
  <div class="list-container">
    <div class="box-list">
      <!--空数据-->
      <div class="empty" v-if="list.length === 0">
        <el-empty description="" />
        <boxAdaptive width="25%" v-for="item in 28" />
      </div>

      <!--数据盒子-->
      <div class="list" v-else>
        <div class="box-wrap" v-for="item in list" :key="'commonProd' + item.seqId" @click="onSetProd(item)" @contextmenu="(e) => onContextmenu(e, item)">
          <boxContainer @mouseleave="mouseleave" @mouseenter="mouseenter" :detail="item" :active="isActive(item)" :prod="item.showImage.thumbImg" :bg="item.showImage.texture" />
        </div>
        <boxAdaptive width="25%" v-for="item in 28 - list.length" :key="item" />
      </div>
    </div>

    <!--hover 详情-->
    <transition name="el-fade-in-linear">
      <hoverDetailProd v-if="hoverActive" :detail="hoverActive" @mouseleave.native="mouseleave" @mouseenter.native="mouseenter" />
    </transition>
  </div>
</template>

<script>
import boxContainer from '@/designApplication/components/boxContainer.vue';
import hoverDetailProd from '@/designApplication/components/hoverDetailProd.vue';
import boxAdaptive from '@/designApplication/components/boxAdaptive.vue';

export default {
  components: {
    boxContainer,
    hoverDetailProd,
    boxAdaptive,
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
    /**
     * 右键菜单
     * @param {any} e
     * @param {import('@/design').ProdListDataItem} item
     */
    onContextmenu(e, item) {
      e.preventDefault();
      this.$emit('onContextmenu', item);
    },
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
