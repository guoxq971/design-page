<template>
  <div class="home">
    <el-button class="container" @click="onCamera">打印相机</el-button>
    <el-tabs type="border-card" class="container">
      <!--产品-->
      <el-tab-pane label="产品" class="prod-container">
        <div class="box-group">
          <el-card shadow="hover" @click.native="onProd(item)" v-for="item in prodList" :key="item.detail.seqId" class="box-container" :class="{ active: activeProd === item }">
            <img :src="item.colorList[0].viewList[0].image" class="prod-img" />
            <img :src="item.colorList[0].viewList[0].texture" class="bg-img" />
          </el-card>
        </div>
      </el-tab-pane>
      <el-tab-pane label="图片"></el-tab-pane>
      <el-tab-pane label="背景"></el-tab-pane>
      <el-tab-pane label="文字"></el-tab-pane>
    </el-tabs>

    <!--当前激活产品的数据展示-->
    <prodInfo v-if="activeProd" :prod="activeProd" />

    <!--2d canvas 视图-->
    <view2dList v-if="activeProd" :prod="activeProd" />

    <!--3d three-->
    <div id="container" class="container-3d"></div>
  </div>
</template>

<script>
import { MyThree } from '@/views/design/three/three';
import { prod3dList, prodList } from '@/views/design/test/data';
import view2dList from '@/views/design/components/view2dList/index.vue';
import prodInfo from '@/views/design/components/prodInfo/index.vue';
import { loadModelItem } from '@/views/design/three/dispose/load3d';
import { initProd } from '@/views/design/test/dispose/getProdItem';
import { ProdStoreItem, ProdType } from '@/views/design/interface/prodItem';
import { ProdStore } from '@/views/design/prodStore';

export default {
  name: 'HomeView',
  components: { view2dList, prodInfo },
  data() {
    return {
      three: null,
      prodList: prodList,
      activeProd: null,
      prodStore: new ProdStore(),
    };
  },
  methods: {
    /**
     * 选择产品
     * @param {ProdItem} item 产品
     * */
    onProd(item) {
      // 清空仓库
      this.prodStore.clear();

      // 赋值当前激活的prod，会加载对应的2d canvas
      this.activeProd = item;

      // 存储在仓库中
      this.prodStore.add(item);

      this.$nextTick(async () => {
        // 获取3d数据
        const config3d = prod3dList.find((e) => e.templateNo === item.detail.templateNo);
        const modelItem = await loadModelItem(item, config3d); // 加载3d数据
        this.three.modelList.push(modelItem); // 添加到模型列表
        this.three.scene.add(modelItem.model); // 添加到场景
        this.three.setActiveModel(modelItem); // 激活当前模型
      });
    },
    /**
     * 打印当前相机位置
     * */
    onCamera() {
      console.log(this.three.camera.position);
    },
  },
  mounted() {
    this.three = new MyThree();
  },
};
</script>

<style scoped lang="less">
.home {
  position: relative;
  width: 100vw;
  height: 100vh;
  //background-color: #18181c;
  //background-size:
  //  15px 15px,
  //  15px 15px;
  //background-image: linear-gradient(#18181c 14px, transparent 0), linear-gradient(90deg, transparent 14px, #86909c 0);

  .active {
    border: 1px solid #409eff;
  }
  .container {
    width: 400px;
    position: relative;
    z-index: 2;
  }
  .prod-container {
    //width: 400px;
    .box-group {
      .box-container {
        transition: all 0.5s;
        position: relative;
        width: 80px;
        height: 80px;
        //border: 1px solid transparent;
        /deep/ .el-card__body {
          padding: 0 !important;
        }
        &:hover {
          cursor: pointer;
          border: 1px solid #409eff;
        }
        .prod-img {
          width: 100%;
          height: 100%;
          position: absolute;
        }
        .bg-img {
          width: 100%;
          height: 100%;
          position: absolute;
        }
      }
    }
  }
  .container-3d {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
}
</style>
