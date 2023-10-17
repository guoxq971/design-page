<!--收藏背景-->
<template>
  <div>
    <boxList :list="list" v-loading="loading" />
  </div>
</template>

<script>
import boxList from './components/boxList.vue';
import { fetchBackgroundCollectListApi } from '@/designApplication/apis/background';

export default {
  components: {
    boxList,
  },
  data() {
    return {
      loading: false,
      list: [],
    };
  },
  methods: {
    /**
     * 获取设计图列表
     * */
    async getList() {
      try {
        this.loading = true;
        this.list = await fetchBackgroundCollectListApi();
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
