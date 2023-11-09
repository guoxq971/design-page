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
      <el-button :loading="loadingSave" class="btn btn2 btn5 btn6 save-btn" type="warning" @click="(e) => onSave(e, 1)" v-title="'全颜色合成'">全颜色合成</el-button>

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
    <el-card class="one-handle handle2" shadow="never">
      <!--图层置顶-->
      <img src="../img/图层置顶.png" class="right-design-img" v-title="'图层置顶'" @click="onImageTop" />
      <!--图层置底-->
      <img src="../img/图层置底.png" class="right-design-img" v-title="'图层置底'" @click="onImageBottom" />
      <!--图层上移-->
      <img src="../img/图层上移.png" class="right-design-img" v-title="'图层上移'" @click="onImageUp" />
      <!--图层下移-->
      <img src="../img/图层下移.png" class="right-design-img" v-title="'图层下移'" @click="onImageDown" />
      <!--复制图层-->
      <img src="../img/复制图层.png" class="right-design-img" v-title="'复制图层'" @click="onImageCopy" />
      <!--删除图层-->
      <img src="../img/删除图层.png" class="right-design-img" v-title="'删除图层'" @click="onImageDelete" />
      <!--水平居中-->
      <img src="../img/水平居中.png" class="right-design-img" v-title="'水平居中'" @click="onImagePositionHorizontal" />
      <!--垂直居中-->
      <img src="../img/垂直居中.png" class="right-design-img" v-title="'垂直居中'" @click="onImagePositionVertical" />
      <!--水平翻转-->
      <img src="../img/水平翻转.png" class="right-design-img" v-title="'水平翻转'" />
      <!--垂直翻转-->
      <img src="../img/垂直翻转.png" class="right-design-img" v-title="'垂直翻转'" />
      <!--放大-->
      <img src="../img/放大.png" class="right-design-img" v-title="'放大'" @click="onImageScaleUp" />
      <!--缩小-->
      <img src="../img/缩小.png" class="right-design-img" v-title="'缩小'" @click="onImageScaleDown" />
      <!--左旋45-->
      <img src="../img/左旋45°.png" class="right-design-img" v-title="'左旋45'" @click="onImageRotateDown" />
      <!--右旋45-->
      <img src="../img/右旋45°.png" class="right-design-img" v-title="'右旋45'" @click="onImageRotateUp" />
      <!--最大化-->
      <hoverScale class="right-design-img" />
      <!--平铺-->
      <hoverTile class="right-design-img" />
      <!--位置-->
      <div class="right-design-img" v-title="'位置'">
        <span class="el-icon-aim" style="font-size: 27px" />
      </div>
    </el-card>

    <!--设计图列表-->
    <el-collapse-transition>
      <el-card v-show="visible_layer" class="one-handle" shadow="never" v-if="imageList.length">
        <div class="design-group">
          <div class="design-wrap" v-for="(item, index) in imageList" :class="{ active: item.attrs.uuid === activeView.activeImageUuid }">
            <div class="wrap">
              <!--设计图-->
              <div v-if="item.attrs.name === canvasDefine.image" class="design-bd" @click="onSetActiveImage(item)">
                <div class="design">
                  <el-image :src="item.attrs.fillPatternImage.src" style="width: 100%; height: 100%" />
                </div>
                <div class="title">{{ item.attrs.detail.name }}</div>
              </div>

              <!--背景色-->
              <template v-if="item.attrs.name === canvasDefine.bgc">
                <div class="design">
                  <div style="width: 100%; height: 100%" :style="{ backgroundColor: item.attrs.fill }" />
                </div>
              </template>
            </div>

            <div class="handle">
              <template v-if="[canvasDefine.image].includes(item.attrs.name)">
                <!--图层-上移-->
                <div class="layer-btn" v-title="'图层-上移'" @click="onLayerUp(item)">
                  <img src="../img/图层上移.png" />
                </div>
                <!--图层-下移-->
                <div class="layer-btn" v-title="'图层-下移'" @click="onLayerDown(item)">
                  <img src="../img/图层下移.png" />
                </div>
              </template>
              <!--图层-编辑-->
              <div class="layer-btn" v-title="'图层-编辑'">
                <iconpark-icon name="write" size="20" />
              </div>
              <template v-if="item.attrs.type === canvasDefine.image">
                <!--图层-收藏-->
                <div class="layer-btn" v-title="'图层-收藏'" @click="onImageCollect(item)">
                  <iconpark-icon name="rss" size="20" :style="{ color: DesignImageUtil.hasCollect(item) ? '#4087ff' : '' }" />
                </div>
              </template>
              <!--图层-删除-->
              <div class="layer-btn" v-title="'图层-删除'" @click="onLayerDel(item)">
                <img src="../img/删除图层.png" />
              </div>
              <!--图层-显示隐藏-->
              <div class="layer-btn" v-title="'图层显示隐藏'" @click="onLayerVisible(item)">
                <template v-if="item.attrs.visible">
                  <iconpark-icon name="preview-open" size="20" />
                </template>
                <template v-else>
                  <iconpark-icon name="preview-close" size="20" />
                </template>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </el-card>
    </el-collapse-transition>

    <!--多角度-->
    <el-card class="one-handle" shadow="never">
      <div style="width: 100%; position: relative">
        <!--渲染按钮-->
        <el-button style="position: absolute; top: 0; left: 0; z-index: 3" type="primary">渲染</el-button>
        <!--空-->
        <el-empty description="暂无多角度" v-if="!multiAngleList.length" />
        <!--多角度-->
        <el-carousel style="width: 100%" :interval="50000" :autoplay="false" :loop="false" arrow="always" ref="carousel" indicator-position="outside" v-else>
          <el-carousel-item v-for="item in multiAngleList" :key="item.id">
            <!--简单多角度-->
            <multiAngleFold cursorZoomIn typeName="简单" v-if="!item.composeId" :image="item.bgImg" :mask="item.designImg" :texture="item.prodImg" />
            <!--复杂多角度-->
            <template v-else>
              <multiAngleFold cursorZoomIn typeName="复杂" :image="item.bgImg" :mask="item.designImg" :texture="item.prodImg" />
            </template>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-card>

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
import store from '@/store';
import historyPop from '@/designApplication/components/layout/right/historyPop.vue';

