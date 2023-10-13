<!--通用产品-头部搜索-->
<template>
  <div class="header-container">
    <el-input class="ipt-wrap" placeholder="请输入名称/编号" v-model="param.tempalteNoOrName" @keyup.enter.native="getList(true)">
      <el-button slot="append" icon="el-icon-search" :loading="loading" @click="getList(true)" />
    </el-input>
    <div class="other-wrap">
      <el-cascader
        class="classify-wrap"
        filterable
        placeholder="分类"
        popper-class="pc-sel-area-cascader"
        v-model="selectCheck_category"
        :options="selectList_category"
        :props="{ checkStrictly: true }"
        @change="getList"
        clearable
      />
      <el-cascader
        class="new-wrap"
        filterable
        placeholder="分类"
        popper-class="pc-sel-area-cascader"
        v-model="selectCheck_category"
        :options="selectList_category"
        :props="{ checkStrictly: true }"
        @change="getList"
        clearable
      />
    </div>
  </div>
</template>

<script>
export default {
  props: { getList: Function },
  data() {
    return {
      selectCheck_category: [],
      selectList_category: [],
      param: {},
      loading: false,
    };
  },
};
</script>

<style lang="less">
// 分类-级联高度
.pc-sel-area-cascader {
  .el-cascader-menu__wrap {
    height: 350px !important;
  }
}
</style>
<style scoped lang="less">
.header-container {
  display: flex;
  margin: 0 4px 4px 4px;

  .ipt-wrap {
    flex: 3.5 1 0;
  }
  .other-wrap {
    display: flex;
    flex: 5;
    .classify-wrap {
      flex: 5.5 1 0;
      margin: 0 5px;
    }
    .new-wrap {
      flex: 4 1 0;
    }
  }
}
</style>
