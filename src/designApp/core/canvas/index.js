import { fabric } from '@/designApp/plugin/fabric';
export class FabricCanvas {
  canvas = null;
  rectBd = null; // 中间的矩形边框
  offset = {
    ratio: 1,
    left: 0,
    top: 0,
    width: 650, // 画布的宽度(中间灰色)
    height: 650, // 画布的高度(中间灰色)
  };

  constructor(id, view) {
    // 初始化画布
    this.canvas = new fabric.Canvas(id, {
      // backgroundColor: 'pink',
    });

    // 初始化画布的偏移量
    this.computedOffset();
    // 初始化中间的矩形边框
    this.initRectBd();
    // 初始化监听事件
    this.addEventListener();
    // 初始化视图
    // this.initView(view);

    // 创建测试矩形
    this.createRect();
  }

  /**
   * 初始化视图
   * @param {StaticViewItem} view 视图数据
   * */
  initView(view) {
    const ratioW = this.offset.width / 500;
    const ratioH = this.offset.height / 500;
    const config = {
      left: this.offset.left,
      top: this.offset.top,
      width: 500,
      height: 500,
      scaleX: ratioW,
      scaleY: ratioH,
      selectable: false, // 不可选中
      hasControls: false, // 不可移动
      hasBorders: false, // 不可缩放
      hoverCursor: 'default', // 鼠标经过时不显示光标
    };

    // 背景图
    new fabric.Image.fromURL(view.bg, (img) => {
      img.set(config);
      this.canvas.add(img);
      img.sendToBack(); // 发送到底层
    });

    // 产品图
    new fabric.Image.fromURL(view.prod, (img) => {
      img.set(config);
      this.canvas.add(img);
      img.sendToBack(); // 发送到底层
    });
  }

  /**
   * 监听事件
   * */
  addEventListener() {
    // 监听缩放
    window.addEventListener('resize', () => this.computedOffset());
    // 监听滚动
    document.querySelector('.blank-wrap').addEventListener('scroll', () => this.computedOffset());

    let isDown = false;
    this.canvas.on('mouse:down', (e) => (isDown = true));
    this.canvas.on('mouse:up', (e) => (isDown = false));
    this.canvas.on('mouse:move', (e) => isDown && this.generateThumbnail());
  }

  // 生成缩略图
  generateThumbnail() {
    // 原图
    // const thumbnailCanvas = document.createElement('canvas');
    // const thumbnailContext = thumbnailCanvas.getContext('2d');
    // thumbnailCanvas.width = this.canvas.getWidth() / 5; // 缩小到原来的五分之一
    // thumbnailCanvas.height = this.canvas.getHeight() / 5; // 缩小到原来的五分之一
    // thumbnailContext.drawImage(this.canvas.getElement(), 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

    // 缩略图取画布中的 x=this.offsetLeft, y=this.offsetTop, width=650, height=650
    const thumbnailCanvas = document.createElement('canvas');
    const thumbnailContext = thumbnailCanvas.getContext('2d');
    thumbnailCanvas.width = this.offset.width; // 缩小到原来的五分之一
    thumbnailCanvas.height = this.offset.height; // 缩小到原来的五分之一
    thumbnailContext.drawImage(this.canvas.getElement(), this.offset.left, this.offset.top, this.offset.width, this.offset.height, 0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

    // 将缩略图显示在页面上
    // const thumbnailDiv = this.$refs.previewListRef.$refs.testContainer;
    // thumbnailDiv.innerHTML = '';
    // const thumbnailImg = document.createElement('img');
    // thumbnailImg.style.width = '100%';
    // thumbnailImg.style.height = '100%';
    // thumbnailImg.src = thumbnailCanvas.toDataURL();
    // thumbnailDiv.appendChild(thumbnailImg);
  }

  /**
   * 创建测试矩形
   * */
  createRect() {
    // 创建一个矩形对象
    const rect = new fabric.Rect({
      left: this.offset.left + 150,
      top: this.offset.top + 150,
      width: 20 * 5,
      height: 10 * 5,
      fill: 'red',
    });

    const rect2 = new fabric.Rect({
      left: this.offset.left + 150,
      top: this.offset.top + 150,
      width: 20 * 5,
      height: 10 * 5,
      fill: 'green',
    });

    rect.bringToFront();
    rect2.bringToFront();

    this.canvas.add(rect);
    this.canvas.add(rect2);
  }

  /**
   * 初始化中间的矩形边框
   * */
  initRectBd() {
    this.rectBd = new fabric.Rect({
      left: this.offset.left,
      top: this.offset.top,
      width: this.offset.width,
      height: this.offset.height,
      fill: 'transparent',
      stroke: '#ccc',
      strokeWidth: 1,
      selectable: false, // 不可选中
      hasControls: false, // 不可移动
      hasBorders: false, // 不可缩放
      hoverCursor: 'default', // 鼠标经过时不显示光标
      strokeDashArray: [5, 5], // 虚线
    });
    this.canvas.add(this.rectBd);
  }

  /**
   * 计算画布的偏移量
   * */
  computedOffset() {
    // 缩放比例
    const ratio = window.devicePixelRatio;
    const beforeOffset = {
      left: this.offset.left,
      top: this.offset.top,
    };

    // 画布容器
    const canvasContainer = document.querySelector('#my-canvas-container');

    // 中间灰色的区域容器
    const containerRect = document.querySelector('#my-canvas-container-bd').getBoundingClientRect();

    // 左边的区域容器
    const leftRect = document.querySelector('.design-left').getBoundingClientRect();

    // 中间的区域容器
    const centerRect = document.querySelector('.design-center').getBoundingClientRect();

    this.offset.left = containerRect.left - leftRect.right;
    this.offset.top = containerRect.top - centerRect.top;
    this.offset.width = containerRect.width;
    this.offset.height = containerRect.height;
    this.offset.ratio = ratio;

    if (this.canvas) {
      // 重置画布的宽高
      canvasContainer.width = centerRect.width;
      canvasContainer.height = centerRect.height;
      this.canvas.setDimensions({
        width: centerRect.width,
        height: centerRect.height,
      });

      // 所有元素的位置\大小都是基于画布的宽高的，所以需要重新计算
      this.canvas.forEachObject((obj) => {
        obj.set({
          left: obj.left - beforeOffset.left + this.offset.left,
          top: obj.top - beforeOffset.top + this.offset.top,
        });
      });

      this.canvas.renderAll();
    }
  }
}
