import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh';

// 加速射线检测 (模型操作上操作不会卡顿)
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

// 缓存模型
const cacheModel = [
  {
    path: '2021/04/28/20210428111204-2.glb',
    result: null,
  },
];

/**
 * 加载模型(使用缓存)
 * @param path
 * @returns {Promise<{model: Group, meshList: Mesh[]}>}
 */
export async function loadModelByCache(path) {
  let result;
  // 缓存模型
  const cache = cacheModel.find((e) => e.path === path);
  if (cache) {
    // console.log('使用缓存模型');
    result = cache.result;
  } else {
    // console.log('加载模型');
    // 加载模型
    result = await loadModel(path);
    cacheModel.push({
      result,
      path: path,
    });
  }

  return result;
}

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
