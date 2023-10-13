<!--通用产品-->
<template>
  <div>
    <headerContainer :getList="getList" />
    <boxList :list="list" />
    <pageContainer :get-list="getList" :param="param" :total="total" />
  </div>
</template>

<script>
import headerContainer from './components/header.vue';
import pageContainer from './components/page.vue';
import boxList from './components/boxList.vue';
import { parseCommonProd } from '@/designApp/dispose/prod/commonProd';
export default {
  components: {
    headerContainer,
    pageContainer,
    boxList,
  },
  data() {
    return {
      total: 0,
      param: {
        pageNo: 1,
        pageSize: 24,
      },
      list: [],
    };
  },
  methods: {
    getList() {},
  },
  async mounted() {
    const num = 7;
    this.list = await parseCommonProd();
    this.$set(this.list[num], 'isActive', true);
    this.$store.dispatch('designApp/setProd', this.list[num]);
  },
};
</script>

<style scoped lang="less"></style>
