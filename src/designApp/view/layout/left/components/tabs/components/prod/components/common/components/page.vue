<!--分页-->
<template>
  <el-pagination class="page-container" :pager-count="5" @current-change="getList" :current-page.sync="param.pageNo" :page-size="param.pageSize" :total="total" layout="prev, pager, next, jumper" />
</template>

<script>
export default {
  props: {
    getList: Function,
    param: Object,
    total: Number,
  },
};
</script>

<style scoped lang="less">
.page-container {
  display: flex;
  justify-content: flex-end;
  padding-right: 10px;
}
</style>
