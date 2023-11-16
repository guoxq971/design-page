<!--收藏背景-->
<template>
  <div>
    <boxList :list="list" v-loading="loading" @onContextmenu="onContextmenu" />
  </div>
</template>

<script>
import boxList from '@/designApplication/components/boxListImage.vue';
import { fetchBackgroundCollectListApi } from '@/designApplication/apis/background';
import headerContainer from '@/designApplication/components/layout/leftTabs/imageTabs/groupImage/components/header.vue';

export default {
  components: {
    headerContainer,
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
     * 右键菜单
     * @param {import('@/design').ImageListItem} data
     */
    onContextmenu(data) {
      this.$emit('onContextmenu', data);
    },
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
