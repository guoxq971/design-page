<template>
  <div>
    <div id="three-container"></div>
  </div>
</template>
<script>
import { MyThree } from '@/designApp/core/three';
import { loadModel } from '@/designApp/core/three/loadModel';
import { mapGetters, mapState } from 'vuex';
import * as THREE from 'three';
export default {
  name: 'index',
  data() {
    return {};
  },
  computed: {
    ...mapState({
      prod: (state) => state.designApp.prod,
      activeView: (state) => state.designApp.prod.activeView,
    }),
    ...mapGetters({
      activeData: 'designApp/activeData',
    }),
  },
  mounted() {
    setTimeout(async () => {
      // const t = new MyThree({ id: 'three-container' });
      // const { model, meshList } = await loadModel('/2424.glb');
      // const view = this.activeData.viewList.find((e) => e.id === this.activeView.id);
      // const canvas = view.canvas.stage.content.querySelectorAll('canvas');
      //
      // meshList.forEach((e) => {
      //   if (e.name === 'front') {
      //     e.material.map = new THREE.CanvasTexture(canvas[1]);
      //     e.material.needsUpdate = true;
      //   }
      // });
      // t.scene.add(model);
    });
  },
};
</script>

<style scoped lang="less"></style>
