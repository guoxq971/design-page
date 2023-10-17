<template>
  <el-tabs class="tabs" v-model="active">
    <el-tab-pane label="我的图库" name="my">
      <myImage :parentLoading="loading" :exclusive="exclusive" />
    </el-tab-pane>
    <el-tab-pane label="小组图库"></el-tab-pane>
    <el-tab-pane label="共享图库" name="share">
      <shareImage :parentLoading="loading" :share="share" />
    </el-tab-pane>
    <el-tab-pane label="管理图库"></el-tab-pane>
    <el-tab-pane label="收藏图库"></el-tab-pane>
  </el-tabs>
</template>

<script>
import myImage from './myImage';
import shareImage from './shareImage';
import { getImageCategoryApi } from '@/designApplication/apis/image';
export default {
  components: {
    myImage,
    shareImage,
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
