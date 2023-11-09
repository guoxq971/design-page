<!--历史设计记录-->
<template>
  <transition name="el-fade-in-linear">
    <div class="history-wrap" v-dragPop="{ top: 99, left: 1163 }">
      <!--头部-->
      <div class="header" slot="header">
        <div>我最近设计过的产品</div>
        <div @click="onClose" class="close el-icon-close"></div>
      </div>

      <!--列表-->
      <div class="body">
        <box-adaptive width="33.33%" height="120%" margin="1%" v-for="item in showList">
          <div class="box-wrap" v-loading="item.loading" @mousedown.stop>
            <div class="close el-icon-circle-close"></div>
            <box-adaptive margin="0" class="pic">
              <el-image :src="item.imgUrl" />
            </box-adaptive>
            <div class="title">{{ item.code }}</div>
          </div>
        </box-adaptive>

        <!--空盒子-->
        <box-adaptive width="33%" height="120%" margin="1%" v-for="item in 6 - showList.length" />
      </div>

      <!--分页-->
      <div class="footer">
        <pageContainer :get-list="getList" :param="params" :total="total" />
      </div>
    </div>
  </transition>
</template>

<script>
import pageContainer from '@/designApplication/components/page.vue';
import { getHistoryList } from '@/designApplication/apis/prod';
import dragPop from '@/designApplication/core/utils/directives/drag/drag';
import { mapState } from 'vuex';
export default {
  directives: { dragPop },
  components: {
    pageContainer,
  },
  data() {
    return {
      /**
       * @type {import('@/design').HistoryItem[]}
       */
      params: {
        pageNum: 1,
        pageSize: 6,
      },
    };
  },
  computed: {
    ...mapState({
      historyList: (state) => state.designApplication.historyList,
    }),
    total() {
      return this.historyList.length;
    },
    showList() {
      return this.historyList.slice((this.params.pageNum - 1) * this.params.pageSize, this.params.pageNum * this.params.pageSize);
    },
  },
  methods: {
    /**
     * 关闭弹窗
     */
    onClose() {
      this.$store.commit('designApplication/setHistoryVisible', false);
    },
    /**
     * 获取历史记录列表
     */
    getList() {
      this.$store.dispatch('designApplication/getHistoryList');
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped lang="less">
.history-wrap {
  width: 350px;
  position: absolute;
  //top: 0;
  //left: -355px;
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

    .box-wrap {
      transition: all 0.3s;
      border: 1px solid #eee;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      &:hover {
        border-color: #409eff;
      }

      .close {
        position: absolute;
        right: 4px;
        top: 4px;
        cursor: pointer;
        font-size: 16px;
        z-index: 2;
        color: #333;
        &:hover {
          color: #409eff;
        }
      }

      .pic {
        cursor: pointer;
        user-select: none;
      }

      .title {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 21px;
      }
    }
  }

  .footer {
    height: 30px;
    //background-color: green;
    margin-top: 8px;
    margin-bottom: 5px;
  }
}
</style>
