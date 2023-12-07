<template>
  <el-input v-model="val" size="mini" ref="ipt" @focus="handlerFocus()" @blur="handlerBlur()" clearable @clear="onClear" />
</template>

<script>
import moment from 'moment/moment';
import lodash from 'lodash';

class keyType {
  constructor(key, time) {
    this.key = key;
    this.time = time;
  }
}

export default {
  name: 'keyCodeCustomBtn',
  props: {
    value: { type: String, default: '' },
  },
  watch: {
    val() {
      this.$emit('update:value', this.val);
    },
    value: {
      immediate: true,
      handler(val) {
        this.val = val;
      },
    },
  },
  data() {
    return {
      keyList,
      val: '',
      // 每次间隔
      cd: 300,
      // 特殊字符
      special: ['Ctrl', 'Control', 'Shift', 'Alt'],
      // 按下列表
      downList: [],
      // 弹起列表
      upList: [],
    };
  },
  methods: {
    // 手动清空
    onClear() {
      this.downList = [];
    },
    /*
     * 输入框显示的监听函数处理
     * @param {array} val 监听函数的数组
     * */
    iptWatch2(type) {
      let val;
      if (type === 'down') {
        val = this.downList.map((e) => e.key);
      }
      if (type === 'up') {
        let o = [];
        let l = lodash.cloneDeep(this.upList);
        // 按下的长度 === 0
        if (this.downList.length === 0) {
          if (this.upList.length >= 2) {
            for (let l1 of l) {
              for (let l2 of l) {
                if (l1.key !== l2.key && Math.abs(l1.time - l2.time) < this.cd) {
                  o.push(l1);
                  break;
                }
              }
            }
            if (o.length === 0) {
              l.sort((a, b) => b.time - a.time);
              o.push(l[0]);
            }
          } else {
            o = this.upList;
          }
        }
        // 按下的长度 !== 0
        else {
          o = this.downList;
        }
        val = o.map((e) => e.key);
      }
      let a = [],
        b = [],
        c = [],
        d = [];
      let str = '';
      if (!val.every((e) => this.special.includes(e)) || this.downList.length) {
        for (let v of val) {
          if (this.special.includes(v)) {
            b.push(v);
          } else {
            c.push(v);
          }
        }
        for (let s of this.special) {
          b.includes(s) && d.push(s);
        }
        a = [...d, ...c];
        str = a.join('+');
      }
      this.val = str;
      this.$nextTick(() => this.$refs.ipt.focus());
    },
    /*
     * 输入框失焦
     * */
    handlerBlur() {
      window.removeEventListener('keyup', this.onKeyup, false);
      window.removeEventListener('keydown', this.onKeydown, false);
    },
    /*
     * 输入框聚焦
     * */
    handlerFocus() {
      window.addEventListener('keyup', this.onKeyup, false);
      window.addEventListener('keydown', this.onKeydown, false);
    },
    /*
     * 键盘弹起处理
     * @param {Event} 键盘事件的默认参数
     * */
    onKeyup(event) {
      event.preventDefault();
      let key = event.key === 'Control' ? 'Ctrl' : event.key;
      let d = new keyType(key, moment().valueOf());
      let i = this.upList.findIndex((e) => e.key === key);
      if (i === -1) {
        let i2 = this.upList.findIndex((e) => !this.special.includes(e));
        // 当前key是非特殊 && upList中存在非特殊
        if (!this.special.includes(key) && i2 !== -1) {
          this.upList.splice(i2, 1, d);
        } else {
          this.upList.push(d);
        }
      } else {
        this.upList.splice(i, 1, d);
      }
      let i2 = this.downList.findIndex((e) => e.key === key);
      if (i2 !== -1) {
        this.downList.splice(i2, 1);
      }
      this.iptWatch2('up');
    },
    /*
     * 键盘按下处理
     * @param {Event} 键盘事件的默认参数
     * */
    onKeydown(event) {
      event.preventDefault();
      // 字符转换处理
      let key = event.key;
      if (event.key === 'Control') {
        key = 'Ctrl';
      } else if (event.key === 'ArrowUp') {
        key = 'Up';
      } else if (event.key === 'ArrowDown') {
        key = 'Down';
      } else if (event.key === 'ArrowLeft') {
        key = 'Left';
      } else if (event.key === 'ArrowRight') {
        key = 'Right';
      }
      let d = new keyType(key, moment().valueOf());
      let i = this.downList.findIndex((e) => e.key === key);
      if (i === -1) {
        this.downList.push(d);
        this.iptWatch2('down');
      }
    },
  },
};
</script>

<style scoped></style>
