<template>
  <div class="center-work-container" :id="config.workerContainerId" v-loading="loading_prod || loading_save">
    <!--3d容器-->
    <div class="three-container" style="width: 100%; height: 100%; display: flex; justify-content: center" :style="{ left: show3d ? '0' : '-10000px' }">
      <div v-loading="loading_3d" :id="config.threeContainerId" style="border: 1px dashed #ccccccad" :style="{ width: '800px', height: '800px' }"></div>
    </div>

    <template v-if="activeProdStatic">
      <!--标题-->
      <div class="title layer-top" @click="onShow3d">
        {{ activeProd.detail.templateNameShow }}
        <recommendParam />
      </div>

      <div class="body-wrap layer-top" style="pointer-events: none">
        <!--价格-->
        <div class="price-wrap" style="pointer-events: all">
          <centerPriceIcon class="price-icon" />
          <div class="text" v-if="!loading_price && !loading_prod">
            {{ price }}
          </div>
          <div class="text" v-else>
            <div class="el-icon-loading" style="font-size: 17px" />
          </div>
          <!--特殊颜色/尺码标识-->
          <div class="warning" v-if="!loading_price && [0, 1].includes(activeProd.isSpecial)">
            <span v-if="['0', 0].includes(activeProd.isSpecial)">尺码</span>
            <span v-if="['1', 1].includes(activeProd.isSpecial)">颜色</span>
            <span>不同价</span>
          </div>
        </div>

        <!--颜色-->
        <div class="model-info-color" style="pointer-events: all">
          <div class="model-info-color-item" v-for="item in activeProd.colorList" :key="item.id" @click="onColor(item)" :class="{ action: item.id === activeColorId }">
            <div :style="{ backgroundColor: item.colorCode }"></div>
          </div>
        </div>

        <!--尺码-->
        <div class="model-info-color" style="pointer-events: all">
          <div class="model-info-color-size" v-for="item in activeSizeList" :key="item.id" @click="onSize(item)" :class="{ action: item.id === activeSizeId }">
            <span>{{ item.name }}</span>
            <span v-if="isShowDesignFlag(item)" class="flag-wrap">设计</span>
          </div>
        </div>

        <!--画布区域-->
        <div class="canvas-work-container" :style="{ width: config.canvasSize.width + 'px' }" style="pointer-events: all">
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

          <!--标识-->
          <div class="flag-icon">{{ show3d ? '3D' : '2D' }}</div>

          <!--切换 模板类型-->
          <centerSwitchProdType :style="{ left: -previewSize.positionLeft + 'px', top: '-34.2px' }" style="position: absolute" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import centerPreview from './center/centerPreview.vue';
import centerProdInfo from './center/centerProdInfo.vue';
import centerSwitchProdType from './center/centerSwitchProdType.vue';
import centerPriceIcon from './center/centerPriceIcon.vue';
import recommendParam from './center/recommendParam.vue';
import { ProdType } from '@/designApplication/interface/prodItem';

export default {
  components: {
    recommendParam,
    centerPreview,
    centerProdInfo,
    centerSwitchProdType,
    centerPriceIcon,
  },
  data() {
    return {};
  },
  computed: {
    // 精细设计的 设计标识
    isShowDesignFlag() {
      return (item) => {
        const prod = this.prodStore.get(ProdType.refine, item.id);
        return prod?.viewList.some((view) => view.canvas?.getImageList().length) || prod?.viewList.some((view) => view.imageList.length);
      };
    },
    ...mapGetters({
      activeSizeList: 'designApplication/activeSizeList',
      activeProd: 'designApplication/activeProd',
      activeProdStatic: 'designApplication/activeProdStatic',
    }),
    ...mapState({
      prodStore: (state) => state.designApplication.prodStore,
      previewSize: (state) => state.designApplication.config.previewSize,
      show3d: (state) => state.designApplication.show3d,
      config: (state) => state.designApplication.config,
      activeColorId: (state) => state.designApplication.activeColorId,
      activeSizeId: (state) => state.designApplication.activeSizeId,
      activeViewId: (state) => state.designApplication.activeViewId,
      loading_prod: (state) => state.designApplication.loading_prod,
      loading_save: (state) => state.designApplication.loading_save,
      loading_price: (state) => state.designApplication.loading_price,
      loading_3d: (state) => state.designApplication.loading_3d,
    }),
    // 产品价格
    price() {
      let price = '';
      if (!this.loading_price && !this.loading_prod) {
        /**
         * @type {import('@/design').ProdItemData}
         */
        const prodItem = this.activeProd;

        if (!prodItem) return '';
        if (prodItem.isSpecial === '') {
          price = '未获取到价格';
        }

        if (prodItem.priceList?.length) {
          let prop;
          if (prodItem.isSpecial == 1) {
            prop = this.activeColorId;
          } else if (prodItem.isSpecial == 0) {
            prop = this.activeSizeId;
          }
          price = `￥${this.getTemplatePrice(prodItem.priceList, prop, prodItem.isSpecial)}`;
        }
      }
      return price;
    },
  },
  methods: {
    onShow3d() {
      // this.$store.commit('designApplication/setShow3d', !this.show3d);
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
    /**
     * 获取模板价格根据类型
     * @param {import('@/design').ProdItemData.priceList} list 模板价格列表
     * @param {string} prop 类型 例如：尺码 | 颜色 会是激活的id
     * @param {number} isSpecial 是否是特殊模板 2-正常 1-颜色 0-尺码
     * @param {number} num 1：获取价格 2：获取数量
     * @returns {string}
     * */
    getTemplatePrice(list, prop, isSpecial, num = 1) {
      const appearances = this.activeProd.detail.appearances;
      const sizes = this.activeProd.detail.sizes;

      if (list.length === 0) return '';
      if (list[0].prop === '') return list[0].list.find((e) => e.num === num)?.price;
      // 颜色
      if (isSpecial === 1) {
        const result = appearances.find((e) => e.id == prop);
        if (!result) return '';
        return list.find((e) => e.prop === result.name)?.list.find((e) => e.num === num)?.price;
      }
      // 尺码
      if (isSpecial === 0) {
        const result = sizes.find((e) => e.id == prop);
        if (!result) return '';
        return list.find((e) => e.prop === result.name)?.list.find((e) => e.num === num)?.price;
      }
      return '';
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
    z-index: 11;
  }

  //价格
  .price-wrap {
    display: flex;
    position: relative;
    .price-icon {
      position: absolute;
      left: -23px;
      color: #0099ff;
      cursor: pointer;
      font-size: 17px;
    }

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

.flag-icon {
  position: absolute;
  z-index: 1;
  top: 4px;
  right: 5px;
  width: 35px;
  height: 35px;
  background-color: #4087ff;
  border-radius: 7px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}

.flag-wrap {
  color: #4087ff;
  margin-left: 13px;
  font-size: 12px;
}
</style>
