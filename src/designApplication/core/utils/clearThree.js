/**
 * 销毁three对象
 * @param {MyThree} three three对象
 * */
export function disposeThree(three) {
  const scene = three.scene;
  const renderer = three.renderer;
  const controls = three.controls;
  // 销毁元素
  three.container.removeChild(renderer.domElement);

  // 调用销毁函数
  disposeScene(scene); // scene是你的Three.js场景对象
  disposeRenderer(renderer); // renderer是你的Three.js渲染器对象
  disposeControls(controls); // controls是你的Three.js控制器对象
}

// 传入需要销毁的对象数组
function disposeObjects(objects) {
  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];

    // 递归销毁子对象
    if (obj.children) {
      disposeObjects(obj.children);
    }

    // 释放几何体的资源
    if (obj.geometry) {
      obj.geometry.dispose();
    }

    // 释放材质的资源
    if (obj.material) {
      // 如果是数组，循环释放
      if (Array.isArray(obj.material)) {
        obj.material.forEach((material) => {
          if (material) {
            material.dispose();
          }
        });
      } else {
        obj.material.dispose();
      }
    }
  }
}

// 销毁所有场景对象
function disposeScene(scene) {
  disposeObjects(scene.children);
}

// 销毁所有渲染器相关对象
function disposeRenderer(renderer) {
  renderer.dispose();
}

// 销毁所有控制器相关对象
function disposeControls(controls) {
  controls.dispose();
}
