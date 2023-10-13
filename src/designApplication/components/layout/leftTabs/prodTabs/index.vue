<template>
  <el-tabs class="tabs" v-model="active">
    <el-tab-pane label="通用产品" name="common">
      <prodCommon />
    </el-tab-pane>
    <el-tab-pane label="FBA专用产品"></el-tab-pane>
    <el-tab-pane label="收藏产品"></el-tab-pane>
  </el-tabs>
</template>

<script>
import prodCommon from './prodCommon';
export default {
  components: {
    prodCommon,
  },
  data() {
    return {
      active: 'common',
    };
  },
};
</script>

<style scoped lang="less"></style>
