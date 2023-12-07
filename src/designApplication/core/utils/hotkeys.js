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
 * 获取默认快捷键
 */
export function getDefaultHotkeys() {
  const list = lodash.cloneDeep(keyList);
  for (let item of list) {
    item.keys = item.value ? [item.value] : [];
  }

  list.forEach((item) => (item.value = hotkeysFormat(item.value)));

  return list;
}

/**
 * 接收接口的数据，处理默认快捷键
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

  list.forEach((item) => (item.value = hotkeysFormat(item.value)));

  store.state.designApplication.hotkeysList = list;
}

/**
 * 格式化内容
 * @param text
 * @returns {*}
 */
export function hotkeysFormat(text) {
  const item = {
    text: text,
  };

  // 转换
  // UP,ArrowUp -> ↑
  // 转大写
  if (['UP', 'ArrowUp'].includes(item.text.toUpperCase())) {
    item.text = item.text.replace('Up', '↑').replace('up', '↑').replace('UP', '↑').replace('ArrowUp', '↑');
  }
  // DOWN,ArrowDown -> ↓
  if (['DOWN', 'ArrowDown'].includes(item.text.toUpperCase())) {
    item.text = item.text.replace('Down', '↓').replace('down', '↓').replace('DOWN', '↓').replace('ArrowDown', '↓');
  }
  // LEFT,ArrowLeft -> ←
  if (['LEFT', 'ArrowLeft'].includes(item.text.toUpperCase())) {
    item.text = item.text.replace('Left', '←').replace('left', '←').replace('LEFT', '←').replace('ArrowLeft', '←');
  }
  // RIGHT,ArrowRight -> →
  if (['RIGHT', 'ArrowRight'].includes(item.text.toUpperCase())) {
    item.text = item.text.replace('Right', '→').replace('right', '→').replace('RIGHT', '→').replace('ArrowRight', '→');
  }
  // 首字母 ctrl -> Ctrl, alt -> Alt, shift -> Shift
  item.text = item.text.replace('ctrl', 'Ctrl').replace('alt', 'Alt').replace('shift', 'Shift');

  return item.text;
}

/**
 * 常量
 */
export const define_hotKeysList = [
  {
    title: '通用操作',
    id: 'common',
    left: [
      { key: 17, label: '保存产品', value: '' },
      { key: 18, label: '全颜色合成', value: '' },
      { key: 19, label: '开关/关闭收藏', value: '' },
      { key: 20, label: '开关/关闭图层', value: '' },
      { key: 21, label: '取色器', value: '' },
    ],
    right: [
      { key: 22, label: '撤销', value: '' },
      { key: 23, label: '重做', value: '' },
      { key: 24, label: '清空当前设计', value: '' },
      { key: 25, label: '清空全部设计', value: '' },
      { key: 43, label: '查看详情', value: '' },
    ],
  },
  {
    title: '图层操作',
    id: 'layer',
    left: [
      { key: 9, label: '删除', value: '' },
      { key: 12, label: '图案复制', value: '' },
      { key: 26, label: '图层置顶', value: '' },
      { key: 42, label: '图层置底', value: '' },
      { key: 27, label: '图案上移', value: '' },
      { key: 28, label: '图案下移', value: '' },
      { key: 7, label: '放大', value: '' },
      { key: 8, label: '缩小', value: '' },
      { key: 5, label: '顺时针旋转45°', value: '' },
      { key: 29, label: '顺时针旋转5°', value: '' },
      { key: 6, label: '逆时针旋转45°', value: '' },
      { key: 30, label: '逆时针旋转5°', value: '' },
    ],
    right: [
      { key: 1, label: '上移动', value: '' },
      { key: 2, label: '下移动', value: '' },
      { key: 3, label: '左移动', value: '' },
      { key: 4, label: '右移动', value: '' },
      { key: 15, label: '水平居中', value: '' },
      { key: 16, label: '垂直居中', value: '' },
      { key: 31, label: '图案最大化设计', value: '' },
      { key: 13, label: '图案宽度最大化', value: '' },
      { key: 14, label: '图案高度最大化', value: '' },
      // { key: 32, label: '图片铺满', value: '' },
      { key: 33, label: '水平翻转', value: '' },
      { key: 34, label: '垂直翻转', value: '' },
      { key: 44, label: '位置和变换', value: '' },
    ],
  },
  {
    title: '文字操作',
    id: 'text',
    left: [
      // { key: 35, label: '编辑/确认文本', value: '' },
      { key: 36, label: '加粗', value: '' },
      { key: 37, label: '斜体', value: '' },
      { key: 38, label: '下划线', value: '' },
    ],
    right: [
      // { key: 39, label: '左对齐', value: '' },
      // { key: 40, label: '居中对齐', value: '' },
      // { key: 41, label: '右对齐', value: '' },
    ],
  },
];
