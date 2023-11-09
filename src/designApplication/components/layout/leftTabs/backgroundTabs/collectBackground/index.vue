<!--收藏背景-->
<template>
  <div>
    <boxList :list="list" v-loading="loading" />
  </div>
</template>

<script>
import boxList from '@/designApplication/components/boxListImage.vue';
import { fetchBackgroundCollectListApi } from '@/designApplication/apis/background';

export default {
  components: {
    boxList,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    list() {
      return this.$store.state.designApplication.collectBgImageList;
    },
  },
  methods: {
    /**
     * 获取设计图列表
     * */
    async getList() {
      try {
        this.loading = true;
        const list = await fetchBackgroundCollectListApi();
        for (const item of list) {
          item.previewImg = item.designImg;
        }
        this.$store.commit('designApplication/setCollectBgImageList', list);
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
