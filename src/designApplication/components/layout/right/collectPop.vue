<!--收藏列表-->
<template>
  <transition name="el-fade-in-linear">
    <div class="list-group" v-dragPop="{ left: 1350, top: 90 }">
      <div class="img-warp" style="position: relative">
        <div class="title drag1">收藏图片</div>
        <div class="list-wrap">
          <div class="box-wrap" v-for="item in collectImageList" :key="item.id" @click.stop="onClickImage(item)" @mousedown.stop @contextmenu="(e) => onContextmenu(item, e)">
            <el-image class="img" :src="item.designImg" />
          </div>
        </div>
      </div>
      <div class="img-warp" style="position: relative">
        <div class="title drag1">收藏背景</div>
        <div class="list-wrap">
          <div class="box-wrap" v-for="item in collectBgImageList" :key="item.id" @click="onClickImageBg(item)" @mousedown.stop @contextmenu="(e) => onContextmenu(item, e)">
            <el-image class="box-wrap" :src="item.designImg" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapState } from 'vuex';
import dragPop from '@/designApplication/core/utils/directives/drag/drag';
import { collectImageFn } from '@/designApplication/core/utils/common';
import { queue_define, useQueue } from '@/designApplication/core/utils/useQueue';

export default {
  name: 'collectList',
  directives: { dragPop },
  data() {
    return {
      dragBox1: {
        dragBarClass: 'drag1',
        dragContainerId: 'app2',
      },
    };
  },
  computed: {
    ...mapState({
      collectImageList: (state) => state.designApplication.collectImageList,
      collectBgImageList: (state) => state.designApplication.collectBgImageList,
    }),
  },
  methods: {
    /**
     * 右键删除
     * @param {import('@/design').CollectImageListItem} image
     * @param {MouseEvent} e
     */
    async onContextmenu(image, e) {
      e.preventDefault();
      await collectImageFn(image);
    },
    /**
     * 选择设计图 - 设计图
     * @param {import('@/design').CollectImageListItem} image
     */
    async onClickImage(image) {
      await this.$store.dispatch('designApplication/setImage', { detail: image });

      // 操作记录
      useQueue().add(queue_define.create_image);
    },
    /**
     * 选择设计图 - 背景图
     * @param {import('@/design').CollectImageListItem} image
     */
    async onClickImageBg(image) {
      await this.$store.dispatch('designApplication/setImage', { detail: image });

      // 操作记录
      useQueue().add(queue_define.create_image);
    },
  },
};
</script>

<style lang="less" scoped>
.bdr {
  border-right: 1px solid #ccc;
}

.list-group {
  width: 150px;
  height: 810px;
  user-select: none;
  //position: absolute;
  //right: 358px;
  z-index: 11;
  display: flex;
  justify-content: center;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  background-color: #fff;

  .img-warp {
    display: flex;
    flex-direction: column;
    //margin-right: 7px;
    flex: 1;
    align-items: center;

    &:last-child {
      margin-right: 0;
    }

    .title {
      padding: 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      //font-weight: bold;
      height: 30px;
      background-color: #409eff;
      width: 100%;
      color: #fff;
      margin-bottom: 3px;
    }

    .list-wrap {
      flex: 1;
      height: 0;
      overflow: auto;
    }
  }

  .box-wrap {
    border-radius: 4px;
    overflow: hidden;
    width: 64px;
    height: 64px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 3px;

    .img {
      width: 64px;
      height: 64px;
      background-color: rgb(238 238 238);
    }

    &:hover {
      border: 1px solid #4087ff;
    }
  }
}
</style>
