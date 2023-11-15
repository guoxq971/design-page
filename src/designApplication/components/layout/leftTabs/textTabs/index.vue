<template>
  <el-tabs class="tabs" v-model="active">
    <el-tab-pane label="文字" name="text">
      <textCard />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import textCard from './text';
export default {
  components: {
    textCard,
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
