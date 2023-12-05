<!--录制快捷键-->
<template>
  <div class="shortcut-key-input" :class="{ cursor: focus }" :style="$props.style" tabindex="0" @focus="handleFocus" @blur="onBlur" @keydown="handleKeydown">
    <template v-if="list.length">
      <template v-for="(item, index) in list">
        <span :key="`${item.text}_${index}`">
          {{ item.text }}
          <i @click="handleDeleteKey(index)"></i>
        </span>
      </template>
    </template>
    <div v-else class="placeholder">{{ placeholder }}</div>
  </div>
</template>

<script>
// 数字键盘
const CODE_NUMBER = Array.from({ length: 10 }, (v, k) => `Digit${k + 1}`);
// 数字键盘
const CODE_NUMPAD = Array.from({ length: 10 }, (v, k) => `Numpad${k + 1}`);
// a-z
const CODE_ABC = Array.from({ length: 26 }, (v, k) => `Key${String.fromCharCode(k + 65).toUpperCase()}`);
// f1-f12
const CODE_FN = Array.from({ length: 12 }, (v, k) => `F${k + 1}`);
// 方向键
const CODE_DIRECTION = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
// 特殊符号
const CODE_SYMBOL = [
  ['-', 'Minus'],
  ['=', 'Equal'],
  [',', 'Comma'],
  ['.', 'Period'],
  ['[', 'BracketLeft'],
  [']', 'BracketRight'],
  //; Semicolon
  [';', 'Semicolon'],
  // ' Quote
  ["'", 'Quote'],
  //, Comma
  [',', 'Comma'],
  // . Period
  ['.', 'Period'],
  // / Slash
  ['/', 'Slash'],
  // \ Backslash
  ['\\', 'Backslash'],
  // Tab Tab
  ['Tab', 'Tab'],
  // Backspace Backspace 删除键
  ['Backspace', 'Backspace'],
];
// 控制键
const CODE_CONTROL = [
  ['Shift', 'ShiftLeft', 'ShiftRight'],
  ['Control', 'ControlLeft', 'ControlRight'],
  ['Alt', 'AltLeft', 'AltRight'],
];
export default {
  name: 'HotKeyInput',
  props: {
    // 默认绑定值
    // 传入 ['Ctrl+d'] 格式时会自动处理成 [{ text: 'Ctrl+d', controlKey: { altKey: false, ctrlKey: true, shiftKey: false, key: 'd', code: 'KeyD } }]
    hotkey: {
      type: Array,
      required: true,
    },
    // 校验函数 判断是否允许显示快捷键
    verify: {
      type: Function,
      default: () => true,
    },
    // 无绑定时提示文字
    placeholder: {
      type: String,
      default: '',
    },
    // 限制最大数量
    max: {
      type: [String, Number],
      default: 0,
    },
    // 快捷键使用范围
    range: {
      type: Array,
      default: () => ['NUMBER', 'NUMPAD', 'ABC', 'FN', 'DIRECTION', 'SYMBOL'],
    },
  },
  data() {
    return {
      focus: false,
      list: [],
      keyRange: [],
    };
  },
  watch: {
    list: function (list) {
      if (list.length) this.focus = false;
      // this.$emit('update:hotkey', this.list);
    },
    hotkey: {
      handler: function (val) {
        if (!val.length) return;
        const list = [];
        val.forEach((item) => {
          const arr = item.split('+');
          const controlKey = {
            altKey: arr.includes('Alt'),
            ctrlKey: arr.includes('Control'),
            shiftKey: arr.includes('Shift'),
            key: arr[arr.length - 1],
            code: `Key${arr[arr.length - 1].toUpperCase()}`,
          };
          list.push({
            text: arr.reduce((text, cur, i) => {
              if (i) text += '+';
              if (controlKey.key === cur) text += cur.toUpperCase();
              else text += cur;
              return text;
            }, ''),
            controlKey,
          });
        });
        this.list = list;
      },
      immediate: true,
    },
    range: {
      handler: function (val) {
        const keyRangeList = {
          NUMBER: CODE_NUMBER,
          NUMPAD: CODE_NUMPAD,
          ABC: CODE_ABC,
          FN: CODE_FN,
          DIRECTION: CODE_DIRECTION,
          SYMBOL: CODE_SYMBOL.flat(),
        };
        val.forEach((item) => {
          this.keyRange = this.keyRange.concat(keyRangeList[item.toUpperCase()]);
        });
      },
      immediate: true,
    },
  },
  methods: {
    beforeunload(event) {
      // 这里可以添加一些你想要执行的逻辑，例如弹窗提示用户是否真的要离开页面
      const confirmationMessage = '确定离开当前页面吗？';
      event.returnValue = confirmationMessage; // 兼容老版本浏览器
      return confirmationMessage;
    },
    /**
     * 屏蔽非法快捷键
     */
    banHotkeys() {
      window.addEventListener('beforeunload', this.beforeunload);
    },
    /**
     * 失焦
     */
    onBlur() {
      this.focus = false;
      window.removeEventListener('beforeunload', this.beforeunload);
    },
    /**
     * 聚焦
     */
    handleFocus() {
      if (!this.list.length) {
        this.focus = true;
      }
    },
    /**
     * 删除快捷键
     * @param index
     */
    handleDeleteKey(index) {
      this.list.splice(index, 1);
    },
    /**
     * 键盘按下
     * @param e
     */
    handleKeydown(e) {
      this.banHotkeys();
      const { altKey, ctrlKey, shiftKey, key, code } = e;

      console.log(key, code);

      // ctrl，alt，shift
      if (!CODE_CONTROL.flat().includes(key)) {
        // 是否在范围内
        if (!this.keyRange.includes(code)) return;

        // 组装按下的快捷键
        let controlKey = '';
        [
          { key: altKey, text: 'Alt' },
          { key: ctrlKey, text: 'Ctrl' },
          { key: shiftKey, text: 'Shift' },
        ].forEach((curKey) => {
          if (curKey.key) {
            if (controlKey) controlKey += '+';
            controlKey += curKey.text;
          }
        });

        // 是否按下
        if (key) {
          if (controlKey) controlKey += '+';
          controlKey += key.toUpperCase();
        }

        this.addHotkey({
          text: controlKey,
          controlKey: { altKey, ctrlKey, shiftKey, key, code },
        });
      }
      e.preventDefault();
    },
    /**
     * 添加快捷键
     * @param data
     */
    addHotkey(data) {
      // 是否已存在
      if (this.list.length && this.list.some((item) => data.text === item.text)) {
        return;
      }
      // 是否超过最大数量
      if (this.list.length && this.list.length.toString() === this.max.toString()) {
        return;
      }
      // 是否允许添加
      if (!this.verify(data)) {
        return;
      }

      this.list.push(data);
    },
  },
};
</script>

