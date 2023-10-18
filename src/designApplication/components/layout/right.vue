<template>
  <div>
    <template v-if="activeProd">
      <div v-for="view in activeProd.viewList">
        {{ view.id }}
        <div v-for="image in imageList(view)">
          <div v-if="image.attrs.name === 'bgc'" @click="onRemove2(image)">
            {{ image.attrs.fill }}
          </div>
          <el-image v-else @click="onRemove(image)" style="width: 50px; height: 50px" :src="image.attrs.fillPatternImage.src" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

export default {
  computed: {
    ...mapGetters({
      activeProd: 'designApplication/activeProd',
    }),
    imageList() {
      return (view) => {
        return view.canvas?.getImageList() || [];
      };
    },
  },
  methods: {
    /**
     * 删除图片
     * */
    onRemove(image) {
      image.attrs.remove();
    },
    /**
     * 删除背景色
     * */
    onRemove2(image) {
      DesignerUtil.removeBgc();
    },
  },
  mounted() {},
};
</script>

<style scoped lang="less"></style>
