<!--取色板-->
<template>
  <div class="qsb-wrap-bd">
    <div class="qsb-wrap">
      <!--操作区域-->
      <div class="handle-wrap">
        <div class="handle-wrap-top">
          <el-button @click="onAddText" class="btn" type="primary">新增文字</el-button>
          <el-select style="width: 100px" v-model="param.fontFamily">
            <template slot="prefix">字体</template>
            <el-option v-for="item in fontFamilyList" :key="item.value" :label="item.label" :value="item.value">
              <span :style="{ fontFamily: item.value }">{{ item.label }}</span>
            </el-option>
          </el-select>
          <el-select style="width: 100px" v-model="param.fontSize">
            <template slot="prefix">字号</template>
            <el-option v-for="item in fontSizeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select style="width: 100px" v-model="param.fontWeight">
            <template slot="prefix">加粗</template>
            <el-option v-for="item in fontWeightList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select style="width: 100px" v-model="param.fontStyle">
            <template slot="prefix">斜体</template>
            <el-option v-for="item in fontStyleList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select style="width: 100px" v-model="param.textDecoration">
            <template slot="prefix">下划线</template>
            <el-option v-for="item in textDecorationList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <!--<el-select style="width: 100px" v-model="param.textAlign">-->
          <!--<template slot="prefix">对齐</template>-->
          <!--<el-option v-for="item in textAlignList" :key="item.value" :label="item.label" :value="item.value" />-->
          <!--</el-select>-->
          <el-select style="width: 100px" v-model="param.lineHeight">
            <template slot="prefix">行高</template>
            <el-option v-for="item in lineHeightList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-select style="width: 100px" v-model="param.letterSpacing">
            <template slot="prefix">间距</template>
            <el-option v-for="item in letterSpacingList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <el-input v-model="param.text" type="textarea" :rows="5" placeholder="请在这里输入文字" />
      </div>

      <!--取色器-->
      <sketch-picker :value="param.fontColor" @input="colorInput" :presetColors="presetColors" />

      <!--自定义栏-->
      <div class="costom-wrap">
        <!--色块-->
        <div style="width: 32px; height: 32px; padding-right: 10px; border-radius: 4px; margin-right: 10px" class="bd-shadow" :style="{ background: param.fontColor }"></div>
        <!--双向绑定值input-->
        <el-input v-model="param.fontColor" style="width: 90px; margin-right: 10px" @input="colorInput" />
        <!--拾色器-->
        <!--<colorPicker ref="colorPicker" el="svg-group" v-model="costomColor" @upHex="upHex" />-->
      </div>
    </div>
  </div>
</template>

<script>
// 色盘
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { Sketch } from 'vue-color';
import { Message } from 'element-ui';

class FontFamily {
  constructor(label, value, remark) {
    this.label = label || '';
    this.value = value || '';
    this.remark = remark || '';
  }
}

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

