<!--收藏图片-->
<template>
  <div>
    <boxList :list="list" v-loading="loading" @onContextmenu="onContextmenu" />
  </div>
</template>

<script>
import pageContainer from './components/page.vue';
import boxList from '@/designApplication/components/boxListImage.vue';
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
        const list = await fetchCollectImageListApi();
        this.$store.commit('designApplication/setCollectImageList', list);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.getList();
    this.$store.commit('designApplication/setInit', { type: 'image_collect' });
  },
};
</script>

<style scoped lang="less"></style>
