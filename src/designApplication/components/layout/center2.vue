<template>
  <div ref="parentRef" style="position: relative">
    <template v-if="activeProdStatic">
      <!--标题-->
      <div :style="{ transform: 'translateX(-50%)', left: `${DOMRect.cx}px` }" style="z-index: 3; position: absolute" class="title">
        {{ activeProd.detail.templateNameShow }}
      </div>
      <!--价格-->
      <div :style="{ left: `${DOMRect.infoX}px`, top: `calc(${style.h}px + ${style.g}px)` }" style="z-index: 3; position: absolute" class="price-wrap">
        <div class="text" v-if="!loading_price">10</div>
        <div class="text" v-else>
          <div class="el-icon-loading" style="font-size: 17px" />
        </div>
        <!--特殊颜色/尺码标识-->
        <div class="warning">尺码/颜色不同价</div>
      </div>

      <!--颜色-->
      <div :style="{ left: `${DOMRect.infoX}px`, top: `calc(${style.h * 2}px + ${style.g2}px)` }" style="z-index: 3; position: absolute" class="model-info-color">
        <div class="model-info-color-item" v-for="item in activeProd.colorList" :key="item.id" @click="onColor(item)" :class="{ action: item.id === activeColorId }">
          <div :style="{ backgroundColor: item.colorCode }"></div>
        </div>
      </div>

      <!--尺码-->
      <div :style="{ left: `${DOMRect.infoX}px`, top: `calc(${style.h * 3}px + ${style.g3}px)` }" style="z-index: 3; position: absolute" class="model-info-color" id="design-size-list">
        <div class="model-info-color-size" v-for="item in activeProd.sizeList" :key="item.id" @click="onSize(item)" :class="{ action: item.id === activeSizeId }">
          <span>{{ item.name }}</span>
          <!--<span v-if="isShowFlag(item)" class="flag-wrap">设计</span>-->
        </div>
      </div>

      <!--画布区域-->
      <!--<div :style="{ left: DOMRect.x + 'px', top: DOMRect.y + 'px' }" style="width: 500px; height: 500px; border: 1px solid; position: absolute"></div>-->
      <div
        :style="{ left: activeViewId === view.id ? `${/*DOMRect.x*/ 0}px` : view.id * 10000 + 'px', top: style.y }"
        style="position: absolute; user-select: none"
        v-for="view in activeProdStatic.viewList"
        :key="view.id"
      >
        <img v-if="DOMRect" :style="{ left: DOMRect.x + 'px', top: DOMRect.y + 'px' }" style="position: absolute; z-index: 2" :src="view.prod" alt="" />
        <div :id="`canvas-container-${view.id}`" style="position: absolute; z-index: 2" />
        <img v-if="DOMRect" :style="{ left: DOMRect.x + 'px', top: DOMRect.y + 'px' }" style="position: absolute; z-index: 2; pointer-events: none" :src="view.bg" alt="" />
      </div>

      <!--预览图-->
      <centerPreview ref="previewRef" :top="DOMRect.y" :left="DOMRect.x" />
    </template>
  </div>
</template>

<script>
import centerPreview from './centerPreview.vue';
import centerProdInfo from './centerProdInfo.vue';
import { mapGetters, mapState } from 'vuex';
import { KonvaCanvas } from '@/designApplication/core/canvas/konvaCanvas';
import { resize } from '@/designApplication/core/utils/resize';

