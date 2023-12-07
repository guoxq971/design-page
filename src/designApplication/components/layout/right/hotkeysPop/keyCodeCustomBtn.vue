<template>
  <hotkeyInput :hotkey.sync="c_value" :max="1" placeholder="绑定按键" :verify="verify" />
</template>

<script>
import hotkeyInput from '@/designApplication/components/hotkeyInput.vue';
export default {
  components: {
    hotkeyInput,
  },
  props: {
    value: { type: String, default: '' },
    verify: { type: Function, default: () => false },
  },
  data() {
    return {
      c_value: '',
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.c_value = val;
      },
    },
    c_value() {
      this.$emit('update:value', this.c_value);
    },
  },
};
</script>
