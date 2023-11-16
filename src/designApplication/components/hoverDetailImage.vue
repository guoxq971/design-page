<!--鼠标经过的浮框 - 设计图-->
<template>
  <el-card class="hover-container image-group">
    <!--图片-->
    <div class="image-wrap">
      <!--previewImg or designImg-->
      <img v-if="detail.previewImg" class="image" :src="detail.previewImg" alt="" />
      <img v-else :src="detail.designImg" alt="" />
    </div>

    <div class="title">{{ title }}</div>
    <div class="line-wrap">
      <div class="id">(ID: {{ detail.imageCode }})</div>
      <div class="tags" v-if="detail.isHasRisk">
        <el-tag type="danger" v-if="detail.highRiskWords && detail.highRiskWords.length">风险</el-tag>
        <el-tag type="warning" v-else-if="detail.highRiskWords && detail.lowRiskWords.length">风险</el-tag>
      </div>
      <div class="orderNums" style="text-align: right; padding-right: 5px">
        单数:
        <el-tag type="danger" v-if="1 == 1">
          {{ detail.orderNums ? detail.orderNums : 0 }}
        </el-tag>
      </div>
    </div>
    <div style="white-space: nowrap">
      规格:
      <span class="font-color">{{ detail.size.width }}</span>
      *
      <span class="font-color">{{ detail.size.height }}</span>
      {{ detail.size.unit }}
      <span v-if="detail.dpi">({{ detail.dpi }}dpi)</span>
      <!--previewImg or designImg-->
      <span v-if="detail.previewImg">(.{{ detail.previewImg.split('.').pop() }})</span>
      <span v-else>(.{{ detail.designImg.split('.').pop() }})</span>
    </div>
    <div class="label-wrap" v-if="detail.description">
      <span style="white-space: nowrap">标签:</span>
      <span class="img-label">{{ detail.description }}</span>
    </div>
    <template v-if="detail.isRisk == 1 && (detail.highRiskWords.length || detail.lowRiskWords.length)">
      <el-divider></el-divider>
      <!--风险词-->
      <div class="keyword-wrap">
        <div class="high" v-if="detail.highRiskWords && detail.highRiskWords.length">
          <div class="keyword-title">
            <div class="chunk high-chunk"></div>
            <div>高风险词:</div>
          </div>
          <div class="text-wrap">{{ detail.highRiskWords }}</div>
        </div>
        <div class="low" v-if="detail.lowRiskWords.length">
          <div class="keyword-title">
            <div class="chunk low-chunk"></div>
            <div>低风险词:</div>
          </div>
          <div class="text-wrap">{{ detail.lowRiskWords }}</div>
        </div>
      </div>
    </template>
  </el-card>
</template>

<script>
import { ImageListByMyImage } from '@/designApplication/interface/image/imageList';

export default {
  props: {
    /**
     * @class ImageListByMyImage
     * @description 图片详情
     * */
    detail: { type: Object, default: () => ({}) },
  },
  computed: {
    title() {
      let title = '';
      if (this.detail.description) {
        title = this.detail.description;
      } else if (this.detail.name) {
        title = this.detail.name;
      } else if (this.detail.imageName) {
        title = this.detail.imageName;
      }
      return title;
    },
  },
};
</script>

<style scoped lang="less">
.hover-container {
  position: absolute;
  z-index: 7;
  top: -53px;
  right: -277px;
  width: 265px;

  /deep/ .el-card__body {
    padding: 7px;
  }

  .image-wrap {
    position: relative;
    width: 100%;
    height: 245px;
    background-color: #f5f7fa;
    border-radius: 4px;
    overflow: hidden;

    .image {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      //height: 100%;
      // 居中
      transform: translateY(-50%);
    }
  }

  .title {
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// 设计图
.image-group {
  .font-color {
    color: #4087ff;
  }

  // 设计图-标签超出省略号
  .img-label {
    display: inline-block;
    max-height: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
  }
  .text-wrap {
    word-wrap: break-word;
  }

  ::v-deep .el-divider--horizontal {
    margin: 8px 0;
  }

  // id + 标签(icon)
  .line-wrap {
    display: flex;
    height: 24px;
    align-items: center;

    .id {
      color: #c0c4cc;
    }

    .tags {
      display: flex;
      margin-left: 7px;
    }
  }

  // 标签
  .label-wrap {
    word-wrap: break-word;
  }

  // 风险词
  .keyword-wrap {
    .keyword-title {
      display: flex;
      align-items: center;
    }

    .chunk {
      width: 6px;
      height: 15px;
      margin-right: 4px;
      border-radius: 2px;
    }
    .high {
      .high-chunk {
        background-color: red;
      }
    }

    .low {
      .low-chunk {
        background-color: #ffff00;
      }
    }
  }
}
</style>
