<!--我的图库-列表-->
<template>
  <div class="list-container">
    <div class="box-list">
      <!--空数据-->
      <div class="empty" v-if="list.length === 0">
        <el-empty description="" />
        <boxAdaptive width="25%" v-for="item in 24 - list.length" :key="item" />
      </div>

      <!--数据盒子-->
      <div class="list" v-else>
        <div class="box-wrap" v-for="item in list" :key="'myImage' + item.id" @click="onSetImage(item)" @contextmenu="(e) => onContextmenu(e, item)">
          <boxContainer style="background-color: rgb(245, 247, 250)" @mouseleave="mouseleave" @mouseenter="mouseenter" :detail="item" :src="item.previewImg" />
        </div>
        <boxAdaptive width="25%" v-for="item in 24 - list.length" :key="item" />
      </div>
    </div>

    <!--hover 详情-->
    <hoverDetailImage v-if="hoverActive" :detail="hoverActive" @mouseleave.native="mouseleave" @mouseenter.native="mouseenter" />
  </div>
</template>

<script>
import boxContainer from '@/designApplication/components/boxContainer.vue';
import hoverDetailImage from '@/designApplication/components/hoverDetailImage.vue';
import boxAdaptive from '@/designApplication/components/boxAdaptive.vue';
import { queue_define, useQueue } from '@/designApplication/core/utils/useQueue';

export default {
  components: {
    boxContainer,
    hoverDetailImage,
    boxAdaptive,
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
    /**
     * 右键菜单
     * @param {any} e
     * @param {import('@/design').ImageListItem} item
     */
    onContextmenu(e, item) {
      e.preventDefault();
      this.$emit('onContextmenu', item);
    },
    // 选中设计图
    async onSetImage(item) {
      await this.$store.dispatch('designApplication/setImage', { detail: item });

      // 操作记录
      useQueue().add(queue_define.create_image);
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
