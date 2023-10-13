<template>
  <el-tabs class="tabs" v-model="active">
    <el-tab-pane label="通用产品" name="common">
      <commonProd />
    </el-tab-pane>
    <el-tab-pane label="FBA专用产品"></el-tab-pane>
    <el-tab-pane label="收藏产品"></el-tab-pane>
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
