<!--推荐参数-->
<template>
  <div>
    <span class="icon el-icon-warning" @mouseenter="boxEnter()" @mouseleave="boxLeave()" />
    <transition name="el-fade-in-linear">
      <div v-show="visible_recommend" ref="box-wrap" class="box-wrap" @mouseenter="boxEnter" @mouseleave="boxLeave" :style="{ right: right }">
        <div style="white-space: nowrap">推荐设计像素宽高： {{ size }}</div>
        <div style="white-space: nowrap">推荐设计分辨率：{{ dpi }}</div>
        <div>
          工厂生产版：
          <template v-if="isPsd">
            <template v-if="prod.detail.psdVersion">
              <el-popover popper-class="prod-popover" placement="right-start" width="450" v-model="visible" trigger="manual">
                <el-table :data="prod.detail.designLogs" @mouseenter.native="tableEnter" @mouseleave.native="tableLeave">
                  <el-table-column :resizable="false" label="版本号" prop="version" align="center" />
                  <el-table-column :resizable="false" label="更新时间" prop="createTime" align="center" />
                  <el-table-column :resizable="false" label="备注" prop="remark" align="center" />
                </el-table>
                <el-button type="text" slot="reference" @mouseenter.native="versionEnter" @mouseleave.native="versionLeave">
                  {{ prod.detail.psdVersion }}
                </el-button>
              </el-popover>
              <br />
            </template>
            <el-button type="primary" size="mini" @click="handlerDown" :style="prod.detail.psdVersion ? 'position: relative; right: -92px;' : ''">下载psd</el-button>
          </template>
          <span v-else>{{ psd }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
class ConfigDesign {
  //推荐dpi 主要用于设计器
  recommendDpi = '';
  //推荐宽 主要用于设计器
  recommendWidth = '';
  //推荐高 主要用于设计器
  recommendHeight = '';
  //工厂生产版 文件路径
  factoryProductionDocuments = '';
  // 文件名称
  fileName = '';
  constructor(obj) {
    if (obj) {
      this.recommendDpi = obj.recommendDpi;
      this.recommendWidth = obj.recommendWidth;
      this.recommendHeight = obj.recommendHeight;
      this.factoryProductionDocuments = obj.factoryProductionDocuments;
      this.fileName = obj.fileName || '';
    }
  }
}

import { mapGetters, mapState } from 'vuex';

export default {
  name: 'recommendParam',
  data() {
    return {
      recommend_timer: null,

      right: '',
      visible: false,
      timer: null,
    };
  },
  watch: {
    'prod.detail.templateNo': {
      immediate: true,
      handler(val) {
        this.computedRight();
      },
    },
    visible_recommend: {
      immediate: true,
      handler(val) {
        if (val) {
          this.computedRight();
        }
      },
    },
  },
  computed: {
    ...mapState({
      visible_recommend: (state) => state.designApplication.visible_recommend,
    }),
    ...mapGetters({
      prod: 'designApplication/activeProd',
    }),
    /*
     * 参数
     * */
    config() {
      return new ConfigDesign(this.prod.detail?.configDesign);
    },
    // 推荐尺码
    size() {
      let config = this.config;
      let size,
        width = 0,
        height = 0;
      if (config.recommendWidth) width = config.recommendWidth;
      if (config.recommendWidth) height = config.recommendHeight;
      if (width || height) {
        size = `${width}*${height}px`;
      } else {
        size = '暂无数据';
      }
      return size;
    },
    // 推荐dpi
    dpi() {
      let config = this.config;
      let dpi;
      if (config.recommendDpi) dpi = config.recommendDpi;
      if (dpi) {
        dpi = `${dpi}像素/英寸`;
      } else {
        dpi = '暂无数据';
      }
      return dpi;
    },
    // 推荐psd
    psd() {
      let config = this.config;
      let psd;
      if (config.factoryProductionDocuments) psd = config.factoryProductionDocuments;
      if (psd) {
        psd = `${psd}`;
      } else {
        psd = '暂无数据';
      }
      return psd;
    },
    // 是否有psd
    isPsd() {
      let config = this.config;
      return !!config.factoryProductionDocuments;
    },
  },
  methods: {
    /**
     * 弹窗的移入事件
     * */
    boxEnter() {
      clearTimeout(this.recommend_timer);
      this.$store.commit('designApplication/setVisibleRecommend', true);
    },
    /**
     * 弹窗的移出事件
     * */
    boxLeave() {
      this.recommend_timer = setTimeout(() => {
        this.$store.commit('designApplication/setVisibleRecommend', false);
      }, 300);
    },
    /*
     * 表格的鼠标移入事件
     * -持续展示表格和推荐弹窗
     * */
    tableEnter() {
      clearTimeout(this.timer);
      this.visible = true;
      this.$emit('mEnter');
    },
    /*
     * 表格的鼠标移出事件
     * -隐藏表格
     * */
    tableLeave() {
      this.timer = setTimeout(() => {
        this.visible = false;
      }, 300);
      this.$emit('mLeave', 200);
    },
    /*
     * 版本号的鼠标移入事件
     * -展示表格
     * */
    versionEnter() {
      clearTimeout(this.timer);
      this.visible = true;
      this.$emit('mEnter');
    },
    /*
     * 版本号的鼠标移出事件
     * -隐藏表格
     * */
    versionLeave() {
      this.timer = setTimeout(() => {
        this.visible = false;
      }, 300);
    },
    /*
     * 计算right
     * */
    computedRight() {
      this.$nextTick(() => {
        this.right = -this.$refs['box-wrap'].clientWidth - 47 + 'px';
      });
    },
    /*
     * 下载psd文件
     * */
    handlerDown() {
      let config = this.config;
      let url = '/base-web/CMProductTemplateConfigDesignAct/downLoad.act';
      this.$downloadImg(url, {
        downUrl: config.factoryProductionDocuments,
        templateId: this.prod.detail.seqId,
      });
    },
  },
};
</script>

<style scoped lang="less">
.icon {
  position: absolute;
  right: -34px;
  top: 3px;
  font-size: 25px;
  color: rgb(52, 153, 251);
}
.prod-popover {
  padding: 7px;
}
.box-wrap {
  min-width: 180px;
  position: absolute;
  z-index: 11;
  right: -220px;
  top: -9px;
  background: #fff;
  padding: 9px;
  border: 1px solid #ccc;
  border-radius: 5px;
  line-height: 27px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.12),
    0 0 6px rgba(0, 0, 0, 0.04);

  font-size: 14px;
  font-weight: normal;
}
</style>
