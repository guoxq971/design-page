<!--收藏产品-->
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
import { CollectProdParams } from '@/designApplication/interface/commonProdParams';
import { fetchProdListApi } from '@/designApplication/apis/prod';

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
      params: new CollectProdParams(),
    };
  },
  computed: {
    list() {
      return this.$store.state.designApplication.collectProdList;
    },
  },
  methods: {
    async getList() {
      try {
        this.loading = true;
        const { list, total } = await fetchProdListApi(this.params);
        this.$store.commit('designApplication/setCollectProdList', list);
        this.total = total;
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
