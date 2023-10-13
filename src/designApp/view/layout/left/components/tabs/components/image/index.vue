<template>
  <el-tabs class="tabs" v-model="active">
    <el-tab-pane label="我的图库" name="common">
      <commonProd />
    </el-tab-pane>
    <el-tab-pane label="共享图库"></el-tab-pane>
    <el-tab-pane label="管理图库"></el-tab-pane>
    <el-tab-pane label="收藏图片"></el-tab-pane>
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
