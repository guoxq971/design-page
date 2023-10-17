<!--背景图-列表-->
<template>
  <div class="list-container">
    <div class="box-list">
      <!--空数据-->
      <div class="empty" v-if="list.length === 0">
        <el-empty description="" />
      </div>

      <!--数据盒子-->
      <div class="list" v-else>
        <div class="box-wrap" v-for="item in list" :key="'myImage' + item.id" @click="onSetImage(item)">
          <boxContainer style="background-color: rgb(245, 247, 250)" @mouseleave="mouseleave" @mouseenter="mouseenter" :detail="item" :src="item.previewImg" />
        </div>
        <div v-for="item in 4" class="box-wrap" />
      </div>
    </div>

    <!--hover 详情-->
    <hoverDetailImage v-if="hoverActive" :detail="hoverActive" @mouseleave.native="mouseleave" @mouseenter.native="mouseenter" />
  </div>
</template>

<script>
import boxContainer from '@/designApplication/components/boxContainer.vue';
import hoverDetailImage from '@/designApplication/components/hoverDetailImage.vue';
import { ParseProdItem } from '@/designApplication/interface/commonProdParse';

export default {
  components: {
    boxContainer,
    hoverDetailImage,
  },
  props: {
    // 获取设计图列表
    getList: { type: Function, default: () => {} },
    /**
     * 设计图列表
     * @class {ImageListByMyImage[]}
     * */
    list: { type: Array, default: () => [] },
  },
  data() {
    return {
      hoverTimer: null, // 鼠标悬浮定时器
      hoverActive: null, // 鼠标悬浮的产品
    };
  },
  methods: {
    // 选中设计图
    onSetImage(item) {
      this.$store.dispatch('designApplication/setImage', item);
    },
    // 鼠标进入
    mouseenter(item) {
      clearTimeout(this.hoverTimer);
      if (item && item.id) this.hoverActive = item;
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
