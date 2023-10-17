<!--背景图-->
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
import { getImageListApi } from '@/designApplication/apis/image';
import { ImageListParams } from '@/designApplication/interface/image/imageListParams';
import { fetchBackgroundImageListApi } from '@/designApplication/apis/background';
import { BackgroundImageParams } from '@/designApplication/interface/background/background';

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
      params: new BackgroundImageParams(),
      list: [],
    };
  },
  methods: {
    /**
     * 获取设计图列表
     * */
    async getList(isFirst = false) {
      try {
        this.loading = true;
        if (isFirst) {
          this.params.pageNum = 1;
        }

        const params = { ...this.params };

        // 分页处理
        params.offset = (params.pageNum - 1) * params.pageSize;
        params.limit = params.pageSize;

        const { list, total } = await fetchBackgroundImageListApi(params);

        this.list = list;
        this.total = total;
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
