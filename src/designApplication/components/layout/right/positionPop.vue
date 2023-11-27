<!--位置和变换-->
<template>
  <transition name="el-fade-in-linear">
    <div class="history-wrap" v-dragPop="{ top: 99, left: 1244 }">
      <!--头部-->
      <div class="header" slot="header">
        <div>位置和变换</div>
        <div @click="onClose" class="close el-icon-close"></div>
      </div>

      <!--列表-->
      <div class="body" @mousedown.stop>
        <div class="position-map">
          <div style="display: flex">
            <mapChunk @click.native="handlerAlign('topLeft')" v-title="'左上角对齐'" :conf-area="chunkObj.topLeft" :conf-radius="chunkRadiusObj.a11" />
            <mapChunk @click.native="handlerAlign('topCenter')" :conf-area="chunkObj.topCenter" v-title="'上对齐'" />
            <mapChunk @click.native="handlerAlign('topRight')" v-title="'右上角对齐'" :conf-area="chunkObj.topRight" :conf-radius="chunkRadiusObj.a13" />
          </div>
          <div style="display: flex">
            <mapChunk @click.native="handlerAlign('centerLeft')" :conf-area="chunkObj.centerLeft" v-title="'左对齐'" />
            <mapChunk @click.native="handlerAlign('centerCenter')" :conf-area="chunkObj.centerCenter" v-title="'居中对齐'" />
            <mapChunk @click.native="handlerAlign('centerRight')" :conf-area="chunkObj.centerRight" v-title="'右对齐'" />
          </div>
          <div style="display: flex">
            <mapChunk @click.native="handlerAlign('bottomLeft')" :conf-area="chunkObj.bottomLeft" :conf-radius="chunkRadiusObj.a31" v-title="'左下角对齐'" />
            <mapChunk @click.native="handlerAlign('bottomCenter')" :conf-area="chunkObj.bottomCenter" v-title="'下对齐'" />
            <mapChunk @click.native="handlerAlign('bottomRight')" :conf-area="chunkObj.bottomRight" :conf-radius="chunkRadiusObj.a33" v-title="'右下角对齐'" />
          </div>
        </div>
      </div>

      <!--分页-->
      <div class="footer" @mousedown.stop>
        <el-input class="input" v-model="param.x" @blur="onPosition" @keyup.enter.native="onPosition">
          <div slot="suffix">X</div>
        </el-input>
        <el-input class="input" v-model="param.y" @blur="onPosition" @keyup.enter.native="onPosition">
          <div slot="suffix">Y</div>
        </el-input>
        <el-input class="input" v-model="param.width" @blur="onSize($event, 'width')" @keyup.enter.native="onSize($event, 'width')">
          <div slot="suffix">W</div>
        </el-input>
        <el-input class="input" v-model="param.height" @blur="onSize($event, 'height')" @keyup.enter.native="onSize($event, 'height')">
          <div slot="suffix">H</div>
        </el-input>
      </div>
    </div>
  </transition>
</template>

<script>
import lodash from 'lodash';
import { mapGetters, mapState } from 'vuex';
import dragPop from '@/designApplication/core/utils/directives/drag/drag';
import mapChunk from './positionChunk.vue';
import title from '@/designApplication/core/utils/directives/title/title';
import { chunkObj, chunkRadiusObj } from '@/designApplication/components/layout/right/position';
import { getPositionCenter, isCollision } from '@/designApplication/core/canvas_2/konvaCanvasAddHelp';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';

