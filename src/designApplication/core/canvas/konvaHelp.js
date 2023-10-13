import store from '@/store';

/**
 * konva中的源码判断
 * @description 是否执行konva自定义鼠标事件
 * @param {MouseEvent} event 事件
 * @returns {boolean} 是否执行 true-执行自定义的鼠标事件 false-不执行自定义的鼠标事件
 * */
export function isContinue(event) {
  const cm = store.state.designApplication.konvaCustomMouse;

  return cm && event.isTrusted;
}
