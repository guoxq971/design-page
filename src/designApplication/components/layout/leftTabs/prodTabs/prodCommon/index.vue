<!--通用产品-->
<template>
  <div>
    <headerContainer :params="params" :loading="loading" :getList="getList" />
    <boxList @onContextmenu="onContextmenu" :list="list" v-loading="loading" />
    <pageContainer num-key="pageNo" :get-list="getList" :param="params" :total="total" />
  </div>
</template>

<script>
import headerContainer from '@/designApplication/components/headerProd.vue';
import pageContainer from '@/designApplication/components/page.vue';
import boxList from '@/designApplication/components/boxListProd.vue';
import { getCommonProdListApi } from '@/designApplication/apis/common';
import { CommonProdParams } from '@/designApplication/interface/commonProdParams';

export default {
  components: {
    headerContainer,
    pageContainer,
    boxList,
  },
  data() {
    return {
      loading: false,
      total: 0,
      params: new CommonProdParams(),
      /**
       * @type {import('@/design').ParseProdItem[]}
       */
      list: [],
    };
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { list, total } = await getCommonProdListApi(this.params);
        this.list = list;
        this.total = total;
        if (this.list.length === 0) return;
        if (!this.$store.getters['designApplication/activeProd']) {
          await this.$store.dispatch('designApplication/setProd', this.list[0]);
        }
      } finally {
        this.loading = false;
      }
    },
    /**
     * 右键菜单
     * @param {import('@/design').ProdListDataItem} data
     */
    onContextmenu(data) {
      this.$emit('onContextmenu', data);
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped lang="less"></style>
