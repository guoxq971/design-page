<template>
  <el-tabs class="tabs" v-model="active">
    <el-tab-pane label="文字" name="common"></el-tab-pane>
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
