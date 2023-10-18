<template>
  <el-tabs class="tabs" v-model="active">
    <el-tab-pane label="背景图" name="image">
      <imageBackground />
    </el-tab-pane>
    <el-tab-pane label="背景色" name="color">
      <colorBackground />
    </el-tab-pane>
    <el-tab-pane label="收藏背景" name="collect">
      <collectBackground />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import imageBackground from './imageBackground';
import collectBackground from './collectBackground';
import colorBackground from './colorBackground';
export default {
  components: {
    imageBackground,
    collectBackground,
    colorBackground,
  },
  data() {
    return {
      active: 'image',
    };
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped lang="less">
/deep/ .el-tabs__header {
  margin-bottom: 10px !important;
}
</style>
