<!--选择设计类型-->
<template>
  <div class="sel-wrap">
    <el-dropdown trigger="click">
      <span class="el-dropdown-link link-wrap">
        <span class="active-title">{{ activeTypeName }}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-tooltip placement="right">
          <div slot="content">
            <div>
              <div>设计参数全尺码通用，</div>
              <div>①多尺码产品，设计与生产效果存在部分误差</div>
              <div>②单尺码产品，无误差</div>
            </div>
          </div>
          <el-dropdown-item :disabled="disabledCommon" @click.native="onClick(ProdType.common)">通用设计</el-dropdown-item>
        </el-tooltip>

        <el-tooltip placement="right">
          <div slot="content">
            <!--精细-->
            <div>
              <template v-if="disabledRefine">
                <div>该产品暂不支持精细设计</div>
              </template>
              <template v-else>
                <div>每个尺码单独设计，细分裁片</div>
                <div>①设计与生产结果不存在误差</div>
                <div>②可选择需要的尺码进行设计，无需全是骂进行设计</div>
              </template>
            </div>
          </div>
          <el-dropdown-item :disabled="disabledRefine" @click.native="onClick(ProdType.refine)">精细设计</el-dropdown-item>
        </el-tooltip>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';
import { ProdType } from '@/designApplication/interface/prodItem';
import { isTemplateCanUse } from '@/designApplication/store/util';

export default {
  data() {
    return {
      DesignerUtil,
      ProdType,
      // ModelEnum,
    };
  },
  watch: {},
  computed: {
    // true-禁用 false-启用
    disabledCommon() {
      const common = this.$store.state.designApplication.prodStore.list.find((e) => e.type === ProdType.common);
      return !isTemplateCanUse(common.config3d);
    },
    // true-禁用 false-启用
    disabledRefine() {
      const refineList = this.$store.state.designApplication.prodStore.list.filter((e) => e.type === ProdType.refine);

      return refineList.every((e) => !isTemplateCanUse(e.config3d));
    },
    activeTypeName() {
      return DesignerUtil.getProdTypeName();
    },
  },
  methods: {
    /**
     * 切换产品
     * @param {typeof ProdType} type 产品类型
     * */
    async onClick(type) {
      // 切换精细 且 设计图有数据
      if (type === ProdType.refine && DesignerUtil.getActiveProd().viewList.some((view) => view.canvas.getImageList().length)) {
        await this.$confirm('切换设计类型后，当前设计数据将会清空，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        });
      }
      await this.$store.dispatch('designApplication/changeProd', { type });
    },
  },
};
</script>

<style scoped lang="less">
.sel-wrap {
  .link-wrap {
    background: #4087ff;
    color: #fff;
    padding: 3px 3px;
    cursor: pointer;
    border-radius: 3px;
    width: 73px;
    display: inline-block;

    .active-title {
      font-size: 13px;
      padding-left: 2.5px;
    }

    i {
      position: absolute;
      right: 1.2px;
      top: 8px;
      font-size: 12px;
    }
  }

  /deep/ .el-input--small .el-input__inner {
    height: 26px;
    line-height: 26px;
    padding: 0 0 0 7px;
    user-select: none;
    background: #4087ff;
    color: #fff !important;
    font-size: 13px;
  }
  /deep/ .el-input__suffix {
    display: none;
  }
  .icon {
    position: absolute;
    right: -68.5px;
    top: 6px;
    color: #fff;
  }
}
</style>
