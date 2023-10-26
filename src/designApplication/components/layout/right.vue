<template>
  <el-card>
    <el-collapse>
      <!--控制面板-->
      <el-collapse-item title="控制面板">
        <div slot="title" style="display: flex; gap: 5px">
          <iconpark-icon name="setting" size="20" />
          <div>控制面板</div>
        </div>

        <el-form label-width="100px">
          <el-form-item label="产品图片: ">
            <el-switch v-model="config.canvas.isShowProductImage" active-text="是" inactive-text="否" :active-value="true" :inactive-value="false" />
          </el-form-item>
          <el-form-item label="裁剪超出: ">
            <el-switch @change="onChangeByClip" v-model="config.canvas.isClip" active-text="是" inactive-text="否" :active-value="true" :inactive-value="false" />
          </el-form-item>
          <el-form-item label="车线: ">
            <el-switch @change="onChangeByV" v-model="config.canvas.isV" active-text="是否展示车线" inactive-text="否" :active-value="true" :inactive-value="false" />
          </el-form-item>
          <el-form-item label="展示: ">
            <el-switch @change="onChangeBy3d" v-model="show3d" active-text="3d" inactive-text="2d" :active-value="true" :inactive-value="false" :disabled="show3dDisabled" />
          </el-form-item>
        </el-form>
      </el-collapse-item>

      <!--当前模板-->
      <el-collapse-item v-if="activeProd" title="模板">
        <div slot="title" style="display: flex; gap: 5px">
          <iconpark-icon name="theme" size="20" />
          <div>模板 - {{ activeProd.detail.templateNo }}</div>
        </div>

        <div v-for="prod in prodStore.list" style="margin-top: 4px" :class="{ active: isActive(prod) }">
          <el-button :disabled="isActive(prod)" :type="isActive(prod) ? 'primary' : ''" size="mini" @click="onSwitchProd(prod)" style="margin-left: 10px">选择</el-button>
          <el-tag style="margin-left: 4px" :type="ProdType.isCommon(prod.type) ? 'success' : ''">{{ DesignerUtil.getProdTypeName(prod.type) }}</el-tag>
          <span v-if="prod.size">- {{ prod.size }}</span>
          <el-tag style="margin-left: 4px" v-if="DesignerUtil.config3dUtil.isLoad3d(prod?.config3d)">3d</el-tag>
        </div>
      </el-collapse-item>

      <!--设计图列表-->
      <el-collapse-item class="custom-wrap" title="设计图列表">
        <div slot="title" style="display: flex; gap: 5px">
          <iconpark-icon name="pic" size="20" />
          <div>设计图列表 ({{ imageTotal }})</div>
        </div>

        <el-collapse v-if="activeProd">
          <el-collapse-item v-for="view in activeProd.viewList" :title="view.name" :name="view.id">
            <!--标题-->
            <div slot="title" style="display: flex; align-items: center">
              <box-adaptive style="width: 50px; height: 50px">
                <img :src="showImg('prod', view)" alt="" style="position: absolute; width: 100%; height: 100%" />
                <img :src="showImg('bg', view)" alt="" style="position: absolute; width: 100%; height: 100%" />
              </box-adaptive>
              <span>{{ view.name }} ({{ imageList(view).length }})</span>
            </div>

            <!--设计图列表-->
            <div class="layer-group">
              <div v-for="image in imageList(view)" class="layer-item" :class="{ 'active-layer': image.attrs.transformer.attrs.visible }">
                <!--背景色-->
                <div v-if="image.attrs.name === 'bgc'" class="img-wrap" @click="onSelected(image, image.attrs.name, view)">
                  <div class="img" :style="{ backgroundColor: image.attrs.fill }"></div>
                  <div class="img-name">{{ image.attrs.fill }}</div>
                </div>

                <!--文字-->
                <div v-else-if="image.attrs.name === 'text'" class="img-wrap" @click="onSelected(image, image.attrs.name, view)">
                  <!--<el-input :value="image.attrs.text" @input="(val) => onInput(image, view, val)" />-->
                  <div class="text">文</div>
                  <div class="img-name">{{ image.attrs.text }}</div>
                </div>

                <!--设计图-->
                <div v-else-if="image.attrs.name === 'image'" class="img-wrap" @click="onSelected(image, image.attrs.name, view)">
                  <el-image :src="image.attrs.fillPatternImage.src" class="img" />
                  <div class="img-name">{{ image.attrs.detail.name }}</div>
                </div>

                <div class="btn-layer">
                  <!--图层上移动-->
                  <template v-if="!['bgc'].includes(image.attrs.name)">
                    <div class="btn" @click="onLayer(image, image.attrs.name, 'up')">
                      <div class="el-icon-top"></div>
                    </div>

                    <div class="btn" @click="onLayer(image, image.attrs.name, 'down')">
                      <div class="el-icon-bottom"></div>
                    </div>
                  </template>

                  <!--图层-显示隐藏-->
                  <div class="btn" @click="onVisible(image, image.attrs.name)">
                    <iconpark-icon :name="image.attrs.visible ? 'preview-open' : 'preview-close'" size="20" />
                  </div>

                  <!--删除-->
                  <div class="btn" @click="onRemove(image, image.attrs.name)">
                    <div class="el-icon-delete"></div>
                  </div>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-collapse-item>
    </el-collapse>

    <el-card style="margin-top: 10px" header="当前选中的设计" v-if="activeDesign">
      <div slot="header">
        <span>当前选中的设计</span>
        <span v-if="activeDesign">({{ DesignerUtil.DesignType.getLabel(activeDesign.attrs.name) }})</span>
      </div>

      <div v-if="activeDesign">
        <!--设计信息-->
        <div v-if="activeDesign.attrs.name === 'image'" class="img-wrap-2">
          <div class="image-bd">
            <el-image :src="activeDesign.attrs.fillPatternImage.src" class="image" />
          </div>
          <div class="img-name-2">{{ activeDesign.attrs.detail.name }}</div>
        </div>
        <div v-if="activeDesign.attrs.name === 'text'" class="text-wrap-2">
          <el-input type="textarea" :rows="4" :value="activeDesign.attrs.text" @input="(val) => onInput(activeDesign, val)" />
        </div>

        <!--操作区域-->
        <div class="layer-item" style="padding: 0">
          <!--图层上移动-->
          <template v-if="!['bgc'].includes(activeDesign.attrs.name)">
            <div class="btn" @click="onLayer(activeDesign, activeDesign.attrs.name, 'up')">
              <div class="el-icon-top"></div>
            </div>

            <div class="btn" @click="onLayer(activeDesign, activeDesign.attrs.name, 'down')">
              <div class="el-icon-bottom"></div>
            </div>
          </template>

          <!--显示隐藏-->
          <div class="btn" @click="onVisible(activeDesign, activeDesign.attrs.name)">
            <iconpark-icon :name="activeDesign.attrs.visible ? 'preview-open' : 'preview-close'" size="20" />
          </div>

          <!--删除-->
          <div class="btn" @click="onRemove(activeDesign, activeDesign.attrs.name)">
            <div class="el-icon-delete"></div>
          </div>
        </div>
      </div>
    </el-card>
  </el-card>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { OperationUtil } from '@/designApplication/core/utils/operationUtil';
