<template>
  <div class="tabs-container">
    <prodTabs v-show="active === leftTabsList[0].value" />
    <imageTabs v-show="active === leftTabsList[1].value" />
    <backgroundTabs v-show="active === leftTabsList[2].value" />
    <div v-show="active === leftTabsList[3].value">text</div>
  </div>
</template>

<script>
import prodTabs from '@/designApplication/components/layout/leftTabs/prodTabs';
import imageTabs from '@/designApplication/components/layout/leftTabs/imageTabs';
import backgroundTabs from '@/designApplication/components/layout/leftTabs/backgroundTabs';
import { leftTabsList } from '@/designApplication/core/utils/defineData';
export default {
  components: {
    prodTabs,
    imageTabs,
    backgroundTabs,
  },
  props: {
    active: { type: String, default: '' },
  },
  data() {
    return {
      leftTabsList,
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
