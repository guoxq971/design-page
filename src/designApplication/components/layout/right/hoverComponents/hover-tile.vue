<template>
  <el-popover placement="bottom" width="200" trigger="hover">
    <div class="hover-wrap"></div>

    <div style="width: 100%; height: 100%" v-title="'平铺'" slot="reference">
      <div class="name">平铺</div>
      <div class="right-bottom-corner">
        <div class="interior" />
      </div>
    </div>
  </el-popover>
</template>

<script>
import { buttonBlur } from '@/designApplication/core/utils/buttonBlur';
import title from '@/designApplication/core/utils/directives/title/title';

export default {
  name: 'hover-setting',
  directives: { title },
  methods: {
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
@import url('../commonStyle');
/deep/ .el-popover__reference-wrapper {
  width: 100%;
  height: 100%;
}
.name {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.hover-wrap {
  width: 100%;
  display: flex;
  justify-content: space-around;
  img {
    cursor: pointer;
    width: 50px;
    height: 50px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;

    &:hover {
      border: 1px solid #409eff;
    }
  }
}
</style>
