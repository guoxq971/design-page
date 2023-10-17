<template>
  <el-tabs class="tabs" v-model="active">
    <el-tab-pane label="通用产品" name="common">
      <prodCommon />
    </el-tab-pane>
    <el-tab-pane label="FBA专用产品" name="fba">
      <prodFba />
    </el-tab-pane>
    <el-tab-pane label="收藏产品" name="collect">
      <prodCollect />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import prodCommon from './prodCommon';
import prodFba from './prodFba';
import prodCollect from './prodCollect';
export default {
  components: {
    prodCommon,
    prodFba,
    prodCollect,
  },
  data() {
    return {
      active: 'common',
    };
  },
};
</script>

<style scoped lang="less">
/deep/ .el-tabs__header {
  margin-bottom: 10px !important;
}
</style>
