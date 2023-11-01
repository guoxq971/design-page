<!--右侧区域-->
<template>
  <div>
    <!--操作区域-1-->
    <el-card class="one-handle" shadow="never" style="margin-bottom: 10px">
      <!--描述-->
      <el-button class="btn" @click="onBlur" v-title="'设计说明'" @mouseenter.native="enter()" @mouseleave.native="leave()">
        <iconpark-icon name="info" size="20" />
      </el-button>

      <!--设置-->
      <hoverSetting />

      <!--历史记录-->
      <el-button class="btn" @click="onBlur" v-title="'历史记录'">
        <iconpark-icon name="history" size="20" />
      </el-button>

      <!--全颜色合成-->
      <el-button class="btn btn2 btn5 btn6" type="warning" @click="onBlur" v-title="'全颜色合成'">全颜色合成</el-button>

      <!--保存产品-->
      <el-button class="btn btn2 btn5" type="primary" @click="onBlur" v-title="'保存产品'">保存产品</el-button>
    </el-card>

    <!--操作区域-2-->
    <el-card class="one-handle" shadow="never">
      <!--撤销-->
      <img src="../img/后退.png" class="right-design-img" v-title="'撤销'" />

      <!--前进-->
      <img src="../img/前进.png" class="right-design-img" v-title="'前进'" />

      <!--清空设计-->
      <hoverClear class="btn4" />

      <!--关闭图层-->
      <el-button class="btn4 btn5" @click="onBlur" v-title="'图层'">关闭图层</el-button>

      <!--开启收藏-->
      <el-button class="btn4 btn5" @click="onBlur" v-title="'收藏'">开启收藏</el-button>
    </el-card>

    <!--设计图操作-->
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
      <img src="../img/水平翻转.png" class="right-design-img" v-title="'水平翻转'" />
      <!--垂直翻转-->
      <img src="../img/垂直翻转.png" class="right-design-img" v-title="'垂直翻转'" />
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
      <div class="right-design-img" v-title="'位置'">
        <span class="el-icon-aim" style="font-size: 27px" />
      </div>
    </el-card>

    <!--设计图列表-->
    <el-card class="one-handle" shadow="never" v-if="imageList.length">
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
            </template>
          </div>

          <div class="handle">
            <template v-if="[canvasDefine.image].includes(item.attrs.name)">
              <!--图层-上移-->
              <div class="layer-btn" v-title="'图层-上移'" @click="onLayerUp(item)">
                <img src="../img/图层上移.png" />
              </div>
              <!--图层-下移-->
              <div class="layer-btn" v-title="'图层-下移'" @click="onLayerDown(item)">
                <img src="../img/图层下移.png" />
              </div>
            </template>
            <!--图层-编辑-->
            <div class="layer-btn" v-title="'图层-编辑'">
              <iconpark-icon name="write" size="20" />
            </div>
            <template v-if="item.attrs.type === canvasDefine.image">
              <!--图层-收藏-->
              <div class="layer-btn" v-title="'图层-收藏'" @click="onImageCollect(item)">
                <iconpark-icon name="rss" size="20" :style="{ color: DesignImageUtil.hasCollect(item) ? '#4087ff' : '' }" />
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
          <div></div>
        </div>
      </div>
    </el-card>

    <!--多角度-->
    <el-card class="one-handle" shadow="never">
      <div style="width: 100%; position: relative">
        <!--渲染按钮-->
        <el-button style="position: absolute; top: 0; left: 0; z-index: 3" type="primary">渲染</el-button>
        <!--空-->
        <el-empty description="暂无多角度" v-if="!multiAngleList.length" />
        <!--多角度-->
        <el-carousel style="width: 100%" :interval="50000" :autoplay="false" :loop="false" arrow="always" ref="carousel" indicator-position="outside" v-else>
          <el-carousel-item v-for="item in multiAngleList" :key="item.id">
            <!--简单多角度-->
            <multiAngleFold cursorZoomIn typeName="简单" v-if="!item.composeId" :image="item.bgImg" :mask="item.designImg" :texture="item.prodImg" />
            <!--复杂多角度-->
            <template v-else>
              <multiAngleFold cursorZoomIn typeName="复杂" :image="item.bgImg" :mask="item.designImg" :texture="item.prodImg" />
            </template>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-card>

    <!--设计说明-->
    <hoverDesignDetail ref="hoverDesignDetail" @mouseenter.native="enter()" @mouseleave.native="leave()" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import multiAngleFold from '@/designApplication/components/multiAngleFold.vue';
