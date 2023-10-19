<!--取色板-->
<template>
  <div class="qsb-wrap-bd">
    <div class="qsb-wrap">
      <!--操作区域-->
      <div class="handle-wrap">
        <div class="handle-wrap-top">
          <el-button @click="onAddText" class="btn" type="primary">新增文字</el-button>
          <el-select class="sel"></el-select>
        </div>
        <el-input v-model="text" type="textarea" :rows="5" placeholder="请在这里输入文字" />
      </div>

      <!--取色器-->
      <sketch-picker :value="color" @input="colorInput" :presetColors="presetColors" />

      <!--自定义栏-->
      <div class="costom-wrap">
        <!--色块-->
        <div style="width: 32px; height: 32px; padding-right: 10px; border-radius: 4px; margin-right: 10px" class="bd-shadow" :style="{ background: color }"></div>
        <!--双向绑定值input-->
        <el-input v-model="color" style="width: 90px; margin-right: 10px" @input="colorInput" />
        <!--拾色器-->
        <!--<colorPicker ref="colorPicker" el="svg-group" v-model="costomColor" @upHex="upHex" />-->
      </div>
    </div>
  </div>
</template>

<script>
// 色盘
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

export const presetColors = [
  '#F51E30',
  '#F76707',
  '#F2DE33',
  '#EAC588',
  '#FFC0CB',
  '#0099FF',
  '#1E9658',
  '#FFFFFF',
  '#00224C',
  '#4C2075',
  '#C0C0C0',
  '#665544',
  '#333333',
  '#750033',
  '#07462C',
  '#000000',
];
import { Sketch } from 'vue-color';
import { Message } from 'element-ui';

export default {
  components: {
    'sketch-picker': Sketch,
  },
  data() {
    return {
      text: '',
      color: '',
      presetColors,
      costomColor: '', //自定义颜色
    };
  },
  methods: {
    /**
     * 添加文字
     * */
    onAddText() {
      if (!this.text) {
        this.$message.warning('请输入文字');
        return;
      }
      const view = DesignerUtil.getView();
      if (!view || !view.canvas) {
        this.$message.warning('请先选择视图');
        return;
      }
      view.canvas.addText(this.text);
    },
    // 颜色发生变化
    colorInput(val) {
      let color = '';
      if (typeof val === 'object') {
        color = val.hex8;
      } else if (typeof val === 'string') {
        color = val;
      }
      color = color.replace(/#/g, '');
      // color取前6位
      color = '#' + color.substring(0, 6);
      if (color === '#') color = '';
      this.color = color;
      // DesignerUtil.setBgc(color);
    },
    //应用自定义颜色到color
    upHex(val) {
      this.costomColor = val;
      // costomColor 不符合16进制颜色就不执行
      if (!/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(this.costomColor)) {
        Message.warning('请输入正确的颜色值');
        return;
      }
      // this.$emit('colorChange', this.costomColor);
    },
    // 手动触发颜色选择器
    click() {
      this.$refs.colorPicker.value.handlerColorPicker();
    },
  },
};
</script>

<style lang="less" scoped>
// 操作区域
.handle-wrap {
  margin-bottom: 10px;
  .handle-wrap-top {
    margin-bottom: 10px;
    .btn {
      margin-right: 5px;
    }
    .sel {
      width: 100px;
    }
  }
}
.bd-shadow {
  box-shadow:
    0 2px 4px #0000001f,
    0 0 6px #0000000a;
}
.qsb-wrap-bd {
  height: 650px;
}
//取色板--start
.qsb-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 10px;

  ::v-deep .vc-sketch {
    width: calc(100% - 20px);
    display: flex;
    flex-direction: column;
    padding-top: 0;
    padding-bottom: 40px;
    // 取色区域盘
    .vc-sketch-saturation-wrap {
      height: 150px;
      padding-bottom: 0;
      order: 1;
    }

    // rgba区域
    .vc-sketch-field {
      display: none;
      order: 3;
    }

    // 16种取色区域
    .vc-sketch-presets {
      order: 0;

      .vc-sketch-presets-color {
        //width: 32px;
        //height: 32px;
        width: 9%;
        height: 0;
        padding-bottom: 9%;
        margin: 0 12.5px 10px 0;
      }
    }

    // 滑块取色
    .vc-sketch-controls {
      order: 2;

      // 方块
      .vc-sketch-color-wrap {
        display: none;
      }
    }
  }

  // 自定义区域
  .costom-wrap {
    display: flex;
    bottom: 15px;
    position: absolute;
    padding-left: 10px;
  }
}
//取色板--end
</style>
