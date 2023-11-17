<!--大图预览-->
<template>
  <el-dialog v-show="btn" :visible.sync="btn" :title="title" width="50%" append-to-body top="5vh">
    <div class="dialog-wrap">
      <!--2D-->
      <div class="preview-wrap">
        <!--大图-->
        <el-carousel class="preview-2d" :initial-index="index" :interval="50000" :autoplay="false" :loop="false" arrow="always" ref="carousel" indicator-position="outside" height="650px">
          <el-carousel-item v-for="item in multiAngleImageList" :key="item.id">
            <multiAnglePreviewBox :item="item" size="650" />
          </el-carousel-item>
        </el-carousel>

        <!--列表-->
        <div class="preview-2d-list">
          <multiAnglePreviewBox @click.native="onIndex(i)" v-for="(item, i) in multiAngleImageList" :key="`a${item.id}`" class="item-list" :class="{ active: index === i }" :item="item" size="100" />
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import multiAnglePreviewBox from './multiAnglePreviewBox.vue';
export default {
  components: { multiAnglePreviewBox },
  data() {
    return {
      index: 0, // 当前多角度的索引
      initIndex: '',
      radio1: '2D',
      btn: false, // 弹窗开关
      list: [], // 多角度列表
      title: '设计效果', // 标题
      multiAngleImageList: [], // 多角度图片列表
      modelItem: null,
      loading: false,
    };
  },
  watch: {
    initIndex: {
      handler(val) {
        if (val) {
          this.index = val;
          this.$refs.carousel?.setActiveItem(this.index);
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 轮播图切换
    onIndex(i) {
      this.index = i;
      this.$refs.carousel.setActiveItem(i);
    },
    async init(info) {
      try {
        let { type, data } = info;
        console.log('data', data);
        data.list.forEach((item, i) => {
          if (item.id === data.data.id) this.initIndex = i;
        });
        this.$nextTick(() => {
          this.onIndex(this.initIndex);
        });
        this.multiAngleImageList = data.list;
        this.btn = true;
        this.radio1 = data.type;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style scoped lang="less">
.dialog-wrap {
  position: relative;
  .header-wrap {
    position: absolute;
    z-index: 3;
    left: 44%;
    translate: -50% -50%;
    top: -50px;
    /deep/ .el-radio-button--mini .el-radio-button__inner {
      width: 110px;
    }
  }
}

.preview-wrap {
  display: flex;
  .preview-2d {
    flex: 1;
  }
  .preview-2d-list {
    width: 110px;
    height: 650px;
    overflow-y: auto;
    // 滚动条样式
    &::-webkit-scrollbar {
      width: 4px !important;
      height: 4px !important;
    }

    .active {
      border: 1px solid #4087ff !important;
    }
    .item-list {
      transition: all 0.3s;
      border: 1px solid #ccc;
      margin-bottom: 10px;
      width: fit-content;
      box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      overflow: hidden;
      &:hover {
        border: 1px solid #4087ff;
      }
    }
  }
}
</style>
