<!--画布-->
<template>
  <boxAdaptive>
    <div class="canvas-container" id="my-canvas-container-bd">
      <!--左侧—视图列表-->
      <previewList ref="previewListRef" />

      <!--canvas-->
      <div class="canvas-workspace">
        <div style="position: relative; transform: scale(1.3); transform-origin: left">
          <div v-for="view in activeData.viewList" style="position: absolute" :style="{ left: activeView.id === view.id ? 0 : view.id * 9999 + 'px' }">
            <img style="position: absolute" :src="view.prod" alt="" />
            <div style="position: absolute">
              <myCanvas :view="view" />
            </div>
            <img style="position: absolute; pointer-events: none" :src="view.bg" alt="" />
          </div>
        </div>
      </div>
    </div>
  </boxAdaptive>
</template>

<script>
import previewList from './components/previewList.vue';
import { mapGetters, mapState } from 'vuex';
import myCanvas from '@/designApp/view/components/canvas';
export default {
  components: {
    previewList,
    myCanvas,
  },
  data() {
    return {
      view: null,
    };
  },
  watch: {
    activeView: {
      handler(val) {
        if (val) {
          this.$nextTick(() => {
            this.view = this.prod.viewList.find((item) => item.id === val.id);
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapState({
      prod: (state) => state.designApp.prod,
      activeView: (state) => state.designApp.prod.activeView,
    }),
    ...mapGetters({
      activeData: 'designApp/activeData',
    }),
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped lang="less">
// 画布
.canvas-container {
  width: 100%;
  height: 100%;
  position: relative;

  // 边框 虚线 间距5 5
  border: 1px dashed #ccc;
  border-spacing: 5px;
}
</style>
