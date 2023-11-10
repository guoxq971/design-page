<!--管理图库-->
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
import { fetchAdminImageListApi } from '@/designApplication/apis/image';
import { AdminImageListParams } from '@/designApplication/interface/image/imageListParams';

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
      params: new AdminImageListParams(),
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

        // adminType 处理
        let adminType = '';
        if (this.$refs.header?.propsValue.length === 0) adminType = '';
        else if (this.$refs.header?.propsValue.length === 1) adminType = this.$refs.header.propsValue[0];
        else if (this.$refs.header?.propsValue.length === 2) adminType = this.$refs.header.propsValue[1];
        params.adminType = adminType;

        // 分页 处理
        params.offset = (params.pageNum - 1) * params.pageSize;
        params.limit = params.pageSize;

        const { list, total } = await fetchAdminImageListApi(params);
        list.forEach((image) => (image.isAdminOrg = true));

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
