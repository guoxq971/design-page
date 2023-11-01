<template>
  <div>
    <el-tabs v-model="active">
      <el-tab-pane label="我的图库" name="my">
        <myImage @onContextmenu="onContextmenu" :parentLoading="loading" :exclusive="exclusive" />
      </el-tab-pane>
      <el-tab-pane label="小组图库" name="group">
        <groupImage @onContextmenu="onContextmenu" />
      </el-tab-pane>
      <el-tab-pane label="共享图库" name="share">
        <shareImage @onContextmenu="onContextmenu" :parentLoading="loading" :share="share" />
      </el-tab-pane>
      <el-tab-pane label="管理图库" name="admin">
        <adminImage @onContextmenu="onContextmenu" />
      </el-tab-pane>
      <el-tab-pane label="收藏图片" name="collect">
        <span slot="label" v-title="'对设计图鼠标右键可【收藏】/【取消收藏】设计图'">收藏图片</span>
        <collectImage @onContextmenu="onContextmenu" />
      </el-tab-pane>
    </el-tabs>

    <!--右键菜单-->
    <contextMenu ref="Contextmenu" :itemList="menuItemList" :visible.sync="menuVisible" />
  </div>
</template>

<script>
import myImage from './myImage';
import shareImage from './shareImage';
import adminImage from './adminImage';
import collectImage from './collectImage';
import groupImage from './groupImage';
import { getImageCategoryApi } from '@/designApplication/apis/image';
import title from '@/designApplication/core/utils/title';
import contextMenu from '@/designApplication/components/contextmen.vue';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { collectImageFn } from '@/designApplication/core/utils/common';
export default {
  directives: { title },
  components: {
    contextMenu,
    myImage,
    shareImage,
    adminImage,
    collectImage,
    groupImage,
  },
  data() {
    return {
      active: 'my',
      loading: false,
      exclusive: {
        label: '专属共享图片',
        value: '',
      },
      share: {
        label: '共享类',
        value: '',
      },
      // 右键菜单是否展示
      menuVisible: false,
      // 右键菜单
      menuItemList: [{ key: '1', icon: 'el-icon-caret-left', text: '', fn: null }],
    };
  },
  methods: {
    /**
     * 获取图案分类
     * */
    async getImageCategory() {
      try {
        this.loading = true;
        let list = await getImageCategoryApi();
        list = list[2].designCategories;
        const newList = [];
        const fn = (obj, children = newList) => {
          obj.label = obj.name;
          obj.value = obj.id;
          children.push(obj);
          if (obj.designCategories) {
            obj.children = obj.designCategories;
            obj.children.forEach((item) => {
              fn(item, obj.children);
            });
          } else {
            obj.children = [];
          }
        };
        list.forEach((item) => fn(item));

        this.exclusive.value = newList.find((e) => e.label === this.exclusive.label)?.value;
        this.share.value = newList.find((e) => e.label === this.share.label)?.value;
      } finally {
        this.loading = false;
      }
    },
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
  mounted() {
    // 获取图案分类
    this.getImageCategory();
  },
};
</script>

<style scoped lang="less">
/deep/ .el-tabs__header {
  margin-bottom: 10px !important;
}
</style>
