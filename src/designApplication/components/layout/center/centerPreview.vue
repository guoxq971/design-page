<!--左侧-预览图列表-->
<template>
  <div class="preview-container" v-if="activeProdStatic" :style="{ width: previewSize.width + 'px', left: -previewSize.positionLeft + 'px' }">
    <el-tooltip v-for="item in activeProdStatic.viewList" :key="item.id" effect="dark" :content="item.name" placement="right">
      <box-adaptive class="box-wrap" :class="{ active: item.id === activeViewId }" @click.native="onPreview(item)">
        <img :src="item.showImage.image" alt="" class="full" style="position: absolute" />
        <img :src="item.showImage.texture" alt="" class="full" style="position: absolute" />
        <div class="dot" :class="{ 'dot-active': imageLength(item.view) }"></div>
      </box-adaptive>
    </el-tooltip>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import boxContainer from '@/designApplication/components/boxContainer.vue';
import { onSelectViewWithThree } from '@/designApplication/core/three/threeUtil';

export default {
  components: { boxContainer },
  computed: {
    ...mapGetters({
      activeProd: 'designApplication/activeProd',
      activeProdStatic: 'designApplication/activeProdStatic',
    }),
    ...mapState({
      previewSize: (state) => state.designApplication.config.previewSize,
      loading_prod: (state) => state.designApplication.loading_prod,
      activeViewId: (state) => state.designApplication.activeViewId,
    }),
    imageLength() {
      /**
       * @param {import('@/design').ParseViewItem} view
       */
      return (view) => {
        return view.canvas?.getImageList().length;
      };
    },
  },
  methods: {
    // 选择视图
    onPreview(item) {
      this.$store.commit('designApplication/setActiveViewId', item.id);

      onSelectViewWithThree(item.id);
    },
  },
};
</script>

<style scoped lang="less">
.full {
  width: 100%;
  height: 100%;
}
.preview-container {
  height: 350px;
  position: absolute;
  top: 0;
  z-index: 3;

  .active {
    border: 2px solid #4087ff !important;
  }

  .box-wrap {
    width: 100%;
    border: 1px solid #888;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 8px !important;
    padding: 1px;
  }
}

.dot {
  width: 10px;
  height: 10px;
  background-color: #ccc;
  position: absolute;
  right: 2px;
  bottom: 2px;
  border-radius: 50%;
}
.dot-active {
  background-color: limegreen;
}
</style>
