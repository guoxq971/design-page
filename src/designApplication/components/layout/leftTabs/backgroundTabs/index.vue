<template>
  <div>
    <el-tabs class="tabs" v-model="active">
      <el-tab-pane label="背景图" name="image">
        <imageBackground @onContextmenu="onContextmenu" />
      </el-tab-pane>
      <el-tab-pane label="背景色" name="color">
        <colorBackground />
      </el-tab-pane>
      <el-tab-pane label="收藏背景" name="collect">
        <span slot="label" v-title="'对背景图鼠标右键可【收藏】/【取消收藏】背景'">收藏背景</span>
        <collectBackground @onContextmenu="onContextmenu" />
      </el-tab-pane>
    </el-tabs>

    <!--右键菜单-->
    <contextMenu ref="Contextmenu" :itemList="menuItemList" :visible.sync="menuVisible" />
  </div>
</template>

<script>
import imageBackground from './imageBackground';
import collectBackground from './collectBackground';
import colorBackground from './colorBackground';
import title from '@/designApplication/core/utils/directives/title/title';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { collectImageFn } from '@/designApplication/core/utils/common';
import contextMenu from '@/designApplication/components/contextmen.vue';
export default {
  directives: { title },
  components: {
    contextMenu,
    imageBackground,
    collectBackground,
    colorBackground,
  },
  data() {
    return {
      active: 'image',
      // 右键菜单是否展示
      menuVisible: false,
      // 右键菜单
      menuItemList: [{ key: '1', icon: 'el-icon-caret-left', text: '', fn: null }],
    };
  },
  methods: {
    /**
     * 右键菜单
     * @param {import('@/design').ImageListItem} data
     */
    onContextmenu(data) {
      // 注册收藏产品的事件
      const item = this.menuItemList[0];
      item.text = DesignerUtil.hasCollectImage(data) ? '取消收藏设计图' : '收藏设计图';
      item.fn = async () => {
        await collectImageFn(data);
      };

      // 打开弹窗
      this.menuVisible = true;
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">
/deep/ .el-tabs__header {
  margin-bottom: 10px !important;
}
</style>
