import * as THREE from 'three';
import store from '@/store';
import { DesignerUtil } from '@/designApplication/core/utils/designerUtil';

/**
 * 射线
 * @class
 * */
export class Raycaster {
  raycaster; //射线
  mouse; //鼠标
  activeMesh; //当前射线选中的mesh

  container; //容器
  scene; //场景
  camera; //相机
  controls; //控制器

  // 是否在同一个地方按下和抬起
  isSameClick = false;
  isDown = false; //是否按下
  addEventObj = {}; //事件对象

  three; //three

  /**
   * 构造函数
   * @param {MyThree} three three
   * */
  constructor(three, param) {
    // 鼠标按下前的坐标
    let downMousePos = {
      x: 0,
      y: 0,
    };

    param = {
      beforeMouseDown: (uv, object, evt) => {
        // 记录鼠标按下的坐标
        downMousePos.x = evt.clientX;
        downMousePos.y = evt.clientY;

        // 没有选中模型, 不触发射线交互
        if (!uv) return console.log('down 不存在uv');
        // 没有选中模型, 不触发射线交互
        if (!object?.material?.name) return console.log('down 不存在material.name');

        return true;
      },
      afterMouseDown: (uv, object) => {
        // TODO： 判断是否有选中了设计图，没有的话就退出konva自定义鼠标事件
        const meshItem = three.getMeshItemByMaterialName(object.material.name);

        // 没有视图 || 没有canvas || 没有选中的设计图
        if (!meshItem.view || !meshItem.canvas || !meshItem?.view?.canvas.hasSelected()) {
          this.setStatus('up'); // 设置状态为抬起
        }
      },
      beforeMouseMove: () => this.isDown,
      afterMouseMove: () => {},
      beforeMouseUp: () => true,
      afterMouseUp: (object, evt) => {
        // 如果点击的是空白地方，并且是同一个地方按下和抬起, 就退出3d模式
        this.isSameClick = downMousePos.x === evt.clientX && downMousePos.y === evt.clientY;
        if (this.isSameClick && !object) {
          // 所有设计图存在一个选中的，就先退出所有设计图的选中状态
          if (three.isAnyDesignSelected()) {
            three.exitAllDesignSelected();
          } else {
            DesignerUtil.showThree();
          }
        }
      },
      setPos: (materialName, uv, event) => three.setPos(materialName, uv, event),
      getMaterialList: () => three.getMaterialList() || [],
      setStatusDown: () => three.openCustomMouse(),
      setStatusUp: () => three.closeCustomMouse(),
    };

    // 鼠标移动前 是否执行 true-执行 false-不执行
    this.beforeMouseMove = param.beforeMouseMove || (() => true);
    // 鼠标抬起前 是否执行 true-执行 false-不执行
    this.beforeMouseUp = param.beforeMouseUp || (() => true);
    // 鼠标按下前 是否执行 true-执行 false-不执行
    this.beforeMouseDown = param.beforeMouseDown || (() => true);
    // 鼠标按下后
    this.afterMouseDown = param.afterMouseDown || (() => true);
    // 鼠标移动后
    this.afterMouseMove = param.afterMouseMove || (() => true);
    // 鼠标抬起后
    this.afterMouseUp = param.afterMouseUp || (() => true);
    // 设置鼠标位置
    this.setPos = param.setPos || (() => true);
    // 获取材质列表
    this.getMaterialList = param.getMaterialList || (() => []);
    // 设置状态
    this.setStatusDown = param.setStatusDown || (() => true);
    this.setStatusUp = param.setStatusUp || (() => true);

    // 初始化射线
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // three
    this.three = three;

    // three的容器, 场景, 相机, 控制器
    this.container = three.container;
    this.camera = three.camera;
    this.controls = three.controls;

    // 监听事件
    this.addEventObj.onMousedown = this.onMousedown.bind(this);
    this.addEventObj.onMouseMove = this.onMouseMove.bind(this);
    this.addEventObj.onMouseUp = this.onMouseUp.bind(this);
    this.container.addEventListener('mousedown', this.addEventObj.onMousedown);
    this.container.addEventListener('mousemove', this.addEventObj.onMouseMove);
    this.container.addEventListener('mouseup', this.addEventObj.onMouseUp);
  }

  destroy() {
    this.container.removeEventListener('mousedown', this.addEventObj.onMousedown);
    this.container.removeEventListener('mousemove', this.addEventObj.onMouseMove);
    this.container.removeEventListener('mouseup', this.addEventObj.onMouseUp);

    this.raycaster = null;
    this.mouse = null;
    this.activeMesh = null;
  }

