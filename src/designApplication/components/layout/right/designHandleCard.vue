<!--设计图操作-->
<template>
  <el-card class="one-handle handle2" shadow="never">
    <!--图层置顶-->
    <img src="../img/图层置顶.png" class="right-design-img" v-title="'图层置顶'" @click="onImageTop" />
    <!--图层置底-->
    <img src="../img/图层置底.png" class="right-design-img" v-title="'图层置底'" @click="onImageBottom" />
    <!--图层上移-->
    <img src="../img/图层上移.png" class="right-design-img" v-title="'图层上移'" @click="onImageUp" />
    <!--图层下移-->
    <img src="../img/图层下移.png" class="right-design-img" v-title="'图层下移'" @click="onImageDown" />
    <!--复制图层-->
    <img src="../img/复制图层.png" class="right-design-img" v-title="'复制图层'" @click="onImageCopy" />
    <!--删除图层-->
    <img src="../img/删除图层.png" class="right-design-img" v-title="'删除图层'" @click="onImageDelete" />
    <!--水平居中-->
    <img src="../img/水平居中.png" class="right-design-img" v-title="'水平居中'" @click="onImagePositionHorizontal" />
    <!--垂直居中-->
    <img src="../img/垂直居中.png" class="right-design-img" v-title="'垂直居中'" @click="onImagePositionVertical" />
    <!--水平翻转-->
    <img src="../img/水平翻转.png" class="right-design-img" v-title="'水平翻转'" @click="onFlipX()" />
    <!--垂直翻转-->
    <img src="../img/垂直翻转.png" class="right-design-img" v-title="'垂直翻转'" @click="onFlipY()" />
    <!--放大-->
    <img src="../img/放大.png" class="right-design-img" v-title="'放大'" @click="onImageScaleUp" />
    <!--缩小-->
    <img src="../img/缩小.png" class="right-design-img" v-title="'缩小'" @click="onImageScaleDown" />
    <!--左旋45-->
    <img src="../img/左旋45°.png" class="right-design-img" v-title="'左旋45'" @click="onImageRotateDown" />
    <!--右旋45-->
    <img src="../img/右旋45°.png" class="right-design-img" v-title="'右旋45'" @click="onImageRotateUp" />
    <!--最大化-->
    <hoverScale class="right-design-img" />
    <!--平铺-->
    <hoverTile class="right-design-img" />
    <!--位置-->
    <div class="right-design-img" v-title="'位置'" :class="{ 'hover-color': visible_position }" @click="onPosition">
      <span class="el-icon-aim" style="font-size: 27px" />
    </div>

    <!--位置和变换-->
    <positionPop v-if="visible_position" />
  </el-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import title from '@/designApplication/core/utils/directives/title/title';

import hoverScale from '@/designApplication/components/layout/right/hoverComponents/hover-scale.vue';
import positionPop from './positionPop.vue';
import hoverTile from '@/designApplication/components/layout/right/hoverComponents/hover-tile.vue';

import { getAngleMultiple, setProxyTransformer } from '@/designApplication/core/canvas_2/konvaCanvasAddHelp';
import { uuid } from '@/designApplication/core/utils/uuid';

import { canvasDefine } from '@/designApplication/core/canvas_2/define';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

export default {
  name: 'designHandleCard',
  directives: { title },
  components: { hoverTile, hoverScale, positionPop },
  computed: {
    ...mapState({
      visible_position: (state) => state.designApplication.visible_position,
      visible_layer: (state) => state.designApplication.visible_layer,
      visible_history: (state) => state.designApplication.visible_history,
      visible_collect: (state) => state.designApplication.visible_collect,
      loadingSave: (state) => state.designApplication.loading_save,
      activeViewId: (state) => state.designApplication.activeViewId,
      activeColorId: (state) => state.designApplication.activeColorId,
      collectImageList: (state) => state.designApplication.collectImageList,
    }),
    ...mapGetters({
      activeProdStatic: 'designApplication/activeProdStatic',
    }),
    activeView() {
      return DesignerUtil.getView(this.activeViewId);
    },
  },
  methods: {
    /**
     * 位置和变换
     */
    onPosition() {
      this.$store.commit('designApplication/setVisiblePosition', !this.visible_position);
    },
    /**
     * 设计图操作 - 复制
     */
    async onImageCopy() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      if ([canvasDefine.image, canvasDefine.text].includes(image.attrs.type)) {
        const konvaCanvas = image.attrs.konvaCanvas;
        const copyImage = image.clone();
        const copyTransformer = image.attrs.transformer.clone();

        // 选中框
        copyTransformer.setAttr('visible', false);
        setProxyTransformer(copyTransformer, copyImage);
        copyTransformer.nodes([copyImage]);

        // 设计图
        copyImage.setAttrs({
          uuid: uuid(),
          x: image.attrs.x + 10,
          y: image.attrs.y + 10,
          transformer: copyTransformer,
        });

        konvaCanvas.clip.add(copyImage);
        konvaCanvas.layer.add(copyTransformer);

        await this.$nextTick();
        // 碰撞检测
        DesignImageUtil.isCollide(copyImage);
      }
    },
    /**
     * 设计图操作 - 左旋转
     */
    async onImageRotateDown() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.rotation(image, getAngleMultiple(image.rotation(), 'left'));

      await this.$nextTick();
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
    /**
     * 设计图操作 - 右旋转
     */
    async onImageRotateUp() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.rotation(image, getAngleMultiple(image.rotation(), 'right'));

      await this.$nextTick();
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
    /**
     * 设计图操作 - x轴翻转
     */
    async onFlipX() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.flipX(image);
    },
    /**
     * 设计图操作 - y轴翻转
     */
    async onFlipY() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.flipY(image);
    },
    /**
     * 设计图操作 - 缩放 放大
     */
    async onImageScaleUp() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.scaleUp(image);

      await this.$nextTick();
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
    /**
     * 设计图操作 - 缩放 缩小
     */
    async onImageScaleDown() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.scaleDown(image);

      await this.$nextTick();
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
    /**
     * 设计图操作 - 水平居中
     */
    async onImagePositionHorizontal() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.positionHorizontalCenter(image);

      await this.$nextTick();
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
    /**
     * 设计图操作 - 垂直居中
     */
    async onImagePositionVertical() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.positionVerticalCenter(image);

      await this.$nextTick();
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
    /**
     * 设计图操作 - 移除
     */
    async onImageDelete() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.deleteImage(image);
    },
    /**
     * 设计图操作 - 上移动
     */
    async onImageUp() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.layerMoveUp(image);
    },
    /**
     * 设计图操作 - 下移动
     */
    async onImageDown() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.layerMoveDown(image);
    },
    /**
     * 设计图操作 - 置底
     */
    async onImageBottom() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.layerMoveBottom(image);
    },
    /**
     * 设计图操作 - 置顶
     */
    async onImageTop() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.layerMoveTop(image);
    },
  },
};
</script>

<style scoped lang="less">
@import url('./commonStyle');
.handle2 {
  /deep/ .el-card__body {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