export default {
  components: {
    centerPreview,
    centerProdInfo,
  },
  data() {
    return {
      style: {
        h: 25,
        g: 10, // 价格
        g2: 10, // 颜色
        g3: 15, // 尺码
        g4: 30, // 画布
        y: 25 * 4 + 30, // 画布区域的y轴
      },
      DOMRect: {
        cx: 0,
      },
      loading_price: false,
      // image3: require('@/assets/300 (1).jpg'), //200x300
      image3: require('@/assets/test.jpg'), //500x500
      // image3: require('@/assets/test (1).png'), //原图
    };
  },
  computed: {
    ...mapGetters({
      activeProd: 'designApplication/activeProd',
      activeProdStatic: 'designApplication/activeProdStatic',
    }),
    ...mapState({
      activeColorId: (state) => state.designApplication.activeColorId,
      activeSizeId: (state) => state.designApplication.activeSizeId,
      activeViewId: (state) => state.designApplication.activeViewId,
      loading_prod: (state) => state.designApplication.loading_prod,
    }),
  },
  watch: {
    // 监听产品切换, 重新加载画布
    loading_prod: {
      async handler(val) {
        // 产品数据加载完成, 且存在未初始化的画布
        if (!val && this.activeProdStatic?.viewList.length && this.activeProd?.viewList.some((e) => !e.canvas)) {
          try {
            // this.$store.commit('designApplication/setLoading2d', true);
            // this.$nextTick(async () => await this.initCanvas());
          } finally {
            this.$nextTick(() => this.$store.commit('designApplication/setLoading2d', false));
          }
        }
      },
    },
  },
  methods: {
    // 选择颜色
    onColor(item) {
      if (this.activeColorId === item.id) return;
      this.$store.dispatch('designApplication/setActiveColorId', item);
    },
    // 选择尺码
    onSize(item) {
      if (this.activeSizeId === item.id) return;
      this.$store.dispatch('designApplication/setActiveSizeId', item);
    },
    /**
     * 初始化画布
     * */
    async initCanvas() {
      this.resize();
      for (let staticView of this.activeProdStatic.viewList) {
        await this.createCanvas(staticView, this.DOMRect);
      }
    },
    /**
     * 创建画布
     * @param {Object} staticView 视图
     * @param {Object} rect 画布参数
     * */
    async createCanvas(staticView, rect) {
      const view = this.activeProd.viewList.find((e) => e.id === staticView.id);
      view.rect = rect;
      // 初始化画布
      view.canvas = new KonvaCanvas({
        id: `canvas-container-${staticView.id}`,
        staticView: staticView,
        view: view,
        width: rect.width,
        height: rect.height,
        offsetX: rect.x,
        offsetY: rect.y,
      });

      // 设计图
      const design = await view.canvas.createImage(this.image3);
      view.canvas.add(design);
      // 设计图
      const design2 = await view.canvas.createImage(this.image3);
      view.canvas.add(design2);
    },
    resize() {
      const result = resize(this.$refs.parentRef, this.style.y);
      Object.keys(result).forEach((key) => (this.DOMRect[key] = result[key]));
    },
  },
  mounted() {
    // window.addEventListener('resize', this.resize);
  },
};
</script>

<style scoped lang="less">
.action {
  border: 2px solid #0099ff !important;
}

.title {
  width: fit-content;
  font-weight: bold;
  font-size: 20px;
  display: flex;
  justify-content: center;
  margin-bottom: 7px;
}

.info-container {
  width: fit-content;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px;
}

//价格
.price-wrap {
  display: flex;
  .text {
    height: 22px;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 17px;
    color: #ff7a3d;
  }
  .warning {
    background-color: orange;
    color: #fff;
    padding: 0 4px;
    border-radius: 4px;
    font-size: 15px;
    margin-left: 6px;
    font-weight: normal;
  }
}

// 颜色/尺码
.model-info-color {
  margin: 4px 0;
  display: flex;
  flex-wrap: wrap;
  width: fit-content;

  .model-info-color-item {
    cursor: pointer;
    width: 22px;
    height: 22px;
    border: solid 1px #d6d2d2; //#D6D2D2 transparent
    border-radius: 4px;
    margin-right: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.12),
      0 0 6px rgba(0, 0, 0, 0.04);

    & div {
      width: 16px;
      height: 16px;
      border-radius: 3px;
    }
  }

  .model-info-color-size {
    position: relative;
    cursor: pointer;
    border: 2px solid transparent;
    padding: 0 7px;
    margin-right: 7px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.12),
      0 0 6px rgba(0, 0, 0, 0.04);
    //margin-bottom: 5px;
  }
}
</style>
