<!--设计器—左侧-->
<template>
  <div class="container">
    <containerHeader :active.sync="activeTab" />
    <containerTabs :active="activeTab" />
  </div>
</template>

<script>
import containerHeader from './components/header';
import containerTabs from './components/tabs';
import { btnList } from '@/designApp/view/layout/left/common';

export default {
  components: { containerHeader, containerTabs },
  data() {
    return {
      activeTab: btnList[0].value,
    };
  },
};
</script>

<style scoped lang="less">
.container {
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
