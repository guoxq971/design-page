import { getViewDesign, restoreImageList } from '@/designApplication/core/canvas_2/konvaCanvasAddHelp';
import store from '@/store';

// 操作
export const queue_define = {
  right_rotate_45: '右旋45°',
  left_rotate_45: '左旋45°',
  flip_x: 'x轴翻转',
  flip_y: 'y轴翻转',
  scale_up: '放大',
  scale_down: '缩小',
  align_x: '水平居中',
  align_y: '垂直居中',
  delete: '删除 设计图/文字',
  delete_bgc: '删除背景色',
  layer_up: '上移一层',
  layer_down: '下移一层',
  layer_top: '置顶',
  layer_bottom: '置底',
  copy: '复制',
  visible: '显示-隐藏',
  visible_bgc: '显示-隐藏 背景色',

  transformer_end: '缩放/旋转结束',
  dragend: '拖拽结束',
};

/**
 * 操作队列
 */
class UseQueue {
  // list = store.state.designApplication.queue.list;
  queue = store.state.designApplication.queue;

  // list = [
  // {
  //   id: 1,
  //   name: '移动',
  //   viewList: [
  //     {
  //       id: 1,
  //       imageList: [ ],
  //     },
  //   ],
  // },
  // ];

  /**
   * 添加记录
   */
  add(type) {
    // list 移除之后的记录
    this.queue.list.splice(this.queue.activeId + 1, this.queue.list.length - this.queue.activeId - 1);

    // 添加记录
    const id = this.queue.list.length;
    const result = {
      id,
      name: type,
      viewList: [],
    };

    const prodItem = store.state.designApplication.prodStore.get();
    for (let view of prodItem.viewList) {
      result.viewList.push({
        id: view.id,
        canvas: view.canvas,
        imageList: getViewDesign(view),
      });
    }

    this.queue.list.push(result);
    this.queue.activeId = id;

    console.log('当前队列', this.queue.list);
    console.log('当前队列id', this.queue.activeId);
  }

  /**
   * 下一步
   */
  async next() {
    const targetId = this.queue.activeId + 1;

    if (targetId > this.queue.list.length - 1) return;

    const activeQueue = this.queue.list.find((e) => e.id === targetId);
    this.queue.activeId = targetId;

    const viewList = activeQueue.viewList;
    for (let view of viewList) {
      view.canvas.clear();
      await restoreImageList(view);
    }
  }

  /**
   * 上一步
   */
  async prev() {
    const targetId = this.queue.activeId - 1;

    if (targetId < 0) return;

    const activeQueue = this.queue.list.find((e) => e.id === targetId);
    this.queue.activeId = targetId;

    const viewList = activeQueue.viewList;
    for (let view of viewList) {
      view.canvas.clear();
      await restoreImageList(view);
    }
  }

  /**
   * 清除
   */
  clear() {
    this.queue.list = [];
    this.queue.activeId = 0;
  }
}

let instance;
export function useQueue() {
  if (!instance) {
    instance = new UseQueue();
  }
  return instance;
}
