<!--设计器-中间区域-->
<template>
  <div class="container" v-if="prod">
    <div class="content-container">
      <!--标题-->
      <div class="title tier-2">{{ prod.templateNameShow }}</div>

      <div class="info-container tier-2">
        <!--价格-->
        <priceContainer />

        <!--颜色 and 尺码-->
        <colorAndSizeContainer />
      </div>

      <!--画布容器-->
      <canvasContainer />
    </div>

    <!--画布容器-->
    <!--    <div ref="canvasContainerRef" class="my-canvas-container">-->
    <!--      <canvas id="my-canvas-container"></canvas>-->
    <!--    </div>-->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import priceContainer from './components/price';
import colorAndSizeContainer from './components/colorAndSize';
import canvasContainer from './components/canvas';
import { FabricCanvas } from '@/designApp/core/canvas';
export default {
  components: {
    priceContainer,
    colorAndSizeContainer,
    canvasContainer,
  },
  data() {
    return {
      canvas: null,
    };
  },
  computed: {
    ...mapState({
      prod: (state) => state.designApp.prod,
    }),
    ...mapGetters({
      activeData: 'designApp/activeData',
    }),
  },
  mounted() {
    setTimeout(() => {
      // new FabricCanvas('my-canvas-container', this.activeData.viewList[0]);
      // for (let view of this.activeData.viewList) {
      // }
    });
  },
};
</script>

<style scoped lang="less">
.tier-2 {
  position: relative;
  z-index: 2;
}

.container {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;

  .my-canvas-container {
    position: absolute;
    width: 100%;
    height: 100%;
    //background-color: pink;
  }

  .content-container {
    min-width: 650px;
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-weight: bold;
      font-size: 20px;
    }

    .info-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
      padding: 5px;
    }
  }
}
</style>
