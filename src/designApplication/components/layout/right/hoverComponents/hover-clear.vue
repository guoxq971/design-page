<template>
  <el-dropdown>
    <el-button style="width: 100%; height: 100%" @click="onClearAll" v-title="'清空设计'">
      <iconpark-icon name="clear" size="20" />
      <div class="right-bottom-corner">
        <div class="interior" />
      </div>
    </el-button>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="onClearCur">当前设计面</el-dropdown-item>
      <el-dropdown-item @click.native="onClearAll">全部设计面</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { buttonBlur } from '@/designApplication/core/utils/buttonBlur';
import title from '@/designApplication/core/utils/directives/title/title';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

export default {
  name: 'hover-setting',
  directives: { title },
  methods: {
    /**
     * 清空设计 - 全部
     */
    async onClearAll(evt) {
      evt && this.onBlur(evt);
      await this.$confirm('是否确认清空设计？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      const prod = DesignerUtil.getActiveProd();
      prod.viewList.forEach((view) => {
        view.canvas.clear();
      });
    },
    /**
     * 清空设计 - 当前
     */
    async onClearCur() {
      await this.$confirm('是否确认清空设计？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      const view = DesignerUtil.getView();
      view.canvas.clear();
    },
    /**
     * 失焦
     */
    onBlur(evt) {
      buttonBlur(evt);
    },
  },
};
</script>

<style scoped lang="less">
@import url('../commonStyle');
</style>
