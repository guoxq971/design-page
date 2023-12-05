<!--大图预览-->
<template>
  <div>
    <!--简单多角度-->
    <multiAngleFold :size="size" typeName="简单" v-if="!item.composeId" :image="item.bgImg" :mask="item.designImg" :texture="item.prodImg" />
    <!--复杂多角度-->
    <template v-else>
      <multiAngleFold :size="size" typeName="复杂" :image="item.bgImg" :mask="item.designImg" :texture="item.prodImg" />
    </template>
  </div>
</template>

<script>
import multiAngleFold from './multiAnglePreviewBoxFold.vue';
export default {
  components: {
    multiAngleFold,
  },
  props: ['item', 'size'],
};
</script>