export default {
  components: {
    'sketch-picker': Sketch,
  },
  data() {
    return {
      timer: null,
      text: null,
      param: {
        text: '',
        fontColor: '#000',
        fontSize: 20,
        fontFamily: '微软雅黑',
        fontWeight: 'normal', //normal,bold
        fontStyle: 'normal', //normal,italic
        textDecoration: 'none', //none,underline,overline,line-through
        textAlign: 'left', //left,center,right
        lineHeight: 1, //字体行高
        letterSpacing: 0, //字体间距
      },
      fontFamilyList: [
        new FontFamily('默认', 'sans-serif', 'default'),
        // new FontFamily('test', 'test', 'custom'),
        // new FontFamily('OZ焦糖体', 'OzCaramel', 'custom'),
        new FontFamily('851手写杂书体', 'tegakizatsu', 'custom'),
        new FontFamily('iSlide云犹体', 'iSlide云犹体', 'custom'),
        new FontFamily('Aa剑豪体', 'Aa剑豪体', 'custom'),
        // new FontFamily('element-icons', 'element-icons', 'default'),
        new FontFamily('fantasy', 'fantasy', 'default'),
        new FontFamily('微软雅黑', 'Microsoft YaHei', 'default'),
        new FontFamily('宋体', 'SimSun', 'default'),
        new FontFamily('黑体', 'SimHei', 'default'),
        new FontFamily('楷体', 'KaiTi', 'default'),
        new FontFamily('隶书', 'LiSu', 'default'),
        new FontFamily('幼圆', 'YouYuan', 'default'),
        new FontFamily('华文行楷', 'STXingkai', 'default'),
        new FontFamily('华文楷体', 'STKaiti', 'default'),
        new FontFamily('华文宋体', 'STSong', 'default'),
        new FontFamily('华文中宋', 'STZhongsong', 'default'),
        new FontFamily('华文新魏', 'STXinwei', 'default'),
        new FontFamily('华文细黑', 'STXinghei', 'default'),
        new FontFamily('华文仿宋', 'STFangsong', 'default'),
        new FontFamily('华文彩云', 'STCaiyun', 'default'),
        new FontFamily('华文琥珀', 'STHupo', 'default'),
        new FontFamily('华文隶书', 'STLiti', 'default'),
        new FontFamily('方正舒体', 'FZShuTi', 'default'),
        new FontFamily('方正姚体', 'FZYaoti', 'default'),
        // new FontFamily('方正粗黑宋简体', 'FZCuHei-B01S', 'default'),
        // new FontFamily('方正粗倩简体', 'FZCuQian-M03S', 'default'),
        // new FontFamily('方正粗雅宋简体', 'FZCuYuan-M03S', 'default'),
        // new FontFamily('方正大标宋简体', 'FZDaBiaoSong-B05S', 'default'),
        // new FontFamily('方正大黑简体', 'FZDaHei-B02S', 'default'),
        // new FontFamily('方正大黑_GBK1', 'FZDaHei-G01S', 'default'),
        // new FontFamily('方正大黑_GBK2', 'FZDaHei-G', 'default'),
      ],
      fontSizeList: [
        { label: '12', value: 12 },
        { label: '14', value: 14 },
        { label: '16', value: 16 },
        { label: '18', value: 18 },
        { label: '20', value: 20 },
        { label: '22', value: 22 },
        { label: '24', value: 24 },
        { label: '26', value: 26 },
        { label: '28', value: 28 },
        { label: '30', value: 30 },
      ],
      fontWeightList: [
        { label: '正常', value: 'normal' },
        { label: '加粗', value: 'bold' },
      ],
      fontStyleList: [
        { label: '正常', value: 'normal' },
        { label: '斜体', value: 'italic' },
      ],
      textDecorationList: [
        { label: '无', value: 'none' },
        { label: '下划线', value: 'underline' },
        // { label: '上划线', value: 'overline' },
        { label: '删除线', value: 'line-through' },
      ],
      textAlignList: [
        { label: '左对齐', value: 'left' },
        { label: '居中', value: 'center' },
        { label: '右对齐', value: 'right' },
      ],
      lineHeightList: [
        { label: '1', value: 1 },
        { label: '1.5', value: 1.5 },
        { label: '2', value: 2 },
        { label: '2.5', value: 2.5 },
        { label: '3', value: 3 },
      ],
      letterSpacingList: [
        { label: '0', value: 0 },
        { label: '1.5', value: 1.5 },
        { label: '2', value: 2 },
        { label: '2.5', value: 2.5 },
        { label: '3', value: 3 },
      ],
      presetColors,
      costomColor: '', //自定义颜色
    };
  },
  methods: {
    /**
     * 添加文字
     * */
    onAddText() {
      if (!this.param.text) {
        this.$message.warning('请输入文字');
        return;
      }
      const view = DesignerUtil.getView();
      if (!view || !view.canvas) {
        this.$message.warning('请先选择视图');
        return;
      }
      view.canvas.addText(this.param);
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
      this.param.fontColor = color;
    },
    //应用自定义颜色到color
    upHex(val) {
      this.costomColor = val;
      // costomColor 不符合16进制颜色就不执行
      if (!/^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(this.costomColor)) {
        Message.warning('请输入正确的颜色值');
        return;
      }
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
