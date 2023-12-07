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
        <div class="list-body" id="list-body">
          <div class="chunk-wrap" v-for="item in list" :key="item.title">
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

export default {
  directives: { dragPop },
  components: {
    hotkeyInput,
    keyCodeChunk,
  },
  data() {
    return {
      costomBtn: true,
      list: [
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
      ],
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
  },
  watch: {
    hotkeysList: {
      handler(val) {
        if (val && val.length) {
          this.list.forEach((item) => {
            item.left.forEach((e) => {
              e.value = this.hotkeysList.find((e2) => e2.key === e.key)?.value;
            });
            item.right.forEach((e) => {
              e.value = this.hotkeysList.find((e2) => e2.key === e.key)?.value;
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
     * 转小写
     */
    toLowerCase(str) {
      return str.toLowerCase();
    },
    /**
     * 校验输入
     */
    verify(data) {
      const text = data.value.text;
      const key = data.key;
      let result;

      for (let item of this.list) {
        const d = item.left.find((e) => e.key !== key && this.toLowerCase(e.value) === this.toLowerCase(text));
        if (d) {
          result = d;
          break;
        }

        const d2 = item.right.find((e) => e.key !== key && this.toLowerCase(e.value) === this.toLowerCase(text));
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
      padding-right: 5px;

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
