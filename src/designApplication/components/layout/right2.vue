<template>
  <div>
    <el-card header="控制面板">
      <el-switch v-model="config.canvas.isShowProductImage" active-text="是否展示产品图片" inactive-text="否" :active-value="true" :inactive-value="false" />
      <br />
      <el-switch @change="onChangeByClip" v-model="config.canvas.isClip" active-text="是否隐藏超出裁剪区域部分" inactive-text="否" :active-value="true" :inactive-value="false" />
      <br />
      <el-switch @change="onChangeByV" v-model="config.canvas.isV" active-text="是否展示车线" inactive-text="否" :active-value="true" :inactive-value="false" />
      <br />
      <el-switch @change="onChangeBy3d" v-model="show3d" active-text="展示3d" inactive-text="展示2d" :active-value="true" :inactive-value="false" :disabled="show3dDisabled" />
    </el-card>

    <el-card v-if="activeProd" :header="'当前模板 - ' + activeProd.detail.templateNo">
      <div>可选模板:</div>
      <div v-for="prod in prodStore.list" style="margin-top: 4px" :class="{ active: isActive(prod) }">
        <el-button size="mini" @click="onSwitchProd(prod)">选择</el-button>
        <span style="margin-left: 4px">{{ DesignerUtil.getProdTypeName(prod.type) }}</span>
        <span v-if="prod.size">- {{ prod.size }}</span>
        <el-tag style="margin-left: 4px" v-if="DesignerUtil.config3dUtil.isLoad3d(prod?.config3d)">3d</el-tag>
      </div>
    </el-card>

    <el-card header="设计图列表">
      <el-collapse v-if="activeProd">
        <el-collapse-item v-for="view in activeProd.viewList" :title="view.name" :name="view.id">
          <template slot="title">{{ view.name }}</template>
          <div v-for="image in imageList(view)">
            <div v-if="image.attrs.name === 'bgc'" @click="onRemove2(image)">
              {{ image.attrs.fill }}
            </div>
            <el-image v-else-if="image.attrs.name === 'image'" @click="onRemove(image)" style="width: 50px; height: 50px" :src="image.attrs.fillPatternImage.src" />
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-card>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { OperationUtil } from '@/designApplication/core/utils/operationUtil';
import { Message } from 'element-ui';

export default {
  data() {
    return {
      sizeId: '',
      DesignerUtil,
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
    }),
    // 设计图列表
    imageList() {
      return (view) => {
        return view.canvas?.getImageList() || [];
      };
    },
    // 当前激活的模板
    isActive() {
      return (prod) => prod === this?.activeProd;
    },
    // show3d 是否禁用
    show3dDisabled() {
      return !DesignerUtil.config3dUtil.isLoad3d(this.activeProd?.config3d);
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
    onRemove(image) {
      image.attrs.remove();
    },
    /**
     * 删除背景色
     * */
    onRemove2(image) {
      DesignerUtil.removeBgc();
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less">
.active {
  color: red;
}
</style>
