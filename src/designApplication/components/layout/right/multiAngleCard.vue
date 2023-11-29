<template>
  <el-card class="one-handle" shadow="never">
    <div style="width: 100%; position: relative">
      <!--渲染按钮-->
      <el-button style="position: absolute; top: 0; left: 0; z-index: 3" type="primary" @click="onRender" :loading="loading">渲染</el-button>
      <!--空-->
      <el-empty description="暂无多角度" v-if="!multiAngleList.length" />
      <!--多角度-->
      <el-carousel style="width: 100%" :interval="50000" :autoplay="false" :loop="false" arrow="always" ref="carousel" indicator-position="outside" v-else>
        <el-carousel-item v-for="item in multiAngleList" :key="item.id" @click.native="onClick(item)">
          <!--简单多角度-->
          <multiAngleFold cursorZoomIn typeName="简单" v-if="!item.composeId" :image="item.bgImg" :mask="item.designImg" :texture="item.prodImg" />
          <!--复杂多角度-->
          <template v-else>
            <multiAngleFold cursorZoomIn typeName="复杂" :image="item.bgImg" :mask="item.designImg" :texture="item.prodImg" />
          </template>
        </el-carousel-item>
      </el-carousel>
    </div>

    <multiAnglePreviewDialog ref="multiAnglePreviewDialog" />
  </el-card>
</template>

<script>
import multiAnglePreviewDialog from './multiAnglePreviewDialog.vue';
import multiAngleFold from '@/designApplication/components/multiAngleFold.vue';
import { mapGetters, mapState } from 'vuex';
import { getSaveProdParam } from '@/designApplication/core/utils/saveProd';
import { fetchRenderMultiApi } from '@/designApplication/apis/prod';

export default {
  name: 'multiAngleCard',
  components: { multiAngleFold, multiAnglePreviewDialog },
  data() {
    return {
      renderMultiList: [],
      loading: false,
    };
  },
  computed: {
    ...mapState({
      activeColorId: (state) => state.designApplication.activeColorId,
    }),
    ...mapGetters({
      activeProdStatic: 'designApplication/activeProdStatic',
    }),
    /**
     * 多角度列表
     */
    multiAngleList() {
      // 获取当前激活颜色的多角度
      const appearance = this.activeProdStatic?.prod.detail.appearances.find((e) => e.id == this.activeColorId);
      if (!appearance) return [];

      // 简单多角度
      const simple = appearance?.multiAngleImages || [];
      // 复杂多角度
      const complex = this.complexMultiDispose(appearance.multiAngleImages4Compose);
      const resultList = [...simple, ...complex];
      const list = resultList.map((item) => {
        let {
          composeId, //复杂
          multiId, //简单
        } = item;
        let designImg = this.findMultiDesignImg(this.renderMultiList, composeId, multiId);
        // 顺序 = image - mask - texture
        // image = background_white_positive
        // mask = mask_white_positive
        // texture = public_texture_white_positive [这张不需要]
        let result = {
          multiId: item.multiId, // 排序id
          composeId: item.composeId,
          id: item.multiId,
          bgImg: item.image,
          designImg: null,
          prodImg: null,
        };
        if (composeId) {
          // 复杂
          result.designImg = item.mask;
          result.prodImg = designImg;
        } else {
          // 简单
          result.designImg = designImg || '';
          result.prodImg = item.mask;
        }
        return result;
      });
      list.sort((a, b) => a.multiId - b.multiId);

      return list;
    },
  },
  methods: {
    onClick(data) {
      this.$refs.multiAnglePreviewDialog.init({
        data: { data, list: this.multiAngleList, type: '2D' },
      });
    },
    /**
     * 渲染多角度
     */
    async onRender() {
      try {
        this.loading = true;
        const param = await getSaveProdParam();
        this.renderMultiList = await fetchRenderMultiApi(param);
      } finally {
        this.loading = false;
      }
    },
    /**
     * 复杂多角度处理
     * @param {array} list 图片列表
     * @return {array} resultList 处理后的图片列表
     * */
    complexMultiDispose(list) {
      // 打上组的标签 composeGroup
      list.forEach((item) => (item.composeGroup = item.composeId.split('')[0]));
      // 按标签分组存在 map
      let resultMap = new Map();
      list.forEach((e) => {
        if (!resultMap.has(e.composeGroup)) {
          resultMap.set(e.composeGroup, [e]);
        } else {
          let d = resultMap.get(e.composeGroup);
          d.push(e);
          resultMap.set(e.composeGroup, d);
        }
      });
      let tempList = [...resultMap.values()];
      let resultList = [];
      // 取组的第一个为首选，其余放在字段 multiList 中
      tempList.forEach((e) => resultList.push({ ...e[0], multiList: e }));
      return resultList;
    },
    /**
     * 查找多角度设计图
     * @param {array} multiDesignImgList 多角度设计图组
     * @param {string} composeId 产品的composeId
     * @param {string} multiId 产品的多角度id
     * @return {string} url 设计图的url
     * */
    findMultiDesignImg(multiDesignImgList, composeId, multiId) {
      let url = '';
      // 复杂多角度查找
      if (composeId) {
        let d = multiDesignImgList.find((e) => e.composeId == composeId);
        if (d) url = d.img;
      }
      // 简单多角度查找
      else {
        let d = multiDesignImgList.find((e) => e.multiId == multiId);
        if (d) url = d.img;
      }
      return url;
    },
  },
};
</script>

<style scoped lang="less">
@import url('./commonStyle');

/*多角度-start*/
::v-deep .el-carousel__indicators--outside {
  button {
    background-color: #4087ff;
  }
}
::v-deep .el-carousel__button {
  height: 4px;
}

::v-deep .el-carousel__container {
  height: 350px;
}

::v-deep .el-carousel__item {
  display: flex;
  justify-content: center;
  align-items: center;
}

// 多角度-左右切换按钮
::v-deep .el-carousel__arrow {
  background-color: #1f2d3d7d;
}

/*多角度-end*/
</style>
