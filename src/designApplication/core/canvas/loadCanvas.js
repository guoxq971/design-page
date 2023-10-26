import store from '@/store';
import { sleep } from '@/designApplication/core/utils/sleep';
import { KonvaCanvas } from '@/designApplication/core/canvas_2/konvaCanvas';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

/**
 * 加载canvas
 * */
export async function loadCanvas() {
  const activeProdStatic = DesignerUtil.getActiveProdStatic();
  const activeProd = DesignerUtil.getActiveProd();

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
 * @param {import('@/design').ActiveStaticProdData} activeProdStatic 静态资源数据
 * */
function initCanvas(activeProdStatic) {
  for (let staticView of activeProdStatic.viewList) {
    createCanvas(staticView);
  }
}
/**
 * 创建画布
 * @param {import('@/design').StaticViewItem} staticView 视图
 * */
function createCanvas(staticView) {
  const activeProd = DesignerUtil.getActiveProd();
  const config = store.state.designApplication.config;
  const view = activeProd.viewList.find((e) => e.id == staticView.id);

  if (!view) return;

  // 初始化画布
  view.canvas = new KonvaCanvas({
    id: `${config.canvasContainerId}-${staticView.id}`,
    staticView: staticView,
    view: view,
  });
}
