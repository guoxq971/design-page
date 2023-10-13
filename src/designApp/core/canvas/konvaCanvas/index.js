import Konva from 'konva';
import { initProdArea } from '@/designApp/core/canvas/prodArea';
import { getDesignImage } from '@/designApp/core/canvas/designImage';

export class KonvaCanvas {
  param;
  stage; // 舞台
  layer; // 图层
  pathLayer; // 路径图层
  clip; // 裁剪区域

  constructor(_param = '') {
    if (_param === '') return;
    this.param = {
      id: 'container',
      width: 500,
      height: 500,
      view: '',
    };
    if (typeof _param === 'string') {
      this.param.id = _param;
    } else {
      Object.assign(this.param, _param);
    }

    this._init();
  }

  _init() {
    this.stage = new Konva.Stage({
      container: this.param.id,
      width: this.param.width,
      height: this.param.height,
    });

    this.layer = new Konva.Layer();
    this.pathLayer = new Konva.Layer();
    this.stage.add(this.pathLayer);
    this.stage.add(this.layer);

    // 监听点击的位置是否有元素
    this.stage.on('click tap', (e) => {
      if (e.target === this.stage || e.target.attrs.type === 'path') {
        this.layer.children.forEach((item) => {
          item.className === 'Transformer' && item.visible(false);
        });
      }
    });

    // 绘制区域 (裁剪区域, 超出隐藏)
    const { clip, konvaPath } = initProdArea(this.param.view);
    this.clip = clip;
    this.layer.add(konvaPath);
    this.layer.add(this.clip);
  }

  /**
   * 创建图片
   * @param {string} image 图片地址
   * @returns {Promise<{image: Konva.Image, width: number, height: number}>
   * */
  async createImage(image) {
    const designImage = await getDesignImage(image, this.layer);

    designImage.image.setAttrs({
      x: 0,
      y: 0,
      type: 'image',
    });
    return designImage;
  }

  /**
   * 添加设计图
   * @param {{image: Konva.Rect, transformer:Transformer}} design 设计图
   * */
  add(design) {
    this.clip.add(design.image); //添加设计图
  }
}
