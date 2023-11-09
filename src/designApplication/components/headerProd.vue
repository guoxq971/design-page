<!--产品-头部搜索-->
<template>
  <div class="header-container">
    <el-input class="ipt-wrap" placeholder="请输入名称/编号" v-model="params.tempalteNoOrName" @keyup.enter.native="getList(true)">
      <el-button slot="append" icon="el-icon-search" :loading="loading" @click="getList(true)" />
    </el-input>
    <div class="other-wrap">
      <el-cascader
        class="classify-wrap"
        filterable
        placeholder="分类"
        popper-class="pc-sel-area-cascader"
        v-model="category.selected"
        :options="category.options"
        :props="{ checkStrictly: true }"
        @change="getListByCategory"
        clearable
      />
      <el-cascader
        class="new-wrap"
        filterable
        placeholder="分类"
        popper-class="pc-sel-area-cascader"
        v-model="newProduct.selected"
        :options="newProduct.options"
        :props="{ checkStrictly: true }"
        @change="getList"
        clearable
      />
    </div>
  </div>
</template>

<script>
import { fetchProdCategoryList } from '@/designApplication/mock/prod/prodCategoryList';

export default {
  props: {
    /**
     * 请求参数
     * @type {CommonProdParams}
     * */
    params: Object,
    loading: Boolean,
    getList: Function,
  },
  data() {
    return {
      // 一二级分类 选中 | 选项
      category: {
        selected: [],
        options: [],
      },
      // 新品 选中 | 选项
      newProduct: {
        selected: [],
        options: [],
      },
    };
  },
  methods: {
    // 一二级分类搜索
    async getListByCategory() {
      this.params.pageNo = 1;
      let category1 = '';
      let category2 = '';
      if (this.category.selected[0]) category1 = this.category.selected[0];
      if (this.category.selected[1]) category2 = this.category.selected[1];

      this.params.category1 = category1;
      this.params.category2 = category2;

      this.getList();
    },
    // 获取下拉列表 - 一二级分类
    async getSelectListByCategory() {
      const result = await fetchProdCategoryList();
      if (result.retState !== '0') return;
      this.category.options = result.productTypeDepartments.map((item) => {
        let { name, id, categories } = item;
        let children = [];
        if (categories) {
          children = categories.map((e) => {
            return {
              label: e.name,
              value: e.id,
            };
          });
        }
        return { label: name, value: id, children };
      });
    },
  },
  mounted() {
    // 获取分类列表
    this.getSelectListByCategory();
  },
};
</script>

<style scoped lang="less">
@import url('src/designApplication/components/layout/leftTabs/header.less');
</style>
