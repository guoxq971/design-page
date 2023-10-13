<!--通用产品-->
<template>
  <div>
    <headerContainer :params="params" :loading="loading" :getList="getList" />
    <boxList :list="list" v-loading="loading" />
    <pageContainer :get-list="getList" :param="params" :total="total" />
  </div>
</template>

<script>
import headerContainer from './components/header.vue';
import pageContainer from './components/page.vue';
import boxList from './components/boxList.vue';
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

        this.$set(this.list[0], 'isActive', true);
        await this.$store.dispatch('designApplication/setProd', this.list[0]);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped lang="less"></style>
