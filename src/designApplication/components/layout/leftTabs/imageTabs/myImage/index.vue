<!--我的图库-->
<template>
  <div>
    <headerContainer :accountList="accountList" :params="params" :loading="loading" :getList="getList" />
    <boxList :list="list" v-loading="loading" @onContextmenu="onContextmenu" />
    <pageContainer :get-list="getList" :param="params" :total="total" />
  </div>
</template>

<script>
import headerContainer from './components/header.vue';
import pageContainer from '@/designApplication/components/page.vue';
import boxList from '@/designApplication/components/boxListImage.vue';
import { getAccountListApi, getImageListApi } from '@/designApplication/apis/image';
import { ImageListParams } from '@/designApplication/interface/image/imageListParams';

export default {
  components: {
    headerContainer,
    pageContainer,
    boxList,
  },
  props: {
    parentLoading: { type: Boolean, default: false },
    exclusive: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      loading: false,
      total: 0,
      params: new ImageListParams(),
      list: [],
      accountList: [],
    };
  },
  watch: {
    parentLoading(val) {
      if (!val) {
        // 获取子账号列表
        this.getAccountList();
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

        // 专享共享类处理
        let typeId = params.typeId;
        let customerId = params.customerId;
        if (params.customerId === this.exclusive.value) {
          typeId = params.customerId;
          customerId = '';
        }
        params.typeId = typeId;
        params.customerId = customerId;

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
    /**
     * 获取子账号列表
     * */
    async getAccountList() {
      let list = await getAccountListApi();
      list = list
        .filter((e) => e.id !== '')
        .map((item) => {
          return {
            label: item.name,
            value: item.seqId,
            right: item.userName,
          };
        });
      list.unshift({ label: this.exclusive.label, value: this.exclusive.value, right: '' });
      list.unshift({ label: '请选择图片来源', value: '', right: '' });
      this.accountList = list;
    },
  },
  async mounted() {
    // this.getList();
  },
};
</script>

<style scoped lang="less"></style>