import { buttonBlur } from '@/designApplication/core/utils/buttonBlur';
import title from '@/designApplication/core/utils/title';
import hoverDesignDetail from './hover-designDetail.vue';
import hoverSetting from './hover-setting.vue';
import hoverClear from './hover-clear.vue';
import hoverScale from './hover-scale.vue';
import hoverTile from './hover-tile.vue';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';
import { uuid } from '@/designApplication/core/utils/uuid';
import { getAngleMultiple, setProxyTransformer } from '@/designApplication/core/canvas_2/konvaCanvasAddHelp';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';
import { collectImageFn } from '@/designApplication/core/utils/common';

export default {
  name: 'right-design',
  directives: { title },
  components: {
    multiAngleFold,
    hoverDesignDetail,
    hoverSetting,
    hoverClear,
    hoverScale,
    hoverTile,
  },
  data() {
    return {
      DesignImageUtil,
      canvasDefine,
      hoverTimer: null,
    };
  },
  computed: {
    ...mapState({
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
    /**
     * 多角度列表
     */
    multiAngleList() {
      // 获取当前激活颜色的多角度
      const appearance = this.activeProdStatic?.prod.detail.appearances.find((e) => e.id == this.activeColorId);
      if (!appearance) return [];

      // 简单多角度
      const simple = appearance?.multiAngleImages || [];
      // 复杂多角度
      const complex = this.complexMultiDispose(appearance.multiAngleImages4Compose);
      const resultList = [...simple, ...complex];
      const list = resultList.map((item) => {
        let {
          composeId, //复杂
          multiId, //简单
        } = item;
        // let { multiAngleList } = this.prod; // 请求回来的 多角度列表
        const multiAngleList = [];
        let designImg = this.findMultiDesignImg(multiAngleList, composeId, multiId);
        // 顺序 = image - mask - texture
        // image = background_white_positive
        // mask = mask_white_positive
        // texture = public_texture_white_positive [这张不需要]
        let result = {
          multiId: item.multiId, // 排序id
          composeId: item.composeId,
          id: item.multiId,
          bgImg: item.image,
          designImg: null,
          prodImg: null,
        };
        if (composeId) {
          // 复杂
          result.designImg = item.mask;
          result.prodImg = designImg;
        } else {
          // 简单
          result.designImg = designImg || '';
          result.prodImg = item.mask;
        }
        return result;
      });
      list.sort((a, b) => a.multiId - b.multiId);

      return list;
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
     * 设计图操作 - 复制
     */
    async onImageCopy() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      if (image.attrs.type === canvasDefine.image) {
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
      }
    },
    /**
     * 设计图操作 - 左旋转
     */
    async onImageRotateDown() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.rotation(image, getAngleMultiple(image.rotation(), 'left'));
    },
    /**
     * 设计图操作 - 右旋转
     */
    async onImageRotateUp() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.rotation(image, getAngleMultiple(image.rotation(), 'right'));
    },
    /**
     * 设计图操作 - 放大
     */
    async onImageScaleUp() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.scaleUp(image);
    },
    /**
     * 设计图操作 - 缩小
     */
    async onImageScaleDown() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.scaleDown(image);
    },
    /**
     * 设计图操作 - 水平居中
     */
    async onImagePositionHorizontal() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.positionHorizontalCenter(image);
    },
    /**
     * 设计图操作 - 垂直居中
     */
    async onImagePositionVertical() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.positionVerticalCenter(image);
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
      if (image.attrs.name === canvasDefine.image) {
        DesignImageUtil.layerMoveUp(image);
      }
    },
    /**
     * 设计图操作 - 下移动
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    onLayerDown(image) {
      if (image.attrs.name === canvasDefine.image) {
        DesignImageUtil.layerMoveDown(image);
      }
    },
    /**
     * 设计图操作 - 移除
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    onLayerDel(image) {
      if (image.attrs.name === canvasDefine.image) {
        DesignImageUtil.deleteImage(image);
      }
    },
    /**
     * 设计图操作 - 显示|隐藏
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    onLayerVisible(image) {
      switch (image.attrs.name) {
        case canvasDefine.image:
          DesignImageUtil.setImageVisible(image);
          break;
        case canvasDefine.bgc:
          break;
        default:
          break;
      }
    },
    /**
     * 设计说明 - 鼠标进入
     */
    enter() {
      clearTimeout(this.hoverTimer);
      this.$refs.hoverDesignDetail.isShow = true;
    },
    /**
     * 设计说明 - 鼠标离开
     */
    leave() {
      this.hoverTimer = setTimeout(() => {
        this.$refs.hoverDesignDetail.isShow = false;
      }, 100);
    },
    /*
     * 复杂多角度处理
     * @param {array} list 图片列表
     * @return {array} resultList 处理后的图片列表
     * */
    complexMultiDispose(list) {
      // 打上组的标签 composeGroup
      list.forEach((item) => (item.composeGroup = item.composeId.split('')[0]));
      // 按标签分组存在 map
      let resultMap = new Map();
      list.forEach((e) => {
        if (!resultMap.has(e.composeGroup)) {
          resultMap.set(e.composeGroup, [e]);
        } else {
          let d = resultMap.get(e.composeGroup);
          d.push(e);
          resultMap.set(e.composeGroup, d);
        }
      });
      let tempList = [...resultMap.values()];
      let resultList = [];
      // 取组的第一个为首选，其余放在字段 multiList 中
      tempList.forEach((e) => resultList.push({ ...e[0], multiList: e }));
      return resultList;
    },

    /*
     * 查找多角度设计图
     * @param {array} multiDesignImgList 多角度设计图组
     * @param {string} composeId 产品的composeId
     * @param {string} multiId 产品的多角度id
     * @return {string} url 设计图的url
     * */
    findMultiDesignImg(multiDesignImgList, composeId, multiId) {
      let url = '';
      // 复杂多角度查找
      if (composeId) {
        let d = multiDesignImgList.find((e) => e.composeId == composeId);
        if (d) url = d.img;
      }
      // 简单多角度查找
      else {
        let d = multiDesignImgList.find((e) => e.multiId == multiId);
        if (d) url = d.img;
      }
      return url;
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
@import url('./commonStyle');

/*多角度-start*/
::v-deep .el-carousel__button {
  height: 4px;
}

::v-deep .el-carousel__container {
  height: 350px;
}

::v-deep .el-carousel__item {
  display: flex;
  justify-content: center;
  align-items: center;
}
/*多角度-end*/

::v-deep .el-carousel__indicators--outside {
  button {
    background-color: #4087ff;
  }
}

// 多角度-左右切换按钮
::v-deep .el-carousel__arrow {
  background-color: #1f2d3d7d;
}

/deep/ .el-card__body {
  padding: 4px;
}
.handle2 {
  /deep/ .el-card__body {
    display: flex;
    flex-wrap: wrap;
  }
}
@width: 50px;
@margin: 4px 5px;
.one-handle {
  /deep/ .el-card__body {
    display: flex;
    align-items: center;
  }
  .btn {
    width: @width;
    height: 36px;
    margin: @margin !important;
    border-radius: 3px;
    padding: 7px 13px;
    cursor: pointer;
    position: relative;
  }

  .btn2 {
    width: fit-content;
  }

  .btn3 {
    height: calc(@width - 2px);
  }

  .btn4 {
    height: calc(@width - 2px);
    margin: @margin !important;
  }

  .btn5 {
    width: 80px;
  }

  .btn6 {
    padding: 7px 9px;
  }

  .right-design-img {
    position: relative;
    cursor: pointer;
    width: @width;
    height: calc(@width - 2px);
    margin: @margin !important;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 2px;

    &:hover {
      border: 1px solid #409eff;
    }
  }

  // 设计图列表
  .design-group {
    width: 100%;
    @designWidth: 36px; // 设计图宽度
    @designHeight: 36px; // 设计图高度
    @designPadding: 5px; // 行内边距
    @designMarginBottom: 4px; // 行下间距
    @borderWidth: 2px; // 边框宽度
    @num: 3.5; // 展示的数量
    max-height: calc((@designHeight + @designPadding * 2 + @borderWidth * 2 + @designMarginBottom) * @num);
    overflow-y: auto;

    .active {
      border: 2px solid #409eff !important;
    }
    .design-wrap {
      width: 100%;
      height: calc(@designHeight + @designPadding * 2 + @borderWidth * 2);
      display: flex;
      padding: @designPadding;
      border: @borderWidth solid #eee;
      border-radius: 4px;
      margin-bottom: @designMarginBottom;
      &:last-child {
        margin-bottom: 0;
      }

      .wrap {
        display: flex;
        cursor: pointer;
      }
      .design-bd {
        width: fit-content;
        display: flex;
      }
      .design {
        width: @designWidth;
        height: @designHeight;
        //background-color: red;
      }
      .title {
        width: 80px;
        height: @designHeight;
        display: flex;
        justify-content: center;
        align-items: center;
        word-wrap: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 10px;
        margin-left: 4px;
        margin-right: 4px;
        box-shadow:
          0 2px 4px rgba(0, 0, 0, 0.12),
          0 0 6px rgba(0, 0, 0, 0.04);
        //background-color: green;
      }
      .handle {
        flex: 1;
        //background-color: pink;
        display: flex;
        user-select: none;
        justify-content: flex-end;

        .layer-btn {
          cursor: pointer;
          width: @designWidth;
          height: @designHeight;
          border: 1px solid transparent;
          border-radius: 3px;
          display: flex;
          justify-content: center;
          align-items: center;
          &:hover {
            border: 1px solid #409eff;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
