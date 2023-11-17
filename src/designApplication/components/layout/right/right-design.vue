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
      <img src="../img/后退.png" class="right-design-img" v-title="'撤销'" />

      <!--前进-->
      <img src="../img/前进.png" class="right-design-img" v-title="'前进'" />

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

    <!--多角度-->
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
import { canvasDefine } from '@/designApplication/core/canvas_2/define';
import collectPop from './collectPop.vue';
import multiAngleCard from './multiAngleCard.vue';
import designHandleCard from './designHandleCard.vue';
import designListCard from './designListCard.vue';
import store from '@/store';
import lodash from 'lodash';
import historyPop from '@/designApplication/components/layout/right/historyPop.vue';

import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';
import { SubmitParamType, ConfigurationItem } from '@/designApplication/interface_2/params';

import { buttonBlur } from '@/designApplication/core/utils/buttonBlur';
import { saveProdApi } from '@/designApplication/apis/prod';
import { saveTextWord, textToImage, textToImageUpload } from '@/designApplication/core/utils/textToImage';
import { isTemplateCanUse } from '@/designApplication/store/util';

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
  },
  methods: {
    /**
     * 保存产品
     * @param {Event} e
     * @param {Number} type 0:保存产品 1:全颜色合成 2:原胚设计
     */
    async onSave(e, type) {
      this.onBlur(e);

      const customObj = {
        static_batchid: '', //批量设计id
        asyncFlag: false, //同步-true|异步-false
        isSelf: true, //自产-true|外采-false
        adminImage: '', //是否有管理图库的设计图参与
        saveNumBtn: type, //保存类型 0:保存产品 1:全颜色合成 2:原胚设计
        isUseMirror: '0', //是否镜像设计(这个没用到) 0:否 1:是
        isNeedCopy: '0', //是否空拷贝(多面设计) 0:否 1:是
      };

      // 当前的产品数据
      const prodItem = DesignerUtil.getActiveProd();

      // 判断当前产品的设计类型是否可用
      if (!isTemplateCanUse(prodItem.config3d)) {
        this.$message.warning('该产品当前设计类型的模板已关闭，请更换其他产品设计！');
        return;
      }

      // 批量设计判断
      customObj.static_batchid = localStorage.getItem('static_batchid') || '';
      customObj.asyncFlag = true; //异步-true|同步-false
      if (customObj.static_batchid) {
        if (customObj.saveNumBtn == 1) {
          this.$message.warning('批量设计时，禁用全颜色合成！');
          return;
        }
        customObj.asyncFlag = false;
      }

      // 判断是 自产|外采
      if (prodItem.detail.templateType == 1) customObj.isSelf = false;
      if (customObj.saveNumBtn == 2) customObj.isSelf = false;

      // 设计图数量检测
      switch (customObj.isSelf) {
        // 自产
        case true:
          // 设计图数量不能为空
          const designViewList = prodItem.viewList.filter((view) => view.canvas.getImageList().length);
          if (designViewList.length === 0) {
            this.$message.warning('请至少选择一个视图进行设计，再进行保存操作！');
            return;
          }

          // 多面设计判断 (当前产品是对面设计,并且只设计了一个视图) isNeedCopy=空拷贝
          customObj.isNeedCopy = prodItem.detail.emptyCopy && prodItem.viewList.length > 1 && designViewList.length === 1 ? '1' : '';
          break;

        // 外采
        case false:
          if (customObj.saveNumBtn == 2) {
            // 原胚设计
            const isSomeImage = prodItem.viewList.some((view) => view.canvas.getImageList().length);
            if (isSomeImage) {
              this.$message.warning('原胚设计，不可以选择设计图！');
              return;
            }
          }
          break;
      }

      // 设计图碰撞检测
      const isCollide = prodItem.viewList.some((view) => view.canvas.getImageList().some((image) => image.attrs.isCollide));
      if (isCollide) {
        this.$message.warning('你所设计的图案超过了打印的区域');
        return;
      }

      // 是否有管理图库的设计图参与设计
      customObj.adminImage = prodItem.viewList.some((view) => view.canvas.getImageList().some((image) => image.attrs?.detail?.isAdminOrg));

      // 组装 接口提交的参数
      const submitParam = new SubmitParamType();
      submitParam.appearance.id = store.state.designApplication.activeColorId; //颜色id
      submitParam.defaultValues.defaultView.id = store.state.designApplication.activeViewId; //视图id
      submitParam.productType.id = prodItem.detail.id; //产品id
      submitParam.templateType = prodItem.detail.templateType; //模板类型 0:自产 1:外采
      submitParam.isUseMirror = customObj.isUseMirror; //镜像设计
      submitParam.isNeedCopy = customObj.isNeedCopy; //空拷贝
      submitParam.static_batchid = customObj.static_batchid; //批量设计id
      submitParam.saveNumBtn = customObj.saveNumBtn; //保存类型 0:保存产品 1:全颜色合成 2:原胚设计
      submitParam.adminImage = customObj.adminImage ? 1 : ''; //是否有管理图库的设计图参与设计
      submitParam.configurations = [];

      // 组装设计图
      for (let view of prodItem.viewList.toReversed()) {
        for (let image of view.canvas.getImageList()) {
          // 跳过不可见的设计
          if (!image.visible()) continue;

          // 组装设计信息
          const configurationItem = new ConfigurationItem();
          configurationItem.content.dpi = prodItem.detail.dpi; //产品dpi
          configurationItem.printArea.id = view.id; //当前设计所在的视图id

          // 获取设计信息 (设计图、文字用到)
          const result = DesignImageUtil.getImageInfo(image);
          const imgWidth = result?.width;
          const imgHeight = result?.height;
          const angle = result?.rotation;

          switch (image.attrs.name) {
            // 背景色
            case canvasDefine.bgc:
              configurationItem.type = image.attrs.name; //类型
              configurationItem.content.svg = image.attrs.fill;

              // 背景色 - offset (固定值)
              configurationItem.offset.x = 1;
              configurationItem.offset.y = 1;

              // 自定义参数 bmParam
              configurationItem.bmParam.type = canvasDefine.bgc;

              break;

            // 文字------------------------------------start
            case canvasDefine.text:
              configurationItem.type = canvasDefine.image; //类型

              // 将文字转成图片上传到服务器, 得到designId
              const { checkRes, textParam, viewWidth, viewHeight } = await textToImageUpload(image);

              // 文字 - offset (固定值)
              configurationItem.offset.x = 1;
              configurationItem.offset.y = 1;

              // 标识为 文字
              configurationItem.isText = true;
              configurationItem.textId = checkRes.seqId;

              // 自定义参数 bmParam
              configurationItem.bmParam.designId = checkRes.seqId;
              configurationItem.bmParam.type = canvasDefine.text;
              configurationItem.bmParam.textParam = textParam;

              // content 参数
              configurationItem.content.svg.image.designId = checkRes.seqId;
              configurationItem.content.svg.image.width = viewWidth;
              configurationItem.content.svg.image.height = viewHeight;
              configurationItem.content.svg.image.isBg = 0;
              configurationItem.content.svg.image.transform = `rotate(0,${viewWidth / 2},${viewHeight / 2})`;
              //文字------------------------------------end
              break;

            //设计图------------------------------------start
            case canvasDefine.image:
              configurationItem.type = image.attrs.name; //类型

              // 自定义参数 bmParam
              configurationItem.bmParam.imageCode = image.attrs.detail.imageCode;
              configurationItem.bmParam.designId = image.attrs.detail.id;

              // 设计图 - offset (x,y 的坐标)
              configurationItem.offset.x = result.x;
              configurationItem.offset.y = result.y;

              // TODO: 这个要考虑 翻转、平铺的 情况
              // 设计图 - content (width,height,scale,id等)
              configurationItem.content.svg.image.designId = image.attrs.detail.id;
              configurationItem.content.svg.image.width = imgWidth;
              configurationItem.content.svg.image.height = imgHeight;
              configurationItem.content.svg.image.isBg = Number(image.attrs.detail.isBg);
              configurationItem.content.svg.image.transform = `rotate(${angle},${imgWidth / 2},${imgHeight / 2})`;
              //设计图------------------------------------end
              break;
          }

          submitParam.configurations.unshift(configurationItem);
        }
      }

      // 空拷贝, 进入这个判断只会有一个view设计了图案
      if (customObj.isNeedCopy && customObj.isSelf) {
        // 有设计的view
        const tempView = prodItem.viewList.find((view) => view.canvas.getImageList().length);
        const tempCgs = submitParam.configurations.find((e) => e.printArea.id === tempView.id);
        for (let view of prodItem.viewList.toReversed()) {
          const imageList = view.canvas.getImageList();
          // 跳过有设计的view
          if (view.id === tempView.id) continue;

          // 复制一份
          const configurationItem = lodash.cloneDeep(tempCgs);
          configurationItem.isCopy = '1';
          configurationItem.printArea.id = view.id; //当前设计所在的视图id

          submitParam.configurations.unshift(configurationItem);
        }
      }

      // 发送提交接口
      // 往历史设计记录的弹窗插入一条loading的数据
      const historyItem = { loading: true, id: '123', imgUrl: '', name: '' };
      await this.$store.dispatch('designApplication/addHistoryItem', historyItem);
      this.$store.commit('designApplication/setLoadingSave', true);

      try {
        const res = await saveProdApi(submitParam);
        this.$message.success('保存成功');

        // 刷新历史设计记录
        this.$store.dispatch('designApplication/getHistoryList');

        // 如果有文字需要保存文字参数信息
        await saveTextWord(res, submitParam);
      } catch (err) {
        setTimeout(() => {
          this.$store.dispatch('designApplication/clearHistoryItem', historyItem);
        }, 1000);
      } finally {
        this.$store.commit('designApplication/setLoadingSave', false);
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
};
</script>

<style scoped lang="less">
@import url('./commonStyle');

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
