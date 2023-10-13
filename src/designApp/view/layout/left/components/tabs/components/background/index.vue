<template>
  <el-tabs class="tabs" v-model="active">
    <el-tab-pane label="背景图" name="common"></el-tab-pane>
    <el-tab-pane label="背景色"></el-tab-pane>
    <el-tab-pane label="收藏背景"></el-tab-pane>
  </el-tabs>
</template>

<script>
import commonProd from './components/common';
export default {
  components: { commonProd },
  data() {
    return {
      active: 'common',
    };
  },
};
</script>

<style scoped lang="less"></style>
