import lodash from 'lodash';
import hotkeys from 'hotkeys-js';
import store from '@/store';

/**
 * 默认的快捷键
 * - type img:设计图操作 | handle:按钮操作
 * - handle long:长按操作 | '':正常操作
 * */
export let keyList = [
  { handle: 'long', type: 'img', key: 1, label: '上移动', value: 'Up' },
  { handle: 'long', type: 'img', key: 2, label: '下移动', value: 'Down' },
  { handle: 'long', type: 'img', key: 3, label: '左移动', value: 'Left' },
  { handle: 'long', type: 'img', key: 4, label: '右移动', value: 'Right' },
  { handle: '', type: 'img', key: 5, label: '顺时针45°旋转', value: 'Ctrl+Q' },
  { handle: '', type: 'img', key: 6, label: '逆时针45°旋转', value: 'Alt+Q' },
  { handle: 'long', type: 'img', key: 7, label: '放大', value: 'Ctrl+Z' },
  { handle: 'long', type: 'img', key: 8, label: '缩小', value: 'Alt+Z' },
  { handle: '', type: 'img', key: 9, label: '删除', value: 'Delete' },
  { handle: '', type: 'img', key: 31, label: '图案最大化设计', value: 'Ctrl+X' },
  { handle: '', type: 'img', key: 12, label: '图案复制', value: 'Ctrl+C' },
  { handle: '', type: 'img', key: 13, label: '图案宽度最大化', value: 'Ctrl+A' },
  { handle: '', type: 'img', key: 14, label: '图案高度最大化', value: 'Alt+B' },
  { handle: '', type: 'img', key: 15, label: '水平居中', value: 'Ctrl+P' },
  { handle: '', type: 'img', key: 16, label: '垂直居中', value: 'Ctrl+V' },
  { handle: '', type: 'handle', key: 17, label: '保存产品', value: 'Alt+S' },
  { handle: '', type: 'handle', key: 18, label: '全颜色合成', value: '' },
  { handle: '', type: 'handle', key: 19, label: '开关/关闭收藏', value: '' },
  { handle: '', type: 'handle', key: 20, label: '开关/关闭图层', value: '' },
  { handle: '', type: 'handle', key: 21, label: '取色器', value: '' },
  { handle: '', type: 'handle', key: 22, label: '撤销', value: '' },
  { handle: '', type: 'handle', key: 23, label: '恢复', value: '' },
  { handle: '', type: 'handle', key: 24, label: '清空当前设计', value: '' },
  { handle: '', type: 'handle', key: 25, label: '清空全部设计', value: '' },
  { handle: '', type: 'img', key: 26, label: '图层置顶', value: '' },
  { handle: '', type: 'img', key: 27, label: '图案上移', value: '' },
  { handle: '', type: 'img', key: 28, label: '图案下移', value: '' },
  { handle: '', type: 'img', key: 29, label: '顺时针旋转5', value: '' },
  { handle: '', type: 'img', key: 30, label: '逆时针旋转5', value: '' },
  { handle: '', type: 'img', key: 32, label: '图片铺满', value: '' },
  { handle: '', type: 'img', key: 33, label: '水平翻转', value: '' },
  { handle: '', type: 'img', key: 34, label: '垂直翻转', value: '' },
  { handle: '', type: 'img', key: 35, label: '编辑/确认文本', value: '' },
  { handle: '', type: 'img', key: 36, label: '加粗', value: '' },
  { handle: '', type: 'img', key: 37, label: '斜体', value: '' },
  { handle: '', type: 'img', key: 38, label: '下划线', value: '' },
  { handle: '', type: 'img', key: 39, label: '左对齐', value: '' },
  { handle: '', type: 'img', key: 40, label: '居中对齐', value: '' },
  { handle: '', type: 'img', key: 41, label: '右对齐', value: '' },
  { handle: '', type: 'img', key: 42, label: '图层置底', value: '' },
  { handle: '', type: 'handle', key: 43, label: '查看详情', value: '' },
  { handle: '', type: 'handle', key: 44, label: '位置和变换', value: '' },
];

/**
 * 处理默认快捷键
 */
export function disposeHotkeys(data) {
  const list = lodash.cloneDeep(keyList);
  for (let item of list) {
    const d = data.find((e) => e.key === item.key);
    if (d) {
      item.value = d.value;
    }

    item.keys = item.value ? [item.value] : [];
  }

  console.log('disposeHotkeys', list);

  store.state.designApplication.hotkeysList = list;
}
