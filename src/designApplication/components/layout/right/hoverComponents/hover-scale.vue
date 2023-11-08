<template>
  <el-popover placement="bottom" width="200" trigger="hover">
    <div class="hover-wrap">
      <img v-title="'宽度最大化'" src="../../img/宽度最大化.png" class="img" @click="onImageMaxWidth" />
      <img v-title="'高度最大化'" src="../../img/高度最大化.png" class="img" @click="onImageMaxHeight" />
      <img v-title="'最大化'" src="../../img/最大化.png" class="img" @click="onImageMax" />
    </div>

    <div v-title="'最大化'" slot="reference" @click="onImageMax">
      <img src="../../img/最大化.png" style="width: 100%; height: 100%" />
      <div class="right-bottom-corner">
        <div class="interior" />
      </div>
    </div>
  </el-popover>
</template>

<script>
import { buttonBlur } from '@/designApplication/core/utils/buttonBlur';
import title from '@/designApplication/core/utils/directives/title/title';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';

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
    /**
     * 设计图操作 - 最大化
     */
    async onImageMax() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.scaleMax(image);
      DesignImageUtil.positionHorizontalCenter(image);
      DesignImageUtil.positionVerticalCenter(image);
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
    /**
     * 设计图操作 - 宽度最大化
     */
    async onImageMaxWidth() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.scaleMaxWidth(image);
      DesignImageUtil.positionHorizontalCenter(image);
      DesignImageUtil.positionVerticalCenter(image);
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
    /**
     * 设计图操作 - 高度度最大化
     */
    async onImageMaxHeight() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.scaleMaxHeight(image);
      DesignImageUtil.positionHorizontalCenter(image);
      DesignImageUtil.positionVerticalCenter(image);
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
  },
};
</script>

<style scoped lang="less">
@import url('../commonStyle');
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
