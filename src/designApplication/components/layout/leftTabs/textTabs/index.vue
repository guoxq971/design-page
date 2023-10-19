<template>
  <el-tabs class="tabs" v-model="active">
    <el-tab-pane label="文字" name="text">
      <colorBackground />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import colorBackground from './colorBackground';
export default {
  components: {
    colorBackground,
  },
  data() {
    return {
      active: 'text',
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
