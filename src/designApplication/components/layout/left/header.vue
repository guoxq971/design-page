<!--左侧-上方的tabs的按钮组-->
<template>
  <div class="header-container">
    <boxAdaptive width="25%" height="45%" v-for="item in leftTabsList" :key="item.value">
      <el-button class="btn" @click="(evt) => onClick(item, evt)" :type="isActive(item.value)">
        <div class="center">
          <iconpark-icon :name="item.icon" size="20" />
          <div class="text">{{ item.label }}</div>
        </div>
      </el-button>
    </boxAdaptive>
  </div>
</template>

<script>
import { buttonBlur } from '@/designApplication/core/utils/buttonBlur';
import { leftTabsList } from '@/designApplication/core/utils/defineData';

export default {
  props: {
    active: { type: String, default: '' },
  },
  data() {
    return {
      leftTabsList: leftTabsList.toSorted((a, b) => a.sort - b.sort),
    };
  },
  computed: {
    isActive() {
      return (type) => {
        return this.active === type ? 'primary' : '';
      };
    },
  },
  methods: {
    // 点击
    onClick(item, evt) {
      buttonBlur(evt);
      this.$emit('update:active', item.value);
    },
  },
};
</script>

<style scoped lang="less">
.box-width {
  width: 25%;
}
.box-container {
  width: 100%;
  height: 0;
  padding-bottom: 45%;
  position: relative;
  .box-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.header-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  .btn {
    width: 100%;
    height: 100%;
    margin-left: 0;
    font-size: 13px;
    border-radius: 5px;
    padding: 2px 6px !important;
    transition: all 0.3s;

    .center {
      display: flex;
      justify-content: center;
      align-items: center;

      .text {
        margin-left: 3px;
        margin-top: 2px;
      }
    }
  }
}
</style>
