<template>
  <div class="center-work-container" :id="config.workerContainerId" v-loading="loading_prod">
    <!--3d容器-->
    <div class="three-container" :id="config.threeContainerId" :style="{ left: show3d ? '0' : '-10000px' }"></div>

    <template v-if="activeProdStatic">
      <!--标题-->
      <div class="title layer-top" @click="onShow3d">
        {{ activeProd.detail.templateNameShow }}
      </div>

      <div class="body-wrap layer-top">
        <!--价格-->
        <div class="price-wrap">
          <div class="text" v-if="!loading_price">10</div>
          <div class="text" v-else>
            <div class="el-icon-loading" style="font-size: 17px" />
          </div>
          <!--特殊颜色/尺码标识-->
          <div class="warning">尺码/颜色不同价</div>
        </div>

        <!--颜色-->
        <div class="model-info-color">
          <div class="model-info-color-item" v-for="item in activeProd.colorList" :key="item.id" @click="onColor(item)" :class="{ action: item.id === activeColorId }">
            <div :style="{ backgroundColor: item.colorCode }"></div>
          </div>
        </div>

        <!--尺码-->
        <div class="model-info-color">
          <div class="model-info-color-size" v-for="item in activeSizeList" :key="item.id" @click="onSize(item)" :class="{ action: item.id === activeSizeId }">
            <span>{{ item.name }}</span>
            <!--<span v-if="isShowFlag(item)" class="flag-wrap">设计</span>-->
          </div>
        </div>

        <!--画布区域-->
        <div class="canvas-work-container" :style="{ width: config.canvasSize.width + 'px' }">
          <template v-for="view in activeProdStatic.viewList">
            <div
              class="canvas-wrap"
              :style="{
                width: config.canvasSize.width + 'px',
                height: config.canvasSize.height + 'px',
                display: show3d ? 'none' : activeViewId === view.id ? 'block' : 'none',
                left: 0,
              }"
              style="position: absolute; user-select: none"
            >
              <img v-show="config.canvas.isShowProductImage" style="width: 100%; position: absolute; z-index: 2" :src="view.prod" alt="" />
              <div :id="`${config.canvasContainerId}-${view.id}`" style="position: absolute; z-index: 2" />
              <img v-show="config.canvas.isShowProductImage" style="width: 100%; position: absolute; z-index: 2; pointer-events: none" :src="view.bg" alt="" />
            </div>
          </template>

          <!--预览图-->
          <centerPreview ref="previewRef" />

          <!--切换 模板类型-->
          <centerSwitchProdType :style="{ left: -previewSize.positionLeft + 'px', top: '-34.2px' }" style="position: absolute" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import centerPreview from './centerPreview.vue';
import centerProdInfo from './centerProdInfo.vue';
import { mapGetters, mapState } from 'vuex';
import centerSwitchProdType from './centerSwitchProdType.vue';

export default {
  components: {
    centerPreview,
    centerProdInfo,
    centerSwitchProdType,
  },
  data() {
    return {
      loading_price: false,
    };
  },
  computed: {
    ...mapGetters({
      activeSizeList: 'designApplication/activeSizeList',
      activeProd: 'designApplication/activeProd',
      activeProdStatic: 'designApplication/activeProdStatic',
    }),
    ...mapState({
      previewSize: (state) => state.designApplication.config.previewSize,
      show3d: (state) => state.designApplication.show3d,
      config: (state) => state.designApplication.config,
      activeColorId: (state) => state.designApplication.activeColorId,
      activeSizeId: (state) => state.designApplication.activeSizeId,
      activeViewId: (state) => state.designApplication.activeViewId,
      loading_prod: (state) => state.designApplication.loading_prod,
    }),
  },
  methods: {
    onShow3d() {
      this.$store.commit('designApplication/setShow3d', !this.show3d);
    },
    // 选择颜色
    onColor(item) {
      if (this.activeColorId === item.id) return;
      this.$store.commit('designApplication/setActiveColorId', item.id);
    },
    // 选择尺码
    onSize(item) {
      if (this.activeSizeId === item.id) return;
      this.$store.dispatch('designApplication/setActiveSizeId', item.id);
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">
.action {
  border: 2px solid #0099ff !important;
}

// 3d容器
.three-container {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
}

.layer-top {
  position: relative;
  z-index: 4;
}

.center-work-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .body-wrap {
    width: fit-content;
    display: flex;
    flex-direction: column;
  }

  // 标题
  .title {
    width: fit-content;
    font-weight: bold;
    font-size: 20px;
    display: flex;
    justify-content: center;
    margin-bottom: 7px;
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

  // 画布
  .canvas-work-container {
    margin-top: 5px;
    position: relative;

    .canvas-wrap {
      //border: 1px solid;
    }
  }
}
</style>
