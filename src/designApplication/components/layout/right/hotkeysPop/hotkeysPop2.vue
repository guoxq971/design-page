<!--快捷键-->
<template>
  <transition name="el-fade-in-linear">
    <div class="container-wrap" v-dragPop="{ top: 23, left: 551 }">
      <!--头部-->
      <div class="header" slot="header">
        <div>
          快捷键
          <span @click="onRefresh" class="el-icon-refresh refresh"></span>
        </div>
        <div @click="onClose" class="close el-icon-close"></div>
      </div>

      <!--列表-->
      <div class="body" v-if="refresh" @mousedown.stop>
        <div class="title-wrap">
          <div class="title">设计图操作</div>
          <div class="title">产品操作</div>
        </div>
        <div class="chunk-wrap">
          <div class="title">设计图操作</div>
          <div class="keys-wrap">
            <div class="item" v-for="item in imgHotkeysList" :key="item.key">
              <div class="item-container">
                <div class="label">{{ item.label }}</div>
                <hotkeyInput class="value" max="1" :hotkey.sync="item.keys" :verify="handleHotkeyVerify" placeholder="绑定按键" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import dragPop from '@/designApplication/core/utils/directives/drag/drag';
import hotkeyInput from '@/designApplication/components/hotkeyInput.vue';
import { mapState } from 'vuex';

export default {
  directives: { dragPop },
  components: {
    hotkeyInput,
  },
  data() {
    return {
      refresh: true,
      // hotKeyList: [
      //   { tag: '1', keys: ['Ctrl+A', 'Alt+D'] },
      //   { tag: [], keys: [] },
      // ],
    };
  },
  computed: {
    ...mapState({
      hotkeysList: (state) => state.designApplication.hotkeysList,
    }),
    imgHotkeysList() {
      return this.hotkeysList.filter((item) => item.type === 'img');
    },
  },
  methods: {
    /**
     * 刷新
     */
    onRefresh() {
      this.refresh = !this.refresh;
      setTimeout(() => {
        this.refresh = true;
      }, 0);
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
      // for (const item of this.hotKeyList) {
      //   for (const key of item.keys) {
      //     if (key.text === hotkey.text) {
      //       this.$notify({
      //         title: '提示',
      //         message: `此快捷键已被绑定`,
      //         type: 'warning',
      //       });
      //       return false;
      //     }
      //   }
      // }
      return true;
    },
  },
};
</script>

<style scoped lang="less">
.container-wrap {
  width: 1000px;
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
    flex-direction: column;

    .title-wrap {
      display: flex;
      .title {
        transition: all 0.3s;
        color: #222;
        padding: 3px 6px;
        border: 1px solid #4087ff;
        margin-right: 5px;
        border-radius: 3px;
        cursor: pointer;
        &:hover {
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        }
      }
    }

    .chunk-wrap {
      margin-top: 10px;
      width: 100%;

      .title {
        color: #222;
        background: #ebeef5;
        padding: 5px 4px 5px 10px;
        border-radius: 4px;
        font-weight: bold;
      }

      @m: 20px;
      .keys-wrap {
        display: flex;
        flex-wrap: wrap;
        width: 100%;

        .item {
          width: calc(33.3% - @m*2 / 3);
          padding: 3px 0;
          display: flex;
          height: 36px;
          margin-bottom: 3px !important;

          &:nth-child(3n - 1) {
            margin: 0 @m;
          }

          .item-container {
            display: flex;
            justify-content: space-between;
            width: 100%;

            .label {
              flex: 1;
              display: flex;
              align-items: center;
              font-size: 13px;
              color: #37474f;
            }

            .value {
              flex: 1;
            }
          }
        }
      }
    }
  }
}
</style>