import { Message } from 'element-ui';
import { ProdType } from '@/designApplication/interface/prodItem';

export default {
  data() {
    return {
      sizeId: '',
      DesignerUtil,
      ProdType,
      show3d: false,
    };
  },
  computed: {
    ...mapState({
      vuexShow3d: (state) => state.designApplication.show3d,
      config: (state) => state.designApplication.config,
      prodStore: (state) => state.designApplication.prodStore,
      activeType: (state) => state.designApplication.activeType,
      activeSizeId: (state) => state.designApplication.activeSizeId,
      loading_prod: (state) => state.designApplication.loading_prod,
    }),
    ...mapGetters({
      activeProd: 'designApplication/activeProd',
      activeProdStatic: 'designApplication/activeProdStatic',
    }),
    /**
     * 展示产品图
     * */
    showImg() {
      return (type, view) => {
        const staticView = this.activeProdStatic.viewList.find((e) => e.id === view.id);

        if (type === 'prod') {
          return staticView.showImage.image;
        }
        if (type === 'bg') {
          return staticView.showImage.texture;
        }
      };
    },
    /**
     * 设计图列表
     * */
    imageList() {
      return (view) => {
        return view.canvas?.getImageList() || [];
      };
    },
    /**
     * 总设计图数量
     * */
    imageTotal() {
      return this.activeProd?.viewList.reduce((total, view) => {
        return total + this.imageList(view).length;
      }, 0);
    },
    /**
     * 当前激活的模板
     * */
    isActive() {
      return (prod) => prod === this?.activeProd;
    },
    // show3d 是否禁用
    show3dDisabled() {
      return !DesignerUtil.config3dUtil.isLoad3d(this.activeProd?.config3d);
    },
    /**
     * 当前选中的设计
     * */
    activeDesign() {
      let result = null;
      this.activeProd?.viewList.find((view) => {
        const r = view.canvas?.getSelected();
        if (r) {
          result = r.design;
        }
        return r;
      });
      return result;
    },
  },
  watch: {
    vuexShow3d: {
      handler(val) {
        this.show3d = val;
      },
      immediate: true,
    },
  },
  methods: {
    /**
     * 文字
     * */
    onInput(text, val) {
      text.setAttr('text', val);
    },
    /**
     * 切换模板
     * */
    onSwitchProd(prod) {
      if (this.loading_prod) {
        Message.warning('模板加载中，请稍后');
        return;
      }
      this.$store.dispatch('designApplication/changeProd', {
        type: prod.type,
        sizeId: prod.sizeId ? prod.sizeId : this.activeSizeId,
      });
    },
    /**
     * 3d / 2d 切换
     * */
    onChangeBy3d(e) {
      OperationUtil.doubleClickCanvas();
    },
    /**
     * 是否展示车线
     * */
    onChangeByV(e) {
      this.activeProd.viewList.forEach((view) => {
        view.canvas.v.visible(e);
      });
    },
    /**
     * 超出隐藏
     * */
    onChangeByClip(e) {
      this.activeProd.viewList.forEach((view) => {
        if (e) {
          view.canvas.clip.clipFunc(view.canvas.clip.attrs.clipFunc2());
        } else {
          view.canvas.clip.clipFunc(null);
        }
      });
    },
    /**
     * 删除图片
     * */
    onRemove(image, type) {
      if (['image', 'text'].includes(type)) {
        image.attrs.remove();
      }

      if (['bgc'].includes(type)) {
        DesignerUtil.removeBgc();
      }
    },
    /**
     * 显示隐藏
     * */
    onVisible(image, type) {
      if (['image', 'text'].includes(type)) {
        image.attrs.visibleFn();
      }

      if (['bgc'].includes(type)) {
        DesignerUtil.visibleBgc();
      }
    },
    /**
     * 图层上移下移
     * */
    onLayer(image, imageType, type) {
      if (['image', 'text'].includes(imageType)) {
        image.attrs.layerMoveFn(type);
      }
    },
    /**
     * 选中图层
     * */
    onSelected(image, type, view) {
      if (['image', 'text'].includes(type)) {
        image.attrs.selectedFn();
      }

      if (['bgc'].includes(type)) {
        image.attrs.selectedFn();
      }
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">
.active {
  color: red !important;
}
.custom-wrap {
  /deep/ .el-collapse-item__wrap {
    border-bottom: none !important;
  }
}

.layer-group {
  display: flex;
  flex-direction: column-reverse;

  .active-layer {
    border: 2px solid #0099ff !important;
  }
}
// 设计图item
.layer-item {
  margin-bottom: 5px;
  border: 2px solid #eee;
  border-radius: 5px;
  padding: 8px;
  display: flex;
  gap: 5px;

  .img-wrap {
    display: inline-flex;
    flex: 1;
    max-width: 50%;
  }

  .text {
    width: 32px;
    height: 32px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.12),
      0 0 6px rgba(0, 0, 0, 0.04);
  }

  .img {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.12),
      0 0 6px rgba(0, 0, 0, 0.04);

    .image {
      width: 32px;
      height: 32px;
    }
  }

  .img-name {
    flex: 1;
    padding: 0 5px;
    font-size: 10px;
    display: flex;
    align-items: center;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.12),
      0 0 6px rgba(0, 0, 0, 0.04);
  }

  // 操作区域
  .btn-layer {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    gap: 1px;
  }
  .btn {
    transition: all 0.3s;
    width: 32px;
    height: 32px;
    border: 1px solid transparent;
    border-radius: 4px;
    font-size: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      border: 1px solid #4087ff;
    }
  }
}

.text-wrap-2 {
  margin-bottom: 7px;
}

.img-wrap-2 {
  display: flex;
  align-items: center;
  margin-bottom: 7px;

  .image-bd {
    width: 90px;
    height: 90px;
    border-radius: 5px;
    overflow: hidden;
    .image {
      width: 100%;
      height: 100%;
    }
  }

  .img-name-2 {
    flex: 1;
    padding: 0 5px;
    font-size: 10px;
    display: flex;
    align-items: center;
    word-wrap: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
