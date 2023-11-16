<template>
  <div style="position: relative">
    <el-switch v-model="type" :inactive-value="typeEnum.dev" :active-value="typeEnum.design" active-text="生产版本" inactive-text="开发版本" style="position: absolute; left: -200px; z-index: 6" />
    <rightDev v-if="type === typeEnum.dev" />
    <rightDesign v-if="type === typeEnum.design" />
  </div>
</template>

<script>
import rightDev from './right/right-dev.vue';
import rightDesign from './right/right-design.vue';

/**
 * 类型
 * @type {{dev: string, design: string}}
 */
const typeEnum = {
  dev: 'dev',
  design: 'design',
};

export default {
  components: {
    rightDev,
    rightDesign,
  },
  data() {
    return {
      typeEnum,
      type: typeEnum.design,
    };
  },
};
</script>