export default {
  directives: { dragPop, title },
  components: { mapChunk },
  data() {
    return {
      chunkObj,
      chunkRadiusObj,
      param: {
        width: '',
        height: '',
        x: '',
        y: '',
      },
    };
  },
  computed: {
    ...mapState({
      visible_position: (state) => state.designApplication.visible_position,
    }),
    ...mapGetters({
      activeView: 'designApplication/activeView',
    }),
    activeImage() {
      const image = this.activeView.canvas.getSelected();
      if (!image) return;
      const result = DesignImageUtil.getImageInfo(image.design);
      return result;
    },
  },
  watch: {
    activeImage: {
      handler: lodash.throttle(function (val) {
        if (!val) {
          this.param.width = '';
          this.param.height = '';
          this.param.x = '';
          this.param.y = '';
        } else {
          this.param.width = val.width.toFixed(2);
          this.param.height = val.height.toFixed(2);
          this.param.x = val.x.toFixed(2);
          this.param.y = val.y.toFixed(2);
        }
      }, 80),
    },
  },
  methods: {
    /**
     * 手动输入尺寸
     */
    async onSize(e, type) {
      const image = await DesignImageUtil.hasActiveImageMessage();
      const result = DesignImageUtil.getImageInfo(image);

      const scale = (+this.param[type] / result[type]) * result.scaleX;
      if (!isCollision(image, { scaleX: scale, scaleY: scale }))
        image.setAttrs({
          scaleX: scale,
          scaleY: scale,
        });
    },
    /**
     * 手动输入位置
     */
    async onPosition() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      const position = getPositionCenter(image);

      let x;
      let y;
      if (image.attrs.name === canvasDefine.image) {
        x = +this.param.x + +position.leftTopX;
        y = +this.param.y + +position.leftTopY;
      } else if (image.attrs.name === canvasDefine.text) {
        x = +this.param.x;
        y = +this.param.y;
      }

      image.setAttrs({
        x: x,
        y: y,
      });

      DesignImageUtil.updateTexture(image);
    },
    /**
     * 对齐函数
     * @param {string} type 对齐类型
     * */
    async handlerAlign(type) {
      const image = await DesignImageUtil.hasActiveImageMessage();
      const result = getPositionCenter(image);
      let move = { x: 0, y: 0 };
      switch (type) {
        case 'topLeft':
          move.x = result.leftTopX;
          move.y = result.leftTopY;
          break;
        case 'topCenter':
          move.x = result.topCenterX;
          move.y = result.topCenterY;
          break;
        case 'topRight':
          move.x = result.rightTopX;
          move.y = result.rightTopY;
          break;
        case 'centerLeft':
          move.x = result.leftCenterX;
          move.y = result.leftCenterY;
          break;
        case 'centerCenter':
          move.x = result.x;
          move.y = result.y;
          break;
        case 'centerRight':
          move.x = result.rightCenterX;
          move.y = result.rightCenterY;
          break;
        case 'bottomLeft':
          move.x = result.leftBottomX;
          move.y = result.leftBottomY;
          break;
        case 'bottomCenter':
          move.x = result.bottomCenterX;
          move.y = result.bottomCenterY;
          break;
        case 'bottomRight':
          move.x = result.rightBottomX;
          move.y = result.rightBottomY;
          break;
        default:
          console.error('对齐函数的type错误 alignFn type error');
          break;
      }

      move.x = lodash.round(move.x, 0);
      move.y = lodash.round(move.y, 0);

      image.setAttrs({
        x: move.x,
        y: move.y,
      });

      DesignImageUtil.updateTexture(image);
    },
    /**
     * 关闭弹窗
     */
    onClose() {
      this.$store.commit('designApplication/setVisiblePosition', false);
    },
  },
};
</script>

<style scoped lang="less">
.history-wrap {
  width: 280px;
  position: absolute;
  z-index: 10;
  background-color: #fff;
  padding: 0 5px;
  border-radius: 5px;

  /deep/ .el-card__header {
    padding: 0;
  }

  .header {
    padding: 7px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    font-weight: bold;
    cursor: default;

    .close {
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;

      &:hover {
        color: #409eff;
      }
    }
  }

  .body {
    margin-top: 2px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
  }

  .footer {
    margin-top: 8px;
    margin-bottom: 5px;

    .input {
      width: 120px;
      margin-right: 10px;
      margin-bottom: 10px;

      /deep/ .el-input__suffix {
        user-select: none;
        font-size: 14px;
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
