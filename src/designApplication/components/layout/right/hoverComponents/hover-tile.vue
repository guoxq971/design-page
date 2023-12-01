<template>
  <el-popover placement="bottom" width="260" trigger="click">
    <div class="hover-wrap">
      <div class="hover-wrap">
        <div class="img">不平铺</div>
        <div class="img" @click="onTile">平铺</div>
        <div class="img">
          <span>交错</span>
          <span>平铺</span>
        </div>
        <div class="img">
          <span>镜像</span>
          <span>平铺</span>
        </div>
      </div>
    </div>
    <div>
      <div style="display: flex">
        <span style="white-space: nowrap">水平间距</span>
        <el-input v-model.number="params.gapX"></el-input>
      </div>
      <div style="display: flex">
        <span style="white-space: nowrap">垂直间距</span>
        <el-input v-model.number="params.gapY"></el-input>
      </div>
      <div style="display: flex">
        <span style="white-space: nowrap">交错类型</span>
        <el-radio-group v-model="params.offsetType">
          <el-radio label="x">水平交错</el-radio>
          <el-radio label="y">垂直交错</el-radio>
        </el-radio-group>
      </div>
      <div style="display: flex">
        <span style="white-space: nowrap">交错偏移量</span>
        <el-input v-model.number="params.offset"></el-input>
      </div>
      <el-button @click="onEdit">修改</el-button>
    </div>

    <div style="width: 100%; height: 100%" v-title="'平铺'" slot="reference">
      <div class="name">平铺</div>
      <div class="right-bottom-corner">
        <div class="interior" />
      </div>
    </div>
  </el-popover>
</template>

<script>
import title from '@/designApplication/core/utils/directives/title/title';
import { DesignImageUtil } from '@/designApplication/core/utils/designImageUtil';
import { Konva } from '@/designApplication/core/canvas/konva';
import { uuid } from '@/designApplication/core/utils/uuid';

class TileImage {
  x;
  y;
  groupIndex;
  index;
  constructor(x, y, groupIndex, index) {
    this.x = x;
    this.y = y;
    this.groupIndex = groupIndex;
    this.index = index;
  }
}

