<template>
  <div>
    <el-tabs v-model="active">
      <el-tab-pane label="通用产品" name="common">
        <prodCommon @onContextmenu="onContextmenu" />
      </el-tab-pane>
      <el-tab-pane label="FBA专用产品" name="fba">
        <prodFba @onContextmenu="onContextmenu" />
      </el-tab-pane>
      <el-tab-pane label="收藏产品" name="collect">
        <span slot="label" v-title="'对产品鼠标右键可【收藏】/【取消收藏】产品'">收藏产品</span>
        <prodCollect @onContextmenu="onContextmenu" />
      </el-tab-pane>
    </el-tabs>

    <!--右键菜单-->
    <contextMenu ref="Contextmenu" :itemList="menuItemList" :visible.sync="menuVisible" />
  </div>
</template>

<script>
import prodCommon from './prodCommon';
import prodFba from './prodFba';
import prodCollect from './prodCollect';
import title from '@/designApplication/core/utils/directives/title/title';
import contextMenu from '@/designApplication/components/contextmen.vue';
import { fetchProdListApi, setCollectProdApi, setDelCollectProdApi } from '@/designApplication/apis/prod';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { CollectProdParams } from '@/designApplication/interface/commonProdParams';

export default {
  directives: { title },
  components: {
    prodCommon,
    prodFba,
    prodCollect,
    contextMenu,
  },
  data() {
    return {
      active: 'common',
      // 右键菜单是否展示
      menuVisible: false,
      // 右键菜单
      menuItemList: [{ key: '1', icon: 'el-icon-caret-left', text: '', fn: null }],
    };
  },
  methods: {
    /**
     * 右键菜单
     * @param {import('@/design').ProdListDataItem} data
     */
    onContextmenu(data) {
      // 注册收藏产品的事件
      const item = this.menuItemList[0];
      item.text = DesignerUtil.hasCollectProd(data) ? '取消收藏产品' : '收藏产品';
      item.fn = async () => {
        const result = DesignerUtil.hasCollectProd(data);
        if (result) {
          await this.$confirm('确定取消收藏该产品吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          });
          // 取消收藏产品
          await setDelCollectProdApi(data?.collectId);
        } else {
          // 收藏产品
          await setCollectProdApi(data.seqId);
        }

        this.$message.success('操作成功');

        // 重新获取收藏产品列表
        const { list, total } = await fetchProdListApi(new CollectProdParams());
        this.$store.commit('designApplication/setCollectProdList', list);
      };

      // 打开弹窗
      this.menuVisible = true;
    },
  },
};
</script>

<style scoped lang="less">
/deep/ .el-tabs__header {
  margin-bottom: 10px !important;
}
</style>
