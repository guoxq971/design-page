<template>
  <el-tabs class="tabs" v-model="active">
    <el-tab-pane label="背景图" name="image">
      <imageBackground />
    </el-tab-pane>
    <el-tab-pane label="背景色" name="color">
      <colorBackground />
    </el-tab-pane>
    <el-tab-pane label="收藏背景" name="collect">
      <span slot="label" v-title="'对背景图鼠标右键可【收藏】/【取消收藏】背景'">收藏背景</span>
      <collectBackground />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import imageBackground from './imageBackground';
import collectBackground from './collectBackground';
import colorBackground from './colorBackground';
import title from '@/designApplication/core/utils/directives/title/title';
export default {
  directives: { title },
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
