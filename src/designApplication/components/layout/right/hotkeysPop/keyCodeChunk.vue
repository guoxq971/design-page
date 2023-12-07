<template>
  <div class="keycode-chunk">
    <div class="left-list">
      <div class="box-list" v-for="left in leftList" :key="left.key">
        <div class="left-box">{{ left.label }}</div>
        <div class="right-box" :class="{ gray: !left.value }">
          <template v-if="costomBtn">
            <keyCodeCustomBtn :value.sync="left.value" :verify="(v) => verify({ value: v, key: left.key })" />
          </template>
          <template v-else>
            {{ left.value || '未设置' }}
          </template>
        </div>
      </div>
    </div>
    <el-divider direction="vertical" />
    <div class="right-list">
      <div class="box-list" v-for="right in rightList" :key="right.key">
        <div class="left-box">{{ right.label }}</div>
        <div class="right-box" :class="{ gray: !right.value }">
          <template v-if="costomBtn">
            <keyCodeCustomBtn :value.sync="right.value" :verify="(v) => verify({ value: v, key: right.key })" />
          </template>
          <template v-else>
            {{ right.value || '未设置' }}
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import keyCodeCustomBtn from './keyCodeCustomBtn';
export default {
  name: 'keyCodeChunk',
  components: {
    keyCodeCustomBtn,
  },
  props: {
    leftList: { type: Array, default: () => [] },
    rightList: { type: Array, default: () => [] },
    costomBtn: { type: Boolean, default: false },
    verify: { type: Function, default: () => true },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-input__inner {
  width: 100px;
  padding: 0;
}
.keycode-chunk {
  width: 100%;
  display: flex;

  ::v-deep .el-divider--vertical {
    height: auto;
  }

  .left-list {
    width: 50%;
  }

  .right-list {
    width: 50%;
  }

  .box-list {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    padding: 0 0 0 8px;
    cursor: pointer;
    font-size: 12px;

    &:hover {
      background-color: #f2f2f2;
    }

    .left-box {
    }
    .gray {
      color: #ccc;
    }
    .right-box {
      width: 140px;
      height: 100%;
      display: flex;
      align-items: center;
    }
  }
}
</style>
