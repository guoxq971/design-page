<template>
  <div>
    <div :id="`container${view.id}`"></div>
  </div>
</template>

<script>
import { KonvaCanvas } from '@/designApp/core/canvas/konvaCanvas';
export default {
  props: {
    view: { type: Object },
  },
  data() {
    return {
      konvaCanvas: new KonvaCanvas(),
      image3: require('@/assets/300 (1).jpg'),
      image: require('@/assets/300.jpg'),
      image2: require('@/assets/400.jpg'),
    };
  },
  watch: {
    view: {
      handler(val) {
        if (val) {
          this.$nextTick(async () => {
            this.konvaCanvas = new KonvaCanvas({
              id: `container${val.id}`,
              view: this.view,
            });
            this.view.canvas = this.konvaCanvas;
            // 设计图
            const design = await this.konvaCanvas.createImage(this.image3);
            this.konvaCanvas.add(design);
            // 设计图
            // const design2 = await this.konvaCanvas.createImage(this.image3);
            // this.konvaCanvas.add(design2);
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped lang="less">
.canvas-workspace {
}
</style>
