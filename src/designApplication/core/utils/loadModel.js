import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

// 加速射线检测 (模型操作上操作不会卡顿)
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

/**
 * 加载模型
 * @param {string} path 模型路径
 * @returns {Promise<{model: THREE.Group, meshList: THREE.Mesh[]} | never>}
 */
export function loadModel(path) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      path,
      function (gltf) {
        const model = gltf.scene;
        const meshList = [];

        // 遍历模型
        model.traverse(function (child) {
          if (child instanceof THREE.Mesh) {
            // 构建包围盒(加速射线检测)
            child.geometry.computeBoundsTree();

            // 材质名称赋值给子对象
            child.name = child.material.name;

            meshList.push(child);
          }
        });

        resolve({ model, meshList });
      },
      undefined,
      function (error) {
        console.error(error);
        reject(error);
      },
    );
  });
}
