<!--快捷键-->
<template>
  <transition name="el-fade-in-linear">
    <div class="container-wrap" v-dragPop="{ top: 23, left: 551 }">
      <!--头部-->
      <div class="header" slot="header" style="cursor: move">
        <div>
          快捷键
          <span @click="onRefresh" class="el-icon-refresh refresh"></span>
        </div>
        <div @click="onClose" class="close el-icon-close"></div>
      </div>

      <!--列表-->
      <div class="body" v-if="refresh" @mousedown.stop>
        <div style="margin-bottom: 10px; display: flex; justify-content: flex-end">
          <!--自定义快捷键-->
          <el-button type="primary" v-if="!costomBtn" @click="onCostom">自定义快捷键</el-button>
          <template v-else>
            <el-button @click="onDefault">默认</el-button>
            <el-button @click="onCostomClear">清空</el-button>
            <el-button @click="onCostomSave" type="primary">保存</el-button>
            <el-button @click="onCostomCancel">取消</el-button>
          </template>
        </div>
        <div class="list-body" id="list-body">
          <div class="chunk-wrap" v-for="item in renderList" :key="item.title">
            <div class="title-chunk">{{ item.title }}</div>
            <!--正常块-->
            <div class="list-chunk list-chunk-2" v-if="['layer'].includes(item.id)">
              <keyCodeChunk :costomBtn="costomBtn" :left-list="item.left.slice(0, 6)" :right-list="item.right.slice(0, 6)" :verify="verify" />
              <el-divider />
              <keyCodeChunk :costomBtn="costomBtn" :left-list="item.left.slice(6)" :right-list="item.right.slice(6)" :verify="verify" />
            </div>
            <!--正常块-->
            <div class="list-chunk" v-else>
              <keyCodeChunk :costomBtn="costomBtn" :left-list="item.left" :right-list="item.right" :verify="verify" />
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
import keyCodeChunk from './keyCodeChunk.vue';
import lodash from 'lodash';
import { define_hotKeysList, getDefaultHotkeys, hotkeysFormat, keyList } from '@/designApplication/core/utils/hotkeys';
import { saveHotkeysApi } from '@/designApplication/apis/common';
import store from '@/store';

export default {
  directives: { dragPop },
  components: {
    hotkeyInput,
    keyCodeChunk,
  },
  data() {
    return {
      costomList: [],
      // 自定义快捷键
      costomBtn: false,
      list: lodash.cloneDeep(define_hotKeysList),
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
    renderList() {
      if (this.costomBtn) {
        return this.costomList;
      }
      return this.list;
    },
  },
  watch: {
    hotkeysList: {
      handler(val) {
        if (val && val.length) {
          this.list.forEach((item) => {
            item.left.forEach((e) => {
              e.value = hotkeysFormat(this.hotkeysList.find((e2) => e2.key === e.key)?.value);
            });
            item.right.forEach((e) => {
              e.value = hotkeysFormat(this.hotkeysList.find((e2) => e2.key === e.key)?.value);
            });
          });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    /**
     * 默认自定义
     */
    onDefault() {
      const _list = lodash.cloneDeep(define_hotKeysList);

      _list.forEach((item) => {
        item.left.forEach((e) => {
          e.value = hotkeysFormat(keyList.find((e2) => e2.key === e.key)?.value);
        });
        item.right.forEach((e) => {
          e.value = hotkeysFormat(keyList.find((e2) => e2.key === e.key)?.value);
        });
      });

      this.costomList = _list;
    },
    /**
     * 清空自定义
     */
    onCostomClear() {
      this.costomList.forEach((item) => {
        item.left.forEach((e) => {
          e.value = '';
        });
        item.right.forEach((e) => {
          e.value = '';
        });
      });
    },
    /**
     * 保存自定义
     */
    async onCostomSave() {
      const list = [];
      this.costomList.forEach((e) => {
        e.left.forEach((e2) => {
          list.push({ key: e2.key, value: e2.value });
        });
        e.right.forEach((e2) => {
          list.push({ key: e2.key, value: e2.value });
        });
      });

      await saveHotkeysApi(list);
      this.$message.success('保存成功');
      store.state.designApplication.hotkeysList = list;
      this.costomBtn = false;
    },
    /**
     * 取消自定义
     */
    onCostomCancel() {
      this.costomBtn = false;
    },
    // 自定义快捷键
    onCostom() {
      this.costomBtn = true;
      this.costomList = lodash.cloneDeep(this.list);
    },
    /**
     * 校验输入
     */
    verify(data) {
      const text = data.value.text;
      const key = data.key;
      let result;

      for (let item of this.list) {
        const d = item.left.find((e) => e.key !== key && e.value.toLowerCase() === text.toLowerCase());
        if (d) {
          result = d;
          break;
        }

        const d2 = item.right.find((e) => e.key !== key && e.value.toLowerCase() === text.toLowerCase());
        if (d2) {
          result = d2;
          break;
        }
      }

      if (result) {
        this.$message.warning(`快捷键 ${text} 已被绑定 ${result.label}`);
        return false;
      }

      return true;
    },
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
      this.$store.commit('designApplication/setVisibleHotkeys', false);
    },
  },
};
</script>

<style scoped lang="less">
.container-wrap {
  width: 534px;
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

    .list-body {
      width: 100%;
      flex: 1;
      overflow: auto;
      overscroll-behavior: contain;

      .chunk-wrap {
        .title-chunk {
          font-size: 14px;
          font-weight: bold;
          display: flex;
          align-items: center;
          height: 33px;
          background-color: #f2f2f2;
          padding-left: 10px;
          letter-spacing: 1px;
        }

        .list-chunk {
          display: flex;
          width: 100%;
          margin: 9px 0;
        }

        .list-chunk-2 {
          flex-direction: column;

          ::v-deep .el-divider--horizontal {
            margin: 8px 0 !important;
          }
        }
      }
    }
  }
}
</style>