<style scoped>
@keyframes Blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.shortcut-key-input {
  position: relative;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  width: 100%;
  height: 40px;
  //padding: 2px 0;
  cursor: text;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.shortcut-key-input:focus {
  border-color: #188cff;
  box-shadow: 0 0 4px rgba(24, 140, 255, 0.38);
}

.shortcut-key-input.cursor::after {
  content: '|';
  animation: Blink 1.2s ease 0s infinite;
  font-size: 18px;
  position: absolute;
  top: 7px;
  left: 8px;
}

.shortcut-key-input span {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  background-color: #f4f4f5;
  border-color: #e9e9eb;
  color: #909399;
  padding: 0 22px 0 8px;
  height: 28px;
  font-size: 13px;
  line-height: 28px;
  border-radius: 4px;
  margin: 5px;
}

.shortcut-key-input .placeholder {
  position: absolute;
  top: 12px;
  left: 11px;
  color: #c0c4cc;
  font-size: 13px;
  text-indent: 4px;
  font: 400 13.3333px Arial;
}

.shortcut-key-input span i {
  position: absolute;
  top: 6px;
  right: 4px;
  content: '';
  background: url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M512 64C264.58 64 64 264.58 64 512s200.58 448 448 448 448-200.58 448-448S759.42 64 512 64zm0 832c-212.08 0-384-171.92-384-384s171.92-384 384-384 384 171.92 384 384-171.92 384-384 384z' fill='%23909399'/%3E%3Cpath d='M625.14 353.61L512 466.75 398.86 353.61a32 32 0 0 0-45.25 45.25L466.75 512 353.61 625.14a32 32 0 0 0 45.25 45.25L512 557.25l113.14 113.14a32 32 0 0 0 45.25-45.25L557.25 512l113.14-113.14a32 32 0 0 0-45.25-45.25z' fill='%23909399'/%3E%3C/svg%3E")
    no-repeat center;
  background-size: contain;
  width: 14px;
  height: 14px;
  transform: scale(0.9);
  opacity: 0.6;
}

.shortcut-key-input span i:hover {
  cursor: pointer;
  opacity: 1;
}
</style>
