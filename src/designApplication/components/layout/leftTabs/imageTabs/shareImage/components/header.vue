<!--共享图库-头部搜索-->
<template>
  <div class="header-container">
    <div class="header-top">
      <el-input class="ipt-wrap" placeholder="请输入图片标题/编号" v-model="params.query" @keyup.enter.native="getList(true)">
        <el-button slot="append" icon="el-icon-search" :loading="loading" @click="getList(true)" />
      </el-input>

      <!--筛选-->
      <el-popover placement="bottom" width="550" trigger="click">
        <filterPop :param="params" :get-list="getList" />
        <el-button class="sx-btn" slot="reference" style="height: 100%">
          <span>筛选</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
      </el-popover>

      <!--分类-->
      <el-cascader
        style="width: 90px"
        ref="cascaderShare"
        filterable
        clearable
        popper-class="pc-sel-area-cascader"
        :props="share"
        placeholder="分类"
        v-model="shareValue"
        @change="(e) => share_change(e)"
      />
    </div>
  </div>
</template>

<script>
import filterPop from './filterPop.vue';
import { getImageCategoryByShareApi, getImageCategoryByShareOfTwoApi } from '@/designApplication/apis/image';
export default {
  components: {
    filterPop,
  },
  props: {
    /**
     * 请求参数
     * @class {ShareImageListParams}
     * */
    params: Object,
    loading: Boolean,
    getList: Function,
  },
  data() {
    return {
      shareValue: [],
      share: {
        lazy: true,
        lazyLoad: this.getSelectList,
        checkStrictly: true,
      },
    };
  },
  methods: {
    /*
     * 分类-change
     * */
    async share_change(e) {
      // change事件调用二级分类接口
      const store = this.$refs.cascaderShare.$refs.panel.store;
      let i = store.nodes.findIndex((node) => node.value == e[0]);
      let d = store.nodes[i];
      let el = this.$refs.cascaderShare.$refs.panel.$refs.menu[d.level - 1].$el;
      el.querySelectorAll('.el-cascader-node__label')[i].click();

      // 分页
      this.getList(true);
    },
    /**
     * 获取分类的下拉列表
     * */
    async getSelectList(node, resolve) {
      const { level } = node;
      // 一级
      if (level === 0) {
        let list = await getImageCategoryByShareApi();
        let tempList = [];
        tempList = list.map((item) => {
          return {
            label: item.name,
            value: item.seqId,
            leaf: false,
          };
        });
        tempList.unshift({ label: '分类', value: '', leaf: true });
        resolve(tempList);
      }
      // 二级
      else if (level === 1) {
        let list = await getImageCategoryByShareOfTwoApi(node.value);
        let tempList = list.map((item) => {
          return {
            label: item.name,
            value: item.seqId,
            leaf: true,
          };
        });
        resolve(tempList);
      } else {
        resolve([]);
      }
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">
@import url('src/designApplication/components/layout/leftTabs/header.less');

.header-container {
  display: flex;
  flex-direction: column;
  margin: 0 4px 4px 4px;
  .header-top {
    display: flex;
    margin-bottom: 5px;
  }

  .sx-btn {
    margin: 0 5px;
  }
  .el-button + .el-button {
    margin-left: 0;
  }
}
</style>
