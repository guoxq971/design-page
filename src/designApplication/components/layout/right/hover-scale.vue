<template>
  <el-popover placement="bottom" width="200" trigger="hover">
    <div class="hover-wrap">
      <img v-title="'宽度最大化'" src="../img/宽度最大化.png" class="img" />
      <img v-title="'高度最大化'" src="../img/高度最大化.png" class="img" />
      <img v-title="'最大化'" src="../img/最大化.png" class="img" />
    </div>

    <div v-title="'最大化'" slot="reference">
      <img src="../img/最大化.png" style="width: 100%; height: 100%" />
      <div class="right-bottom-corner">
        <div class="interior" />
      </div>
    </div>
  </el-popover>
</template>

<script>
import { buttonBlur } from '@/designApplication/core/utils/buttonBlur';
import title from '@/designApplication/core/utils/title';

export default {
  name: 'hover-setting',
  directives: { title },
  methods: {
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