export default {
  name: 'hover-setting',
  directives: { title },
  data() {
    return {
      params: {
        gapX: 0,
        gapY: 0,
        offsetType: 'x',
        offset: 0,
      },
    };
  },
  methods: {
    // 修改
    async onEdit() {
      const image = await DesignImageUtil.hasActiveImageMessage();
      const group = image.attrs.konvaCanvas.clip.findOne('.tile');
      group?.destroy();
      setTimeout(() => {
        this.onTile();
      });
    },
    /**
     * 平铺
     */
    async onTile() {
      const image = await DesignImageUtil.hasActiveImageMessage();

      // 创建组
      const group = this.createGroup(image);

      // 收集坐标
      const tileList = this.collectCoordinate(image);

      // 创建图片
      tileList.forEach((item, i) => {
        // 交错处理
        let x = item.x;
        let y = item.y;
        if (this.params.offsetType === 'x' && [3, 4].includes(item.groupIndex)) {
          x = x + this.params.offset;
          console.log('offsetx');
        }

        if (this.params.offsetType === 'y' && [2, 4].includes(item.groupIndex)) {
          y = y + this.params.offset;
          console.log('offsety');
        }

        // 间距处理 TODO:处理间距!
        let width = image.attrs.width;
        let height = image.attrs.height;
        if (this.params.gapX) {
          width = width - this.params.gapX;
        }
        if (this.params.gapY) {
          height = height - this.params.gapY;
        }

        const img = this.createImage(image, x, y, width, height, item);
        group.add(img);
      });
    },
    /**
     * 获取图片信息
     */
    getImageInfo(image) {
      const param = image.attrs.param;

      // 舞台的宽高
      const a = Math.max(param.staticView.print.width, param.staticView.print.height);
      const stageWidth = a;
      const stageHeight = a;

      // 图片当前的坐标
      const currentX = image.x();
      const currentY = image.y();

      // 图片的宽高
      const imageWidth = image.width() * image.scaleX();
      const imageHeight = image.height() * image.scaleY();

      return {
        stageWidth,
        stageHeight,
        a,
        currentX,
        currentY,
        imageWidth,
        imageHeight,
      };
    },
    /**
     * 创建组
     * @param {*} image
     */
    createGroup(image) {
      const { a, currentX, currentY, imageWidth, imageHeight } = this.getImageInfo(image);

      let ratioX = Math.ceil(a / imageWidth / 2);
      let ratioY = Math.ceil(a / imageHeight / 2);
      // 要2的倍数
      if (ratioX % 2 !== 0) ratioX++;
      if (ratioY % 2 !== 0) ratioY++;
      // console.log('ratio', ratioX, ratioY);

      const group = new Konva.Group({
        name: 'tile',
        uuid: uuid(),
        x: currentX,
        y: currentY,
        draggable: false,
        rotation: image.attrs.rotation,
        offset: {
          x: -ratioX * imageWidth,
          y: -ratioY * imageHeight,
        },
      });

      image.attrs.konvaCanvas.clip.add(group);
      // 置底
      group.moveToBottom();

      return group;
    },
    /**
     * 创建图片
     * @param {*} image
     * @param {*} x
     * @param {*} y
     * @param width
     * @param height
     * @param width
     * @param height
     * @returns {Konva.Image}
     */
    createImage(image, x, y, width = null, height = null, item) {
      width = width || image.attrs.width;
      height = height || image.attrs.height;

      const newImage = new Konva.Image({
        width: image.attrs.width,
        height: image.attrs.height,
        // x: x,
        // y: y,
        // scaleX: image.attrs.scaleX,
        // scaleY: image.attrs.scaleY,
        // offsetX: image.attrs.width / 2,
        // offsetY: image.attrs.height / 2,
        fillPatternImage: image.attrs.fillPatternImage,
        draggable: false,
      });

      const group = new Konva.Group({
        x: x,
        y: y,
        width: width,
        height: height,
        draggable: false,
        scaleX: image.attrs.scaleX,
        scaleY: image.attrs.scaleY,
        offsetX: image.attrs.width / 2,
        offsetY: image.attrs.height / 2,
      });

      const rect = new Konva.Rect({
        width: width,
        height: height,
        fillPatternImage: image.attrs.fillPatternImage,
        fillPatternRepeat: 'no-repeat',
        // fillPatternOffset: {
        //   x: -x,
        //   y: -y,
        // },
        fillPatternScale: {
          x: 1,
          y: 1,
        },
        draggable: false,
      });

      // group.add(newImage);
      group.add(rect);

      return group;

      // return new Konva.Text({
      //   x: x,
      //   y: y,
      //   text: item.groupIndex,
      //   fontSize: 10,
      //   fontFamily: 'Calibri',
      //   fill: 'green',
      //   draggable: false,
      // });
    },
    /**
     * 收集坐标
     * @param {*} image
     * @returns {Array}
     */
    collectCoordinate(image) {
      const { stageWidth, stageHeight, currentX, currentY, imageWidth, imageHeight } = this.getImageInfo(image);

      const tileList = [];
      const yetX = [];

      // 向右
      let i = 1; //i=1|2
      let x = 0;
      while (x + currentX < stageWidth + imageWidth) {
        yetX.push({ x, i });
        tileList.push(new TileImage(x, 0, i));
        x += imageWidth;
        i = i % 2 === 0 ? 1 : 2;
      }

      // 向左
      let i2 = 2;
      let x2 = -imageWidth;
      while (x2 + currentX > 0 - imageWidth - stageWidth) {
        yetX.push({ x: x2, i: i2 });
        tileList.push(new TileImage(x2, 0, i2));
        x2 -= imageWidth;
        i2 = i2 % 2 === 0 ? 1 : 2;
      }

      // 向下一排
      let y = imageHeight;
      let downI = 1;
      while (y + currentY < stageHeight + imageHeight) {
        yetX.forEach(({ x, i }) => {
          let groupIndex;
          if (downI % 2 === 0) {
            groupIndex = i === 1 ? 1 : 2;
          } else {
            groupIndex = i === 1 ? 3 : 4;
          }
          tileList.push(new TileImage(x, y, groupIndex));
        });
        y += imageHeight;
        downI++;
      }

      // 向上一排
      let y2 = -imageHeight;
      let upI = 2;
      while (y2 + currentY > 0 - stageHeight) {
        yetX.forEach(({ x, i }) => {
          let groupIndex;
          if (upI % 2 === 0) {
            groupIndex = i === 1 ? 3 : 4;
          } else {
            groupIndex = i === 1 ? 1 : 2;
          }
          tileList.push(new TileImage(x, y2, groupIndex));
        });
        y2 -= imageHeight;
        upI++;
      }

      return tileList;
    },
  },
};
</script>

<style scoped lang="less">
@import url('../commonStyle');
/deep/ .el-popover__reference-wrapper {
  width: 100%;
  height: 100%;
}
.name {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.hover-wrap {
  width: 235px;
  display: flex;
  justify-content: space-around;
  .img {
    cursor: pointer;
    width: 50px;
    height: 50px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    &:hover {
      border: 1px solid #409eff;
    }
  }
}
</style>
