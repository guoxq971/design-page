<template>
  <div>
    <div style="width: 100vw; height: 100vh" id="three"></div>
  </div>
</template>

<script>
import { MyThree } from '@/designApplication/core/three';
import { loadModel } from '@/designApplication/core/utils/loadModel';
import * as THREE from 'three';

export default {
  data() {
    return {};
  },
  async mounted() {
    const t = new MyThree({ id: 'three' });
    // 加载模型
    const result = await loadModel('/2424-M.glb');
    t.scene.add(result.model);
    t.model = result.model;
    t.meshList = result.meshList;
    console.log(
      'meshList',
      t.meshList,
      t.meshList.map((e) => e.name),
    );
    const fn = (name) => {
      const mesh = t.meshList.find((e) => e.material.name === name);

      // const canvas = document.createElement('canvas');
      // canvas.width = 1;
      // canvas.height = 1;
      // // 红色
      // const ctx = canvas.getContext('2d');
      // ctx.fillStyle = 'red';
      // ctx.fillRect(0, 0, 1, 1);
      // mesh.material.map = new THREE.CanvasTexture(canvas);
      // mesh.material.map.needsUpdate = true;

      mesh.material.opacity = 1;
      mesh.material.color = new THREE.Color(0xff0000);
      mesh.material.needsUpdate = true;

      console.log(mesh);
    };

    fn('inside');
    fn('cap_back');
    fn('cap_head');
    fn('logo');
  },
};
</script>
