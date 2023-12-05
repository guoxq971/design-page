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
      <el-button class="btn" @click="onHistory" v-title="'历史记录'">
        <iconpark-icon name="history" size="20" />
      </el-button>

      <!--全颜色合成-->
      <el-button :loading="loadingSave" class="btn btn2 btn5 btn6 save-btn" :disabled="saveAllBtnDisabled" type="warning" @click="(e) => onSave(e, 1)" v-title="'全颜色合成'">全颜色合成</el-button>

      <!--保存产品-->
      <el-button :loading="loadingSave" class="btn btn2 btn5 save-btn" type="primary" @click="(e) => onSave(e, 0)" v-title="'保存产品'">保存产品</el-button>
    </el-card>

    <!--操作区域-2-->
    <el-card class="one-handle" shadow="never">
      <!--撤销-->
      <img src="../img/后退.png" class="right-design-img" v-title="'撤销'" @click="onPrev" :class="{ 'disabled-bgc': prevDisabled }" />

      <!--前进-->
      <img src="../img/前进.png" class="right-design-img" v-title="'前进'" @click="onNext" :class="{ 'disabled-bgc': nextDisabled }" />

      <!--清空设计-->
      <hoverClear class="btn4" />

      <!--关闭图层-->
      <el-button class="btn4 btn5" @click="onLayer" v-title="'图层'" :class="{ 'hover-color': visible_layer }">
        {{ visible_layer ? '关闭图层' : '开启图层' }}
      </el-button>

      <!--开启收藏-->
      <el-button class="btn4 btn5" @click="onCollect" v-title="'收藏'" :class="{ 'hover-color': visible_collect }">
        {{ visible_collect ? '关闭收藏' : '开启收藏' }}
      </el-button>
    </el-card>

    <!--设计图操作-->
    <designHandleCard />

    <!--设计图列表-->
    <designListCard />

    <!--多角度 渲染-->
    <multiAngleCard />

    <!--历史设计记录-->
    <historyPop ref="historyPop" v-show="visible_history" />
    <!--设计说明-->
    <hoverDesignDetail ref="hoverDesignDetail" @mouseenter.native="enter()" @mouseleave.native="leave()" />
    <!--收藏列表-->
    <collectPop v-show="visible_collect" />
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import multiAngleFold from '@/designApplication/components/multiAngleFold.vue';
import title from '@/designApplication/core/utils/directives/title/title';
import hoverDesignDetail from './hoverComponents/hover-designDetail.vue';
import hoverSetting from './hoverComponents/hover-setting.vue';
import hoverClear from './hoverComponents/hover-clear.vue';
import hoverScale from './hoverComponents/hover-scale.vue';
import hoverTile from './hoverComponents/hover-tile.vue';
import collectPop from './collectPop.vue';
import multiAngleCard from './multiAngleCard.vue';
import designHandleCard from './designHandleCard.vue';
import designListCard from './designListCard.vue';
import historyPop from '@/designApplication/components/layout/right/historyPop.vue';

import { canvasDefine } from '@/designApplication/core/canvas_2/define';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { ProdType } from '@/designApplication/interface/prodItem';
import { buttonBlur } from '@/designApplication/core/utils/buttonBlur';

import { saveProdApi, saveProdWithSizeApi } from '@/designApplication/apis/prod';
import { getSaveProdParam, refineVerify, saveProd } from '@/designApplication/core/utils/saveProd';
import { useQueue } from '@/designApplication/core/utils/useQueue';

export default {
  name: 'right-design',
  directives: { title },
  components: {
    multiAngleFold,
    designListCard,
    designHandleCard,
    multiAngleCard,
    historyPop,
    collectPop,
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
    ...mapGetters({
      activeProd: 'designApplication/activeProd',
      activeProdStatic: 'designApplication/activeProdStatic',
    }),
    ...mapState({
      queue: (state) => state.designApplication.queue,
      visible_layer: (state) => state.designApplication.visible_layer,
      isInit_image_collect: (state) => state.designApplication.isInit_image_collect,
      visible_history: (state) => state.designApplication.visible_history,
      visible_collect: (state) => state.designApplication.visible_collect,
      loadingSave: (state) => state.designApplication.loading_save,
      activeViewId: (state) => state.designApplication.activeViewId,
      activeColorId: (state) => state.designApplication.activeColorId,
    }),
    // 全颜色合成
    saveAllBtnDisabled() {
      return !this.activeProd || this.activeProd.detail.isCanSynthesis === false;
    },
    // 撤销 disabled
    prevDisabled() {
      return this.queue.list.length === 0 || this.queue.activeId === 0;
    },
    // 下一步 disabled
    nextDisabled() {
      return this.queue.list.length === 0 || this.queue.activeId === this.queue.list.length - 1;
    },
  },
  watch: {
    'queue.activeId': {
      handler(val) {
        console.log(val, this.queue);
      },
      immediate: true,
      // deep: true,
    },
  },
  methods: {
    /**
     * 下一步
     */
    onNext() {
      useQueue().next();
    },
    /**
     * 撤销
     */
    onPrev() {
      useQueue().prev();
    },
    /**
     * 保存产品
     * @param {Event} e
     * @param {Number} type 0:保存产品 1:全颜色合成 2:原胚设计
     */
    async onSave(e, type) {
      this.onBlur(e);

      // 当前的产品数据
      const prodItem = DesignerUtil.getActiveProd();

      switch (prodItem.type) {
        // 通用保存
        case ProdType.common:
          await saveProd({
            verify: async () => getSaveProdParam(type, prodItem),
            send: async (param) => saveProdApi(param),
          });
          break;

        // 精细保存
        case ProdType.refine:
          await saveProd({
            verify: async () => refineVerify(type, prodItem),
            send: async (param) => saveProdWithSizeApi(param),
          });
          break;
        default:
          this.$message.warning('未知的产品类型');
          break;
      }
    },
    /**
     * 历史设计记录
     */
    onHistory(e) {
      this.onBlur(e);
      this.$store.dispatch('designApplication/setHistoryVisible', !this.visible_history);
    },
    /**
     * 开启|关闭 图层
     */
    onLayer(e) {
      this.onBlur(e);
      this.$store.commit('designApplication/setVisibleLayer', !this.visible_layer);
    },
    /**
     * 开启|关闭 收藏
     */
    async onCollect(e) {
      this.onBlur(e);
      this.$store.commit('designApplication/setVisibleCollect', !this.visible_collect);
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
    /**
     * 失焦
     */
    onBlur(evt) {
      buttonBlur(evt);
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">
@import url('./commonStyle');

.disabled-bgc {
  cursor: default !important;
  background: #f4f7fa !important;
}

/deep/ .el-card__body {
  padding: 4px;
}

// 保存按钮
.save-btn {
  position: relative !important;
  padding: 0 !important;
  display: flex;
  justify-content: center;
  align-items: center;

  /deep/ .el-icon-loading {
    position: absolute;
    left: 50%;
    z-index: 3;
    color: #4087ff;
    font-weight: bold;
  }

  span {
    margin: 0 !important;
  }
}
</style>