import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';
import { SubmitParamType, ConfigurationItem } from '@/designApplication/interface_2/params';

import { buttonBlur } from '@/designApplication/core/utils/buttonBlur';
import { uuid } from '@/designApplication/core/utils/uuid';
import { collectImageFn } from '@/designApplication/core/utils/common';
import { saveProdApi } from '@/designApplication/apis/prod';
import { getAngleMultiple, setProxyTransformer } from '@/designApplication/core/canvas_2/konvaCanvasAddHelp';

export default {
  name: 'right-design',
  directives: { title },
  components: {
    multiAngleFold,
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
    ...mapState({
      visible_layer: (state) => state.designApplication.visible_layer,
      visible_history: (state) => state.designApplication.visible_history,
      visible_collect: (state) => state.designApplication.visible_collect,
      loadingSave: (state) => state.designApplication.loading_save,
      activeViewId: (state) => state.designApplication.activeViewId,
      activeColorId: (state) => state.designApplication.activeColorId,
      collectImageList: (state) => state.designApplication.collectImageList,
    }),
    ...mapGetters({
      activeProdStatic: 'designApplication/activeProdStatic',
    }),
    activeView() {
      return DesignerUtil.getView(this.activeViewId);
    },
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
        // let { multiAngleList } = this.prod; // 请求回来的 多角度列表
        const multiAngleList = [];
        let designImg = this.findMultiDesignImg(multiAngleList, composeId, multiId);
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
    /**
     * 设计图列表
     * */
    imageList() {
      return this.activeView?.canvas?.getImageList() || [];
    },
  },
  methods: {
    /**
     * 历史设计记录
     */
    onHistory(e) {
      this.onBlur(e);
      this.$store.commit('designApplication/setHistoryVisible', !this.visible_history);
    },
    /**
     * 保存产品
     * @param {Event} e
     * @param {Number} type 0:保存产品 1:全颜色合成 2:原胚设计
     */
    async onSave(e, type) {
      this.onBlur(e);
      const obj = {
        static_batchid: '', //批量设计id
        asyncFlag: false, //同步-true|异步-false
        isSelf: true, //自产-true|外采-false
        adminImage: false, //是否有管理图库的设计图参与
        saveNumBtn: type, //保存类型 0:保存产品 1:全颜色合成 2:原胚设计
        isUseMirror: '0', //是否镜像设计(这个没用到) 0:否 1:是
        isNeedCopy: '0', //是否空拷贝(多面设计) 0:否 1:是
      };

      // 当前的产品数据
      const prodItem = DesignerUtil.getActiveProd();

      // 批量设计判断
      obj.static_batchid = localStorage.getItem('static_batchid') || '';
      obj.asyncFlag = true; //异步-true|同步-false
      if (obj.static_batchid) {
        if (obj.saveNumBtn == 1) {
          this.$message.warning('批量设计时，禁用全颜色合成！');
          return;
        }
        obj.asyncFlag = false;
      }

      // 判断是 自产|外采
      if (prodItem.detail.templateType == 1) obj.isSelf = false;
      if (obj.saveNumBtn == 2) obj.isSelf = false;

      // 设计图数量检测
      switch (obj.isSelf) {
        // 自产
        case true:
          // 设计图数量不能为空
          const designViewList = prodItem.viewList.filter((view) => view.canvas.getImageList().length);
          if (designViewList.length === 0) {
            this.$message.warning('请至少选择一个视图进行设计，再进行保存操作！');
            return;
          }

          // 多面设计判断 (当前产品是对面设计,并且只设计了一个视图)
          obj.isNeedCopy = prodItem.detail.emptyCopy && prodItem.viewList.length > 1 && designViewList.length === 1 ? '1' : '0';
          break;

        // 外采
        case false:
          // TODO: configurations的判断
          if (obj.saveNumBtn == 2) {
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
      obj.adminImage = prodItem.viewList.some((view) => view.canvas.getImageList().some((image) => image.attrs?.detail?.isAdminOrg));

      // 组装 o
      const submitParam = new SubmitParamType();
      submitParam.appearance.id = store.state.designApplication.activeColorId;
      submitParam.defaultValues.defaultView.id = store.state.designApplication.activeViewId;
      submitParam.productType.id = prodItem.detail.id;
      submitParam.templateType = prodItem.detail.templateType;
      submitParam.isUseMirror = obj.isUseMirror;
      submitParam.isNeedCopy = obj.isNeedCopy;
      submitParam.static_batchid = obj.static_batchid;
      submitParam.saveNumBtn = obj.saveNumBtn;
      submitParam.adminImage = obj.adminImage ? 1 : 0;
      submitParam.configurations = [];

      // 组装设计图
      for (let view of prodItem.viewList) {
        for (let image of view.canvas.getImageList()) {
          // console.log(image);

          // 设计图数据解析
          const imgWidth = image.width() * image.scaleX();
          const imgHeight = image.height() * image.scaleY();
          const angle = image.rotation() < 0 ? 360 + image.rotation() : image.rotation();

          // 存储的item
          const configurationItem = new ConfigurationItem();
          configurationItem.printArea.id = view.id;

          // 设计图 - offset (x,y 的坐标)
          configurationItem.offset.x = image.x() - imgWidth / 2;
          configurationItem.offset.y = image.y() - imgHeight / 2;

          // TODO: 这个要考虑 翻转图片、平铺图片、文字、背景图的 情况
          // TODO: 要考虑 obj.isNeedCopy === '1' 的情况
          // 设计图 - content (width,height,scale,id等)
          configurationItem.content.dpi = prodItem.detail.dpi;
          configurationItem.content.svg.image.designId = image.attrs.detail.id;
          configurationItem.content.svg.image.width = imgWidth;
          configurationItem.content.svg.image.height = imgHeight;
          configurationItem.content.svg.image.isBg = image.attrs.detail.isBg;
          configurationItem.content.svg.image.transform = `rotate(${angle},${imgWidth / 2},${imgHeight / 2})`;

          submitParam.configurations.push(configurationItem);
        }
      }

      console.log(submitParam);

      try {
        const historyItem = { loading: true, id: '123', imgUrl: '', name: '' };
        this.$store.commit('designApplication/addHistoryItem', historyItem);
        this.$store.commit('designApplication/setLoadingSave', true);
        const res = await saveProdApi(submitParam);
        this.$store.dispatch('designApplication/getHistoryList');
        this.$message.success('保存成功');
      } finally {
        this.$store.commit('designApplication/setLoadingSave', false);
      }
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
    onCollect(e) {
      this.onBlur(e);
      this.$store.commit('designApplication/setVisibleCollect', !this.visible_collect);
    },
    /**
     * 设计图操作 - 收藏
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    async onImageCollect(image) {
      const detail = image.attrs.detail;
      await collectImageFn(detail);
    },
    /**
     * 设计图操作 - 复制
     */
    async onImageCopy() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      if (image.attrs.type === canvasDefine.image) {
        const konvaCanvas = image.attrs.konvaCanvas;
        const copyImage = image.clone();
        const copyTransformer = image.attrs.transformer.clone();

        // 选中框
        copyTransformer.setAttr('visible', false);
        setProxyTransformer(copyTransformer, copyImage);
        copyTransformer.nodes([copyImage]);

        // 设计图
        copyImage.setAttrs({
          uuid: uuid(),
          x: image.attrs.x + 10,
          y: image.attrs.y + 10,
          transformer: copyTransformer,
        });

        konvaCanvas.clip.add(copyImage);
        konvaCanvas.layer.add(copyTransformer);

        await this.$nextTick();
        // 碰撞检测
        DesignImageUtil.isCollide(copyImage);
      }
    },
    /**
     * 设计图操作 - 左旋转
     */
    async onImageRotateDown() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.rotation(image, getAngleMultiple(image.rotation(), 'left'));

      await this.$nextTick();
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
    /**
     * 设计图操作 - 右旋转
     */
    async onImageRotateUp() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.rotation(image, getAngleMultiple(image.rotation(), 'right'));

      await this.$nextTick();
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
    /**
     * 设计图操作 - 放大
     */
    async onImageScaleUp() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.scaleUp(image);

      await this.$nextTick();
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
    /**
     * 设计图操作 - 缩小
     */
    async onImageScaleDown() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.scaleDown(image);

      await this.$nextTick();
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
    /**
     * 设计图操作 - 水平居中
     */
    async onImagePositionHorizontal() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.positionHorizontalCenter(image);

      await this.$nextTick();
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
    /**
     * 设计图操作 - 垂直居中
     */
    async onImagePositionVertical() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.positionVerticalCenter(image);

      await this.$nextTick();
      // 碰撞检测
      DesignImageUtil.isCollide(image);
    },
    /**
     * 设计图操作 - 移除
     */
    async onImageDelete() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.deleteImage(image);
    },
    /**
     * 设计图操作 - 上移动
     */
    async onImageUp() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.layerMoveUp(image);
    },
    /**
     * 设计图操作 - 下移动
     */
    async onImageDown() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.layerMoveDown(image);
    },
    /**
     * 设计图操作 - 置底
     */
    async onImageBottom() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.layerMoveBottom(image);
    },
    /**
     * 设计图操作 - 置顶
     */
    async onImageTop() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      DesignImageUtil.layerMoveTop(image);
    },
    /**
     * 设置设计图 - 激活
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    onSetActiveImage(image) {
      DesignImageUtil.setActiveImage(image);
    },
    /**
     * 设计图操作 - 上移动
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    onLayerUp(image) {
      if (image.attrs.name === canvasDefine.image) {
        DesignImageUtil.layerMoveUp(image);
      }
    },
    /**
     * 设计图操作 - 下移动
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    onLayerDown(image) {
      if (image.attrs.name === canvasDefine.image) {
        DesignImageUtil.layerMoveDown(image);
      }
    },
    /**
     * 设计图操作 - 移除
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    onLayerDel(image) {
      if (image.attrs.name === canvasDefine.image) {
        DesignImageUtil.deleteImage(image);
      }
    },
    /**
     * 设计图操作 - 显示|隐藏
     * @param {import('@/design').CanvasDesign} image 设计图对象
     */
    onLayerVisible(image) {
      switch (image.attrs.name) {
        case canvasDefine.image:
          DesignImageUtil.setImageVisible(image);
          break;
        case canvasDefine.bgc:
          break;
        default:
          break;
      }
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
    /*
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

    /*
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

/*多角度-start*/
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
/*多角度-end*/

::v-deep .el-carousel__indicators--outside {
  button {
    background-color: #4087ff;
  }
}

// 多角度-左右切换按钮
::v-deep .el-carousel__arrow {
  background-color: #1f2d3d7d;
}

.hover-color {
  color: #409eff !important;
  border-color: #c6e2ff !important;
  background-color: #ecf5ff !important;
}

/deep/ .el-card__body {
  padding: 4px;
}
.handle2 {
  /deep/ .el-card__body {
    display: flex;
    flex-wrap: wrap;
  }
}
@width: 50px;
@margin: 4px 5px;
.one-handle {
  /deep/ .el-card__body {
    display: flex;
    align-items: center;
  }
  .btn {
    width: @width;
    height: 36px;
    margin: @margin !important;
    border-radius: 3px;
    padding: 7px 13px;
    cursor: pointer;
    position: relative;
  }

  .btn2 {
    width: fit-content;
  }

  .btn3 {
    height: calc(@width - 2px);
  }

  .btn4 {
    height: calc(@width - 2px);
    margin: @margin !important;
  }

  .btn5 {
    width: 80px;
  }

  .btn6 {
    padding: 7px 9px;
  }

  .right-design-img {
    position: relative;
    cursor: pointer;
    width: @width;
    height: calc(@width - 2px);
    margin: @margin !important;
    border-radius: 3px;
    border: 1px solid #dcdfe6;
    display: flex;
    justify-content: center;
    align-items: center;
    letter-spacing: 2px;

    &:hover {
      border: 1px solid #409eff;
    }
  }

  // 设计图列表
  .design-group {
    width: 100%;
    @designWidth: 36px; // 设计图宽度
    @designHeight: 36px; // 设计图高度
    @designPadding: 5px; // 行内边距
    @designMarginBottom: 4px; // 行下间距
    @borderWidth: 2px; // 边框宽度
    @num: 3.5; // 展示的数量
    max-height: calc((@designHeight + @designPadding * 2 + @borderWidth * 2 + @designMarginBottom) * @num);
    overflow-y: auto;

    .active {
      border: 2px solid #409eff !important;
    }
    .design-wrap {
      width: 100%;
      height: calc(@designHeight + @designPadding * 2 + @borderWidth * 2);
      display: flex;
      padding: @designPadding;
      border: @borderWidth solid #eee;
      border-radius: 4px;
      margin-bottom: @designMarginBottom;
      &:last-child {
        margin-bottom: 0;
      }

      .wrap {
        display: flex;
        cursor: pointer;
      }
      .design-bd {
        width: fit-content;
        display: flex;
      }
      .design {
        width: @designWidth;
        height: @designHeight;
        //background-color: red;
      }
      .title {
        width: 80px;
        height: @designHeight;
        display: flex;
        justify-content: center;
        align-items: center;
        word-wrap: break-word;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 10px;
        margin-left: 4px;
        margin-right: 4px;
        box-shadow:
          0 2px 4px rgba(0, 0, 0, 0.12),
          0 0 6px rgba(0, 0, 0, 0.04);
        //background-color: green;
      }
      .handle {
        flex: 1;
        //background-color: pink;
        display: flex;
        user-select: none;
        justify-content: flex-end;

        .layer-btn {
          cursor: pointer;
          width: @designWidth;
          height: @designHeight;
          border: 1px solid transparent;
          border-radius: 3px;
          display: flex;
          justify-content: center;
          align-items: center;
          &:hover {
            border: 1px solid #409eff;
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
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
