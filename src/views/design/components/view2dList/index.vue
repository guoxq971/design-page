<!--2d-canvas-->
<template>
  <el-tabs tab-position="left" class="container-2d" v-model="activeTab">
    <el-tab-pane v-for="view in prod.viewList" :name="view.id" :label="view.name" :key="view.id">
      <canvas :id="`myCanvas-${view.id}`" width="400" height="400" class="canvas" />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { FabricCanvas } from '../../three/canvas/cnavas';

export default {
  props: {
    prod: { type: Object, default: () => {} },
  },
  data() {
    return {
      activeTab: '',
    };
  },
  watch: {
    'prod.activeView': {
      handler(view) {
        this.activeTab = view.id;
      },
    },
  },
  components: {},
  mounted() {
    for (const view of this.prod.viewList) {
      view.fabricCanvas = new FabricCanvas(view);
    }
    this.activeTab = this.prod.activeView.id;
  },
};
</script>

<style scoped lang="less">
.container-2d {
  width: fit-content;
  position: relative;
  z-index: 2;
  .canvas {
    //border: 1px solid #ebeef5;
  }
  /deep/ .el-tabs__header .is-left {
    background: #fff !important;
  }
}
</style>
