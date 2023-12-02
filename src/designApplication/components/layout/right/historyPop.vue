<!--历史设计记录-->
<template>
  <transition name="el-fade-in-linear">
    <div class="history-wrap" v-dragPop="{ top: 99, left: 1163 }">
      <!--头部-->
      <div class="header" slot="header">
        <div>
          我最近设计过的产品
          <span @click="getList" class="el-icon-refresh refresh"></span>
        </div>
        <div @click="onClose" class="close el-icon-close"></div>
      </div>

      <!--列表-->
      <div class="body" v-loading="loading_history">
        <box-adaptive width="33.33%" height="120%" margin="1%" v-for="item in showList">
          <div class="box-wrap" v-loading="item.loading" @mousedown.stop @click="onSel(item)">
            <!--删除按钮-->
            <el-popover popper-class="history-popover" placement="bottom" width="160" v-model="item.visible">
              <p>是否确认删除该产品？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="item.visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click.stop="onDel(item)">确定</el-button>
              </div>
              <div slot="reference" class="close el-icon-circle-close" @click.stop />
            </el-popover>

            <box-adaptive margin="0" class="pic">
              <el-image :src="item.imgUrl" />
            </box-adaptive>
            <div class="title">{{ item.code }}</div>
          </div>
        </box-adaptive>

        <!--空盒子-->
        <box-adaptive width="33.33%" height="120%" margin="1%" v-for="item in 6 - showList.length" />
      </div>

      <!--分页-->
      <div class="footer">
        <pageContainer @mousedown.native.stop :param="params" :total="total" />
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';
import pageContainer from '@/designApplication/components/page.vue';
import dragPop from '@/designApplication/core/utils/directives/drag/drag';
import lodash from 'lodash';

import { delHistoryApi, getHistoryDetailApi } from '@/designApplication/apis/prod';
import { getCommonProdListApi } from '@/designApplication/apis/common';
import { getImageListApi } from '@/designApplication/apis/image';

import { CommonProdParams } from '@/designApplication/interface/commonProdParams';
import { ImageListParams } from '@/designApplication/interface/image/imageListParams';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';
import { getPositionCenter, setTextAttrs } from '@/designApplication/core/canvas_2/konvaCanvasAddHelp';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import store from '@/store';
import { TileUtil } from '@/designApplication/components/layout/right/hoverComponents/tileUtil';

