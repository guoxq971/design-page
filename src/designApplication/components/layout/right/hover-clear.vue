<template>
  <el-dropdown>
    <el-button style="width: 100%; height: 100%" @click="onBlur" v-title="'清空设计'">
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
import title from '@/designApplication/core/utils/title';

export default {
  name: 'hover-setting',
  directives: { title },
  methods: {
    /**
     * 清空设计 - 全部
     */
    onClearAll() {},
    /**
     * 清空设计 - 当前
     */
    onClearCur() {},
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
@import url('./commonStyle');
</style>
