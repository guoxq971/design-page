<!--共享图库-->
<template>
  <div>
    <headerContainer ref="header" :params="params" :loading="loading" :getList="getList" />
    <boxList :list="list" v-loading="loading" @onContextmenu="onContextmenu" />
    <pageContainer :get-list="getList" :param="params" :total="total" />
  </div>
</template>

<script>
import headerContainer from './components/header.vue';
import pageContainer from '@/designApplication/components/page.vue';
import boxList from '@/designApplication/components/boxListImage.vue';
import { getImageListApi } from '@/designApplication/apis/image';
import { ShareImageListParams } from '@/designApplication/interface/image/imageListParams';

export default {
  components: {
    headerContainer,
    pageContainer,
    boxList,
  },
  props: {
    parentLoading: { type: Boolean, default: false },
    share: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      loading: false,
      total: 0,
      params: new ShareImageListParams(),
      list: [],
    };
  },
  watch: {
    parentLoading(val) {
      if (!val) {
        this.params.typeId = this.share.value;
        // this.getList();
      }
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
    async getList(isFirst = false) {
      try {
        this.loading = true;
        if (isFirst) {
          this.params.pageNum = 1;
        }

        const params = { ...this.params };

        params.gxtype1 = this.$refs.header?.shareValue[0] || '';
        params.gxtype2 = this.$refs.header?.shareValue[1] || '';

        // 分页处理
        params.offset = (params.pageNum - 1) * params.pageSize;
        params.limit = params.pageSize;

        const { list, total } = await getImageListApi(params);

        this.list = list;
        this.total = total;
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less"></style>
