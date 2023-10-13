<!--设计器—左侧-->
<template>
  <div class="design-application-left-container">
    <leftHeader :active.sync="activeTab" />
    <leftTabs :active="activeTab" />
  </div>
</template>

<script>
import leftTabs from '@/designApplication/components/layout/left/tabs.vue';
import leftHeader from '@/designApplication/components/layout/left/header.vue';
import { leftTabsList } from '@/designApplication/core/utils/defineData';
export default {
  components: {
    leftTabs,
    leftHeader,
  },
  data() {
    return {
      activeTab: leftTabsList[0].value,
    };
  },
};
</script>

<style scoped lang="less">
.design-application-left-container {
  width: 100%;

  // 搜索框的样式
  ::v-deep .el-input-group--append {
    position: relative;

    .el-input__inner {
      width: 100%;
      padding-right: 33px;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    .el-input-group__append {
      position: absolute;
      right: 11px;
      top: 7px;
      border: none;
      background-color: transparent;
      padding: 0;

      .el-button {
        padding: 9px !important;
      }
    }
  }
}
</style>
