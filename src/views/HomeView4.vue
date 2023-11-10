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
    // const result = await loadModel('/2424-M.glb');
    const result = await loadModel('/1602-2.glb');
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

      mesh.material.opacity = 1;

      const canvas = document.createElement('canvas');
      const width = 500;
      const height = 500;
      canvas.width = width;
      canvas.height = height;
      // 透明
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(0, 0, width, height);

      // 画一张图片
      const img = new Image();
      // img.src = '/test.jpg';
      img.src = '/test-2.png';
      img.onload = () => {
        img.width = 300;
        img.height = 300;
        ctx.drawImage(img, 50, 50, 300, 300);
        mesh.material.map = new THREE.CanvasTexture(canvas);
        mesh.material.map.needsUpdate = true;
        mesh.material.needsUpdate = true;
      };

      // mesh.material.map = new THREE.CanvasTexture(canvas);
      // mesh.material.map.needsUpdate = true;

      // mesh.material.opacity = 1;
      // mesh.material.color = new THREE.Color(0xff0000);
      // mesh.material.needsUpdate = true;

      console.log(mesh);
    };

    fn('logo');
    // fn('inside');
    // fn('cap_back');
    // fn('cap_head');
  },
};
</script>
