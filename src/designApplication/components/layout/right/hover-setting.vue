<template>
  <el-dropdown>
    <el-button @click="onBlur" v-title="'设置'">
      <iconpark-icon name="config" size="20" />
      <div class="right-bottom-corner">
        <div class="interior" />
      </div>
    </el-button>

    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item @click.native="onKeyCode">快捷键</el-dropdown-item>
      <el-dropdown-item @click.native="onOther">其他设置</el-dropdown-item>
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
     * 其他设置
     */
    onOther() {},
    /**
     * 快捷键
     */
    onKeyCode() {},
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
