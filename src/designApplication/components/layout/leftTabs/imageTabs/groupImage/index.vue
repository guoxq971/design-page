<!--小组图库-->
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
import { fetchGroupImageListApi } from '@/designApplication/apis/image';
import { GroupImageListParams } from '@/designApplication/interface/image/imageListParams';

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
      params: new GroupImageListParams(),
      list: [],
    };
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

        let seqId = '';
        if (this.$refs.header?.propsValue[0]) {
          seqId = this.$refs.header?.propsValue[0];
        }

        if (this.$refs.header?.propsValue[1]) {
          seqId = this.$refs.header?.propsValue[1];
        }
        params.seqId = seqId;

        // 分页处理
        params.offset = (params.pageNum - 1) * params.pageSize;
        params.limit = params.pageSize;

        const { list, total } = await fetchGroupImageListApi(params);

        this.list = list;
        this.total = total;
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    // this.getList();
  },
};
</script>

<style scoped lang="less"></style>
