<!--设计器-左侧-的tabs-->
<template>
  <div class="tabs-container">
    <prodTabs v-show="active === btnList[0].value" />
    <imageTabs v-show="active === btnList[1].value" />
    <backgroundTabs v-show="active === btnList[2].value" />
    <textTabs v-show="active === btnList[3].value" />
  </div>
</template>

<script>
import prodTabs from './components/prod';
import imageTabs from './components/image';
import backgroundTabs from './components/background';
import textTabs from './components/text';
import { btnList } from '@/designApp/view/layout/left/common';

export default {
  components: {
    prodTabs,
    imageTabs,
    backgroundTabs,
    textTabs,
  },
  props: {
    active: { type: String, default: '' },
  },
  data() {
    return {
      btnList,
    };
  },
};
</script>

<style scoped lang="less">
.tabs-container {
  border: 1px solid #eee;
  background-color: #fff;
  border-radius: 5px;
  .tabs {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  ::v-deep .el-tabs__nav-scroll {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  /deep/ .el-tabs__content {
    overflow: inherit;
  }
}
</style>
