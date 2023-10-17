import { KonvaCanvas } from '@/designApplication/core/canvas/konvaCanvas';
import store from '@/store';
import { sleep } from '@/designApplication/core/utils/sleep';

/**
 * 加载canvas
 * */
export async function loadCanvas() {
  const activeProdStatic = store.getters['designApplication/activeProdStatic'];
  const activeProd = store.getters['designApplication/activeProd'];

  if (activeProdStatic?.viewList.length && activeProd?.viewList.some((e) => !e.canvas)) {
    try {
      openLoading();
      await sleep(0);
      initCanvas(activeProdStatic);
    } finally {
      closeLoading();
    }
  }
}

function openLoading() {
  store.commit('designApplication/setLoading2d', true);
}

function closeLoading() {
  store.commit('designApplication/setLoading2d', false);
}

/**
 * 初始化画布
 * @param {ActiveData} activeProdStatic 静态资源数据
 * */
function initCanvas(activeProdStatic) {
  for (let staticView of activeProdStatic.viewList) {
    createCanvas(staticView);
  }
}
/**
 * 创建画布
 * @param {StaticViewItem} staticView 视图
 * */
function createCanvas(staticView) {
  const activeProd = store.getters['designApplication/activeProd'];
  const config = store.state.designApplication.config;
  const view = activeProd.viewList.find((e) => e.id === staticView.id);

  if (!view) return;

  // 初始化画布
  view.canvas = new KonvaCanvas({
    id: `${config.canvasContainerId}-${staticView.id}`,
    staticView: staticView,
    view: view,
  });

  // 设计图
  // view.canvas.createImage(image3).then((design) => view.canvas.add(design));
  // 设计图
  // const design2 = await view.canvas.createImage(image3);
  // view.canvas.add(design2);
}
