<!--背景图-头部搜索-->
<template>
  <div class="header-container">
    <div class="header-top">
      <el-input class="ipt-wrap" placeholder="请输入图片标题/编号" v-model="params.query" @keyup.enter.native="getList(true)">
        <el-button slot="append" icon="el-icon-search" :loading="loading" @click="getList(true)" />
      </el-input>
      <!--筛选-->
      <el-popover placement="bottom" width="550" trigger="click">
        <filterPop :param="params" :get-list="getList" />
        <el-button class="sx-btn" slot="reference" style="height: 100%">
          <span>筛选</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import filterPop from './filterPop.vue';
export default {
  components: {
    filterPop,
  },
  props: {
    /**
     * 请求参数
     * @class {ImageListParams}
     * */
    params: Object,
    loading: Boolean,
    getList: Function,
  },
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped lang="less">
@import url('src/designApplication/components/layout/leftTabs/header.less');

.header-container {
  display: flex;
  flex-direction: column;
  margin: 0 4px 4px 4px;
  .header-top {
    display: flex;
    margin-bottom: 5px;
  }

  .sx-btn {
    margin: 0 5px;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
