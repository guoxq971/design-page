import * as THREE from 'three';
import { draw, hasActiveObject } from '@/views/design/three/utils/modelViewUtil';

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

  three; //three
  fabric; //fabric

  /**
   * 构造函数
   * @param {MyThree} three three
   * @param {fabric} fabric fabric
   * */
  constructor(three, fabric) {
    // 初始化射线
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // three
    this.three = three;
    this.fabric = fabric;

    // three的容器, 场景, 相机, 控制器
    this.container = three.container;
    this.scene = three.scene;
    this.camera = three.camera;
    this.controls = three.controls;

    // 监听事件
    this.container.addEventListener('mousemove', (evt) => this.onMouseMove(evt));
    this.container.addEventListener('mousedown', (evt) => this.onMousedown(evt));
    this.container.addEventListener('mouseup', (evt) => this.onMouseUp(evt));
  }

  /**
   * 鼠标按下
   * @param {MouseEvent} evt 鼠标事件
   * */
  onMousedown(evt) {
    evt.preventDefault();

    // 是否有选中模型
    const { uv, object } = this.raycasterFn(evt, false);

    // 没有选中模型, 不触发射线交互
    if (!uv) return console.log('down 不存在uv');
    // 没有选中模型, 不触发射线交互
    if (!object?.material?.name) return console.log('down 不存在material.name');

    // 根据材质名称获取模型视图对象
    const modelView = this.three.getModelViewItem(object.material.name);

    // 选中的不是当前激活的面, 不触发射线交互
    if (!modelView) return console.log('down mesh不一致');
    if (!modelView.prodView) return console.log('down view不存在');

    this.setStatus('down'); // 设置状态
    this.raycasterFn(evt); // 射线交互

    // 当前是否有已经激活的对象
    if (!hasActiveObject(modelView)) {
      setTimeout(() => {
        this.setStatus('up'); // 设置状态
        draw(modelView);
      });
    }
  }

  /**
   * 鼠标移动
   * @param {MouseEvent} evt 鼠标事件
   * */
  onMouseMove(evt) {
    evt.preventDefault();
    if (!this.three.isDown) return; // 鼠标没有按下, 不触发射线交互
    this.raycasterFn(evt); // 射线交互
  }

  /**
   * 鼠标弹起
   * @param {MouseEvent} evt 鼠标事件
   * */
  onMouseUp(evt) {
    evt?.preventDefault();
    if (!this.three.isDown) return; // 鼠标没有按下, 不触发射线交互
    this.setStatus('up'); // 设置状态
  }

  /**
   * 设置状态
   * @param {string} type down | up
   */
  setStatus(type = 'down') {
    switch (type) {
      // 鼠标按下
      case 'down':
        this.three.isDown = true; // 容器内鼠标按下
        this.controls.enabled = false; // 禁用控制器
        this.fabric.customMouse = true; // 禁用fabric鼠标事件
        break;
      // 鼠标弹起
      case 'up':
        this.three.isDown = false; // 容器内鼠标弹起
        this.controls.enabled = true; // 启用控制器
        this.fabric.customMouse = false; // 启用fabric鼠标事件
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
    const objects = this.activeMesh || this.three.getMaterialList();

    // 获取交叉点, 有值并且存在uv就是射线与模型相交
    const intersect = this.getIntersects(evt, objects)[0];

    // 射中的mesh如果有贴图就触发交互
    if (intersect?.uv) {
      this.setInteraction(intersect, evt, flag);
    }

    return { uv: intersect?.uv, object: intersect?.object };
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
    flag && this.three.setPos(materialName, uv, event);
  }

  /**
   * 设置鼠标位置
   * @param {HTMLElement} container 容器
   * @param {MouseEvent} event 鼠标事件
   * */
  setMousePosition(container, event) {
    const dom = container.querySelector('canvas');
    const getBoundingClientRect = dom.getBoundingClientRect();
    this.mouse.x = ((event.clientX - getBoundingClientRect.left) / dom.offsetWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - getBoundingClientRect.top) / dom.offsetHeight) * 2 + 1;
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
