<!--收藏图片-->
<template>
  <div>
    <boxList :list="list" v-loading="loading" />
  </div>
</template>

<script>
import pageContainer from './components/page.vue';
import boxList from './components/boxList.vue';
import { fetchCollectImageListApi } from '@/designApplication/apis/image';

export default {
  components: {
    pageContainer,
    boxList,
  },
  data() {
    return {
      loading: false,
      total: 0,
    };
  },
  computed: {
    list() {
      return this.$store.state.designApplication.collectImageList;
    },
  },
  methods: {
    /**
     * 获取设计图列表
     * */
    async getList() {
      try {
        this.loading = true;
        const list = await fetchCollectImageListApi();
        this.$store.commit('designApplication/setCollectImageList', list);
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
