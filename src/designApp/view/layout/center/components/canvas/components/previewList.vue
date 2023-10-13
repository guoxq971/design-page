<!--左侧-预览图列表-->
<template>
  <div class="preview-container" v-if="prod">
    <box-adaptive class="box-wrap" :class="{ active: item.id === prod.activeView.id }" @click.native="onPreview(item)" v-for="item in prod.viewList" :key="item.id">
      <img :src="item.prod" alt="" class="full" />
    </box-adaptive>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import boxContainer from '@/designApp/view/components/boxContainer/index.vue';

export default {
  components: { boxContainer },
  computed: {
    ...mapState({
      prod: (state) => state.designApp.prod,
    }),
  },
  methods: {
    // 选择视图
    onPreview(item) {
      this.$store.dispatch('designApp/setActiveView', item);
    },
  },
};
</script>

<style scoped lang="less">
.full {
  width: 100%;
  height: 100%;
}
@previewWidth: 90px;
.preview-container {
  width: @previewWidth;
  height: 350px;
  position: absolute;
  left: calc(-@previewWidth - 10px);
  z-index: 2;

  .active {
    border: 2px solid #4087ff !important;
  }

  .box-wrap {
    width: 100%;
    border: 1px solid #888;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 8px;
    padding: 1px;
  }
}
</style>
