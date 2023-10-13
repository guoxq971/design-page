<!--盒子-->
<template>
  <boxAdaptive class="box-container">
    <div class="img-wrap" :class="{ active: active }" @mouseenter="mouseenter" @mouseleave="mouseleave">
      <img v-if="src" class="image" :src="src" />
      <template v-else>
        <img class="image" :src="prod" />
        <img class="image" :src="bg" />
      </template>
    </div>
  </boxAdaptive>
</template>

<script>
export default {
  props: {
    active: { type: Boolean, default: false },
    src: { type: String, default: '' },
    prod: { type: String, default: '' },
    bg: { type: String, default: '' },
    detail: { type: Object, default: () => ({}) },
  },
  data() {
    return {};
  },
  methods: {
    // 鼠标进入
    mouseenter() {
      this.$emit('mouseenter', this.detail);
    },
    // 鼠标离开
    mouseleave() {
      this.$emit('mouseleave', this.detail);
    },
  },
};
</script>

<style scoped lang="less">
@activeBorder: 2px solid #4087ff;

.active {
  border: @activeBorder !important;
}

.box-container {
  user-select: none;
  .img-wrap {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    overflow: hidden;
    border: 2px solid transparent;
    transition: all 0.2s;
    position: relative;
    &:hover {
      cursor: pointer;
      border: @activeBorder;
    }
    .image {
      position: absolute;
      width: 100%;
    }
  }
}
</style>
