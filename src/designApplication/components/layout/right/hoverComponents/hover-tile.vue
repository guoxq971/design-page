<template>
  <el-popover placement="bottom" width="260" trigger="click">
    <div class="hover-wrap">
      <div class="hover-wrap">
        <div class="img" @click="onNotTile">不平铺</div>
        <div class="img" @click="onTile">平铺</div>
        <div class="img">
          <span>交错</span>
          <span>平铺</span>
        </div>
        <div class="img">
          <span>镜像</span>
          <span>平铺</span>
        </div>
      </div>
    </div>
    <div>
      <div style="display: flex">
        <span style="white-space: nowrap">水平间距</span>
        <el-input v-model.number="params.gapX"></el-input>
      </div>
      <div style="display: flex">
        <span style="white-space: nowrap">垂直间距</span>
        <el-input v-model.number="params.gapY"></el-input>
      </div>
      <div style="display: flex">
        <span style="white-space: nowrap">交错类型</span>
        <el-radio-group v-model="params.offsetType">
          <el-radio label="x">水平交错</el-radio>
          <el-radio label="y">垂直交错</el-radio>
        </el-radio-group>
      </div>
      <div style="display: flex">
        <span style="white-space: nowrap">交错偏移量</span>
        <el-input v-model.number="params.offset"></el-input>
      </div>
      <div style="display: flex">
        <span style="white-space: nowrap">镜像</span>
        <el-select v-model="params.mirrorType">
          <el-option label="无" :value="0"></el-option>
          <el-option label="水平" :value="1"></el-option>
          <el-option label="垂直" :value="2"></el-option>
          <el-option label="旋转" :value="3"></el-option>
        </el-select>
      </div>
      <el-button @click="onEdit">修改</el-button>
    </div>

    <div style="width: 100%; height: 100%" v-title="'平铺'" slot="reference">
      <div class="name">平铺</div>
      <div class="right-bottom-corner">
        <div class="interior" />
      </div>
    </div>
  </el-popover>
</template>

<script>
import title from '@/designApplication/core/utils/directives/title/title';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';
import { TileUtil } from '@/designApplication/components/layout/right/hoverComponents/tileUtil';
import { canvasDefine } from '@/designApplication/core/canvas_2/define';
import { mapState } from 'vuex';

export default {
  name: 'hover-setting',
  directives: { title },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      params: (state) => state.designApplication.tile,
    }),
  },
  methods: {
    /**
     * 不平铺
     */
    async onNotTile() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      TileUtil.remove(image);
    },
    /**
     * 修改
     * @returns {Promise<void>}
     */
    async onEdit() {
      const image = await DesignImageUtil.hasActiveImageMessage();

      if (image.attrs.type !== canvasDefine.image) {
        this.$message.warning('请使用设计图进行平铺');
        return;
      }

      const group = TileUtil.find(image);
      group?.destroy();
      setTimeout(() => this.onTile());
    },
    /**
     * 平铺
     * @returns {Promise<void>}
     */
    async onTile() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      await TileUtil.add(image);
    },
  },
};
</script>

<style scoped lang="less">
@import url('../commonStyle');
/deep/ .el-popover__reference-wrapper {
  width: 100%;
  height: 100%;
}
.name {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.hover-wrap {
  width: 235px;
  display: flex;
  justify-content: space-around;
  .img {
    cursor: pointer;
    width: 50px;
    height: 50px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    &:hover {
      border: 1px solid #409eff;
    }
  }
}
</style>
