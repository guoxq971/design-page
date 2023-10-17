<!--小组图库-头部搜索-->
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
        ref="cascader"
        filterable
        clearable
        popper-class="pc-sel-area-cascader"
        :props="props"
        placeholder="分类"
        v-model="propsValue"
        @change="(e) => category_change(e)"
      />
    </div>
  </div>
</template>

<script>
import filterPop from './filterPop.vue';
import { fetchGroupImageSelectApi } from '@/designApplication/apis/image';

// 搜索指定字符串
const searchStr = (str, key) => {
  let arr = str.split('?')[1].split('&');
  let obj = {};
  arr.forEach((s) => {
    let d = s.split('=');
    obj[d[0]] = d[1];
  });
  return obj[key];
};
export default {
  components: {
    filterPop,
  },
  props: {
    /**
     * 请求参数
     * @class {GroupImageListParams}
     * */
    params: Object,
    loading: Boolean,
    getList: Function,
  },
  data() {
    return {
      selectList: [],
      propsValue: [],
      props: {
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
    async category_change(e) {
      // change事件调用二级分类接口
      const store = this.$refs.cascader.$refs.panel.store;
      let i = store.nodes.findIndex((node) => node.value == e[0]);
      let d = store.nodes[i];
      let el = this.$refs.cascader.$refs.panel.$refs.menu[d.level - 1].$el;
      el.querySelectorAll('.el-cascader-node__label')[i].click();

      // 分页
      this.getList(true);
    },
    /**
     * 获取分类的下拉列表
     * */
    async getSelectList(node, resolve) {
      const { level, data, children } = node;
      // 防止重复请求
      if (children && children.length > 0) return resolve([]);
      // 一级
      if (level === 0) {
        this.params.queryAll = 1;
        let list = await fetchGroupImageSelectApi();
        let tempList = [];
        if (list) {
          tempList = list.map((item) => {
            let seqId = searchStr(item?.url, 'seqId');
            let queryAll = searchStr(item?.url, 'queryAll') || 0;
            return {
              label: item.name,
              value: seqId,
              queryAll: queryAll,
              leaf: seqId === '',
            };
          });
        }
        resolve(tempList);
      }
      // 二级
      else if (level === 1) {
        // 如果是第一级 的请选择|全部分类 就不调用接口
        this.params.queryAll = '';
        let val = this.propsValue[0];
        let d = this.selectList.find((e) => e.value === val);
        let param = {
          seqId: data.value,
          queryAll: data.queryAll,
        };
        if (!d?.queryAll) delete param.queryAll;
        let list = await fetchGroupImageSelectApi(param);
        let tempList = [];
        if (list) {
          tempList = list.map((item) => {
            let seqId = searchStr(item?.url, 'seqId');
            let queryAll = searchStr(item?.url, 'queryAll') || 0;
            return {
              label: item.name,
              value: seqId,
              queryAll: queryAll,
              leaf: true,
            };
          });
        }
        resolve(tempList);
      } else {
        resolve([]);
      }
    },
    /**
     * 获取下拉列表 -  一级
     * */
    async getSelectByOne() {
      let list = await fetchGroupImageSelectApi();
      let tempList = [];
      if (list) {
        tempList = list.map((item) => {
          let seqId = searchStr(item?.url, 'seqId');
          let queryAll = searchStr(item?.url, 'queryAll') || 0;
          return {
            label: item.name,
            value: seqId,
            queryAll: queryAll,
          };
        });
      }
      this.selectList = tempList;
    },
  },
  mounted() {
    this.getSelectByOne();
  },
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
