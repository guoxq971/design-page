/*
 * el-button 失去焦点
 * */
export function buttonBlur(evt) {
  if (!evt) return;
  let target = evt.target;

  if (target.nodeName == 'SPAN') {
    target = evt.target.parentNode;
  } else if (target.nodeName == 'ICONPARK-ICON') {
    target = evt.target.parentNode.parentNode;
  }
  if (target.nodeName !== 'BUTTON') {
    target = target.parentNode;
  }
  if (target.nodeName !== 'BUTTON') {
    target = target.parentNode;
  }
  if (target.nodeName !== 'BUTTON') {
    target = target.parentNode;
  }
  target.blur();
}