  /**
   * 鼠标按下
   * @param {MouseEvent} evt 鼠标事件
   * */
  onMousedown(evt) {
    evt.preventDefault();

    // 数遍按下选中的mesh
    const { uv, object, intersect } = this.raycasterFn(evt, false);

    // 鼠标按下前
    if (!this.beforeMouseDown(uv, object, evt)) return;

    // 设置状态
    this.setStatus('down');

    // 射线交互
    this.raycasterFn(evt);

    // 鼠标按下后
    this.afterMouseDown(uv, object);
  }

  /**
   * 鼠标移动
   * @param {MouseEvent} evt 鼠标事件
   * */
  onMouseMove(evt) {
    evt.preventDefault();
    // 鼠标没有按下, 不触发射线交互
    if (!this.beforeMouseMove()) return;

    // 射线交互
    this.raycasterFn(evt);

    // 鼠标移动后
    this.afterMouseMove();
  }

  /**
   * 鼠标弹起
   * @param {MouseEvent} evt 鼠标事件
   * */
  onMouseUp(evt) {
    evt?.preventDefault();

    // 设置状态
    this.setStatus('up');

    // 鼠标抬起前
    if (!this.beforeMouseUp()) return;

    // 射线交互
    const { object } = this.raycasterFn(evt);

    // 鼠标抬起后
    this.afterMouseUp(object, evt);
  }

  /**
   * 设置状态
   * @param {string} type down | up
   */
  setStatus(type = 'down') {
    switch (type) {
      // 鼠标按下
      case 'down':
        this.setStatusDown();
        this.isDown = true; // 容器内鼠标按下
        this.controls.enabled = false; // 禁用控制器
        break;
      // 鼠标弹起
      case 'up':
        this.setStatusUp();
        this.isDown = false; // 容器内鼠标弹起
        this.controls.enabled = true; // 启用控制器
        this.activeMesh = null; // 清空射线缓存的mesh
        break;
      default:
        throw new Error('setStatus type error');
    }
  }

  /**
   * 射线交互
   * @param {MouseEvent} evt 鼠标事件
   * @param {boolean} flag 是否设置鼠标位置
   * */
  raycasterFn(evt, flag = true) {
    // 交互的模型
    const objects = this.activeMesh || this.getMaterialList();

    // 获取交叉点, 有值并且存在uv就是射线与模型相交
    const intersect = this.getIntersects(evt, objects)[0];

    // 射中的mesh如果有贴图就触发交互
    if (intersect?.uv) {
      this.setInteraction(intersect, evt, flag);
    }

    return { intersect, uv: intersect?.uv, object: intersect?.object };
  }

  /**
   * 交互
   * @param {Object} intersect {uv,object,point}
   * @param {MouseEvent} event 鼠标事件
   * @param {boolean} flag 是否设置鼠标位置
   * */
  setInteraction(intersect, event, flag = true) {
    if (!intersect.object.material.map) return;

    const uv = intersect.uv; // uv坐标
    const materialName = intersect.object.material.name; // 材质名称

    // 缓存当前选中的mesh
    if (!this.activeMesh) this.activeMesh = [intersect.object];

    // uv坐标转换(uv矫正, 有些贴图uv坐标不是从0-1, 会导致绘制位置不正确)
    intersect.object.material.map.transformUv(intersect.uv);

    // 设置鼠标位置,并渲染
    flag && this.setPos(materialName, uv, event);
  }

  /**
   * 设置鼠标位置
   * @param {HTMLElement} container 容器
   * @param {MouseEvent} event 鼠标事件
   * */
  setMousePosition(container, event) {
    const dom = container.querySelector('canvas');
    const getBoundingClientRect = dom.getBoundingClientRect();
    // console.log(getBoundingClientRect);
    const x = (event.clientX - getBoundingClientRect.left) / dom.offsetWidth;
    const y = (event.clientY - getBoundingClientRect.top) / dom.offsetHeight;
    this.mouse.x = x * 2 - 1;
    this.mouse.y = -y * 2 + 1;
    // console.log(this.mouse);
  }

  /**
   * 获取交叉点
   * @param {MouseEvent} event 鼠标事件
   * @param {Array} objects 交互的模型
   * @returns {Array} 交叉点
   * */
  getIntersects(event, objects) {
    this.setMousePosition(this.container, event); // 设置鼠标位置
    this.raycaster.setFromCamera(this.mouse, this.camera); // 设置射线
    return this.raycaster.intersectObjects(objects, false); // 获取交叉点 false=不穿透子对象
  }
}
