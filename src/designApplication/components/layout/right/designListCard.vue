<!--设计图列表-->
<template>
  <el-collapse-transition>
    <el-card v-show="visible_layer" class="one-handle" shadow="never" v-if="imageList.length">
      <div class="design-group">
        <div class="design-wrap" v-for="(item, index) in imageList" :class="{ active: item.attrs.uuid === activeView.activeImageUuid }">
          <div class="wrap">
            <!--设计图-->
            <div v-if="item.attrs.name === canvasDefine.image" class="design-bd" @click="onSetActiveImage(item)">
              <div class="design">
                <el-image :src="item.attrs.fillPatternImage.src" style="width: 100%; height: 100%" />
              </div>
              <div class="title">{{ item.attrs.detail.name }}</div>
            </div>

            <!--背景色-->
            <template v-if="item.attrs.name === canvasDefine.bgc">
              <div class="design">
                <div style="width: 100%; height: 100%" :style="{ backgroundColor: item.attrs.fill }" />
              </div>
              <div class="title">{{ item.attrs.fill }}</div>
            </template>

            <!--文字-->
            <div v-if="item.attrs.name === canvasDefine.text" class="design-bd" @click="onSetActiveImage(item)">
              <div class="design">
                <svg style="font-size: 20px" viewBox="64 64 896 896" data-icon="font-size" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class="">
                  <path
                    d="M920 416H616c-4.4 0-8 3.6-8 8v112c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-56h60v320h-46c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h164c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8h-46V480h60v56c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V424c0-4.4-3.6-8-8-8zM656 296V168c0-4.4-3.6-8-8-8H104c-4.4 0-8 3.6-8 8v128c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-64h168v560h-92c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h264c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8h-92V232h168v64c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8z"
                  ></path>
                </svg>
              </div>
              <div class="title">{{ item.attrs.text }}</div>
            </div>
          </div>

          <div class="handle">
            <!--设计图-->
            <template v-if="item.attrs.type === canvasDefine.image">
              <!--图层-编辑-->
              <div class="layer-btn" v-title="'图层-编辑'">
                <iconpark-icon name="write" size="20" />
              </div>
              <!--图层-收藏-->
              <div class="layer-btn" v-title="'图层-收藏'" @click="onImageCollect(item)">
                <iconpark-icon name="rss" size="20" :style="{ color: DesignImageUtil.hasCollect(item) ? '#4087ff' : '' }" />
              </div>
            </template>

            <!--设计图,文字-->
            <template v-if="[canvasDefine.image, canvasDefine.text].includes(item.attrs.name)">
              <!--图层-上移-->
              <div class="layer-btn" v-title="'图层-上移'" @click="onLayerUp(item)">
                <img src="../img/图层上移.png" />
              </div>
              <!--图层-下移-->
              <div class="layer-btn" v-title="'图层-下移'" @click="onLayerDown(item)">
                <img src="../img/图层下移.png" />
              </div>
            </template>

            <!--图层-删除-->
            <div class="layer-btn" v-title="'图层-删除'" @click="onLayerDel(item)">
              <img src="../img/删除图层.png" />
            </div>
            <!--图层-显示隐藏-->
            <div class="layer-btn" v-title="'图层显示隐藏'" @click="onLayerVisible(item)">
              <template v-if="item.attrs.visible">
                <iconpark-icon name="preview-open" size="20" />
              </template>
              <template v-else>
                <iconpark-icon name="preview-close" size="20" />
              </template>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </el-collapse-transition>
</template>

<script>
import { mapState } from 'vuex';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';
import title from '@/designApplication/core/utils/directives/title/title';

import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';
import { collectImageFn } from '@/designApplication/core/utils/common';

export default {
  name: 'designListCard',
  directives: { title },
  data() {
    return {
      canvasDefine,
      DesignImageUtil,
    };
  },
  computed: {
    ...mapState({
      visible_layer: (state) => state.designApplication.visible_layer,
      activeViewId: (state) => state.designApplication.activeViewId,
    }),
    activeView() {
      return DesignerUtil.getView(this.activeViewId);
    },
    /**
     * 设计图列表
     * */
    imageList() {
      return this.activeView?.canvas?.getImageList() || [];
    },
  },
  methods: {
    /**
     * 设计图操作 - 收藏
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    async onImageCollect(image) {
      const detail = image.attrs.detail;
      await collectImageFn(detail);
    },
    /**
     * 设置设计图 - 激活
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    onSetActiveImage(image) {
      DesignImageUtil.setActiveImage(image);
    },
    /**
     * 设计图操作 - 上移动
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    onLayerUp(image) {
      if ([canvasDefine.image, canvasDefine.text].includes(image.attrs.name)) {
        DesignImageUtil.layerMoveUp(image);
      }
    },
    /**
     * 设计图操作 - 下移动
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    onLayerDown(image) {
      if ([canvasDefine.image, canvasDefine.text].includes(image.attrs.name)) {
        DesignImageUtil.layerMoveDown(image);
      }
    },
    /**
     * 设计图操作 - 移除
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    onLayerDel(image) {
      if ([canvasDefine.image, canvasDefine.text].includes(image.attrs.name)) {
        DesignImageUtil.deleteImage(image);
      }

      if (image.attrs.name === canvasDefine.bgc) {
        //
      }
    },
    /**
     * 设计图操作 - 显示|隐藏
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    onLayerVisible(image) {
      if ([canvasDefine.image, canvasDefine.text].includes(image.attrs.name)) {
        DesignImageUtil.setImageVisible(image);
      }
    },
  },
};
</script>

<style scoped lang="less">
@import url('./commonStyle');
</style>
