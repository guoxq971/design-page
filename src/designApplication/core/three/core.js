import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Raycaster } from './raycaster.js';
import store from '@/store';
import { OperationUtil } from '@/designApplication/core/utils/operationUtil';

export class Core {
  container; // 容器
  scene; // 场景
  camera; // 相机
  renderer; // 渲染器
  controls; // 控制器
  raycaster; // 光线投射
  rafId = null; // requestAnimationFrame id

  get width() {
    return this.container.offsetWidth || store.state.designApplication.config.canvasSize.width;
  }

  get height() {
    return this.container.offsetHeight || store.state.designApplication.config.canvasSize.height;
  }

  constructor(id) {
    this.container = document.getElementById(id);

    this._initScene(); // 场景
    this._initCamera(); // 相机
    this._initRenderer(); // 渲染器
    this._initLight(); // 灯光
    this._initControls(); // 控制器
    this._initRaycaster(); // 光线投射
    this._addEvent(); // 事件监听

    // 辅助线
    // const axesHelper = new THREE.AxesHelper(50);
    // this.scene.add(axesHelper);

    const animate = () => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.rafId = requestAnimationFrame(animate);
    };
    animate();

    // 监听窗口变化
    window.addEventListener('resize', this.resize.bind(this));

    // 监听双击事件
    this.renderer.domElement.addEventListener('dblclick', this.addEvent_dblclick.bind(this));
  }

  /**
   * 双击事件
   * */
  addEvent_dblclick() {
    OperationUtil.doubleClickThree();
  }

  /**
   * 销毁
   * */
  destroy() {
    // 销毁raf
    cancelAnimationFrame(this.rafId);

    // 销毁监听窗口
    window.removeEventListener('resize', this.resize.bind(this));

    // 销毁双击事件
    this.renderer.domElement.removeEventListener('dblclick', this.addEvent_dblclick.bind(this));

    // 销毁双击事件
    this.renderer.domElement.removeEventListener('dblclick', this.addEvent_dblclick.bind(this));

    // 销毁射线
    this.raycaster.destroy();
  }

  /**
   * 监听窗口变化
   * */
  resize() {
    const id = store.state.designApplication.config.workerContainerId;
    const targetDom = document.getElementById(id);
    const width = targetDom.offsetWidth;
    const height = targetDom.offsetHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.render(this.scene, this.camera);
  }

  // 场景
  _initScene() {
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0xeeeeee);
  }

  // 相机
  _initCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    this.camera.position.x = -3;
    this.camera.position.y = 4;
    this.camera.position.z = 5;
    this.camera.lookAt(this.scene.position);
  }

  // 渲染器
  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
      // powerPreference: "high-performance", // 提高性能
      // precision: "highp", // 高精度渲染
    });
    // 设置渲染器的背景颜色
    this.renderer.setClearColor(0xffffff, 0);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.container.appendChild(this.renderer.domElement);
  }

  // 灯光
  _initLight() {
    // 环境光
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);
    // 半球光
    const light = new THREE.HemisphereLight(0xffffff, 0x0444444, 0.8);
    light.position.set(0, 20, 0);
    this.scene.add(light);
  }

  // 控制器
  _initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  }

  // 光线投射
  _initRaycaster() {
    this.raycaster = new Raycaster(this);
  }

  // 事件监听
  _addEvent() {
    // window.addEventListener('resize', () => this._onWindowResize);
  }

  // 窗口大小改变
  _onWindowResize() {
    // this.camera.aspect = this.width / this.height;
    // this.camera.updateProjectionMatrix();
    // this.renderer.setSize(this.width, this.height);
  }
}