export default {
  directives: { dragPop },
  components: {
    pageContainer,
  },
  data() {
    return {
      /**
       * @type {import('@/design').HistoryItem[]}
       */
      params: {
        pageNum: 1,
        pageSize: 6,
      },
    };
  },
  computed: {
    ...mapState({
      visible_history: (state) => state.designApplication.visible_history,
      loading_history: (state) => state.designApplication.loading_history,
      historyList: (state) => state.designApplication.historyList,
    }),
    total() {
      return this.historyList.length;
    },
    showList() {
      return this.historyList.slice((this.params.pageNum - 1) * this.params.pageSize, this.params.pageNum * this.params.pageSize);
    },
  },
  methods: {
    /**
     * 渲染产品
     */
    async dispose_prod(prodCode) {
      // 获取产品详情
      const param = new CommonProdParams();
      param.tempalteNoOrName = prodCode;
      const prodList = await getCommonProdListApi(param);
      if (prodList.total === 0) {
        this.$message.warning(`未找到产品${prodCode}`);
        return;
      }
      const prodDetail = prodList.list[0];

      // 渲染产品
      await this.$store.dispatch('designApplication/setProd', prodDetail);
      // console.log('产品详情', prodDetail);
    },
    /**
     * 处理背景色
     */
    async dispose_bgc(bgcList) {
      if (!bgcList.length) return;
      DesignerUtil.setBgc(bgcList[0].content.svg);
    },
    /**
     * 处理文字
     */
    async dispose_text(textList) {
      if (textList.length === 0) return;

      for (let item of textList) {
        const viewId = item.printArea.id;
        const view = DesignerUtil.getView(viewId);
        const param = {
          view: view,
          param: {
            view: view,
            staticView: DesignerUtil.getStaticView(view.id),
          },
          text: item.bmParam.textParam.text,
        };
        const text = await view.canvas.addText(param);

        // text.setAttrs(item.bmParam.textParam);
        text.setAttrs({
          scaleX: item.bmParam.textParam.scaleX,
          scaleY: item.bmParam.textParam.scaleY,
          x: item.bmParam.textParam.x,
          y: item.bmParam.textParam.y,
        });
        setTextAttrs(text, item.bmParam.textParam);
        DesignImageUtil.rotation(text, item.bmParam.textParam.rotation);
      }
    },
    /**
     * 处理设计图
     */
    async dispose_image(designList) {
      if (!designList.length) return;

      const errorImageList = [];
      const successImageList = [];
      const imageCodeList = [...new Set(designList.map((e) => e.bmParam.imageCode))];

      // 获取设计图详情
      for (let imageCode of imageCodeList) {
        const imageParam = new ImageListParams();
        imageParam.query = imageCode;
        const resImage = await getImageListApi(imageParam);
        if (resImage.total === 0) {
          errorImageList.push(imageCode);
          continue;
        }
        // 成功还能访问的设计图
        successImageList.push(resImage.list[0]);
      }

      if (errorImageList.length) {
        this.$message.warning(`未找到${errorImageList.length}张设计图`);
      }

      // console.log('成功列表 addImage的详情', successImageList);

      // 渲染设计图
      for (let item of designList) {
        const imageDetail = successImageList.find((e) => e.imageCode === item.bmParam.imageCode);
        if (!imageDetail) console.error('未找到设计图', item.bmParam.imageCode);
        const viewId = item.printArea.id;
        // 将设计图插入到画布
        const image = await this.$store.dispatch('designApplication/setImage', { detail: imageDetail, viewId: viewId });

        let rotate;
        let scaleX;
        let scaleY;
        let x;
        let y;

        // 平铺
        if (item.bmParam.isTile) {
          rotate = item.bmParam.imgParam.angle;
          scaleX = item.bmParam.imgParam.scaleX;
          scaleY = item.bmParam.imgParam.scaleY;
          x = item.bmParam.imgParam.x;
          y = item.bmParam.imgParam.y;

          Object.assign(store.state.designApplication.tile, item.bmParam.tileParam);
          TileUtil.add(image);
        } else {
          // 解析坐标和角度和缩放
          const transform = item.content.svg.image.transform.replace('rotate(', '').replace(')', '').split(',');
          if (transform.length > 0) {
            rotate = transform[0];
          } else {
            rotate = 0;
          }

          scaleX = (item.content.svg.image.width / image.attrs.param.width) * image.scaleX();
          scaleY = (item.content.svg.image.height / image.attrs.param.height) * image.scaleY();

          x = item.offset.x;
          y = item.offset.y;
        }

        // 设置旋转
        DesignImageUtil.rotation(image, rotate);

        // 设置缩放
        image.setAttrs({
          scaleX: scaleX,
          scaleY: scaleY,
        });

        // 设置坐标
        const { leftTopX, leftTopY } = getPositionCenter(image);
        image.setAttrs({
          x: leftTopX + x,
          y: leftTopY + y,
        });
      }

      // 设置翻转
      if (item.bmParam.isFlipX) {
        DesignImageUtil.flipX(image);
      }
      if (item.bmParam.isFlipY) {
        DesignImageUtil.flipY(image);
      }
    },
    /**
     * 选中
     */
    async onSel(data) {
      // 获取历史记录中的 提交数据 的详情
      const res = await getHistoryDetailApi(data.id);
      // console.log('历史记录详情', res);

      // 渲染产品
      await this.dispose_prod(res.productType.id);

      // 渲染设计图
      // console.log('设计图列表', res.configurations);

      // 处理设计图类型 (这个只处理 设计图)
      const designList = res.configurations.filter((e) => e.bmParam.type === 'img' && !e.isCopy);
      await this.dispose_image(designList);

      // 处理文字类型
      const textList = res.configurations.filter((e) => e.bmParam.type === canvasDefine.text);
      await this.dispose_text(textList);

      // 处理背景色
      const bgcList = res.configurations.filter((e) => e.bmParam.type === canvasDefine.bgc);
      await this.dispose_bgc(bgcList);
    },
    /**
     * 删除历史记录
     */
    async onDel(data) {
      try {
        data.visible = false;
        data.loading = true;
        await delHistoryApi(data.id);
        this.$store.dispatch('designApplication/clearHistoryItem', { id: data.id });
      } finally {
        data.loading = false;
      }
    },

    /**
     * 关闭弹窗
     */
    onClose() {
      this.$store.commit('designApplication/setHistoryVisible', false);
    },
    /**
     * 获取历史记录列表
     */
    getList() {
      this.$store.dispatch('designApplication/getHistoryList');
    },
  },
};
</script>

<style scoped lang="less">
.history-wrap {
  width: 350px;
  position: absolute;
  //top: 0;
  //left: -355px;
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

    .refresh {
      cursor: pointer;
    }

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

    .box-wrap {
      transition: all 0.3s;
      border: 1px solid #eee;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      &:hover {
        border-color: #409eff;
      }

      .close {
        position: absolute;
        right: 4px;
        top: 4px;
        cursor: pointer;
        font-size: 16px;
        z-index: 2;
        color: #333;
        &:hover {
          color: #409eff;
        }
      }

      .pic {
        cursor: pointer;
        user-select: none;
      }

      .title {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 21px;
      }
    }
  }

  .footer {
    height: 30px;
    //background-color: green;
    margin-top: 8px;
    margin-bottom: 5px;
  }
}
</style>
