<!--快捷键-->
<template>
  <transition name="el-fade-in-linear">
    <div class="container-wrap" v-dragPop="{ top: 99, left: 1163 }">
      <!--头部-->
      <div class="header" slot="header">
        <div>
          快捷键
          <span @click="getList" class="el-icon-refresh refresh"></span>
        </div>
        <div @click="onClose" class="close el-icon-close"></div>
      </div>

      <!--列表-->
      <div class="body">
        <hotkeyInput class="hotkey" :hotkey.sync="hotKeyList[0].keys" :verify="handleHotkeyVerify" placeholder="请按需要绑定的按键，支持组合按键" />
      </div>
    </div>
  </transition>
</template>

<script>
import dragPop from '@/designApplication/core/utils/directives/drag/drag';
import hotkeyInput from '@/designApplication/components/hotkeyInput.vue';

export default {
  directives: { dragPop },
  components: {
    hotkeyInput,
  },
  data() {
    return {
      hotKeyList: [
        { tag: '1', keys: ['Ctrl+A', 'Alt+D'] },
        { tag: [], keys: [] },
      ],
    };
  },
  methods: {
    /**
     * 获取列表
     */
    getList() {
      console.log('getList');
    },
    /**
     * 关闭
     */
    onClose() {
      console.log('onClose');
    },
    /**
     * 校验
     * @param hotkey
     * @returns {boolean}
     */
    handleHotkeyVerify(hotkey) {
      for (const item of this.hotKeyList) {
        for (const key of item.keys) {
          if (key.text === hotkey.text) {
            this.$notify({
              title: '提示',
              message: `此快捷键已被绑定`,
              type: 'warning',
            });
            return false;
          }
        }
      }
      return true;
    },
  },
};
</script>

<style scoped lang="less">
.container-wrap {
  width: 350px;
  position: absolute;
  z-index: 10;
  background-color: #fff;
  padding: 0 5px;
  border-radius: 5px;

  /deep/ .el-card__header {
    padding: 0;
  }
  .header {
    padding: 7px 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    font-weight: bold;
    cursor: default;

    .refresh {
      cursor: pointer;
    }

    .close {
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      &:hover {
        color: #409eff;
      }
    }
  }

  .body {
    margin-top: 2px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
  }
}
</style>
