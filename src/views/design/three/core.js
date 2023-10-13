import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Raycaster } from './raycaster.js';
import { fabric } from './plugin/fabric';

export class Core {
  width = window.innerWidth;
  height = window.innerHeight;

  container; // 容器
  scene; // 场景
  camera; // 相机
  renderer; // 渲染器
  controls; // 控制器
  raycaster; // 光线投射

  constructor() {
    this.container = document.getElementById('container');

    this._initScene(); // 场景
    this._initCamera(); // 相机
    this._initRenderer(); // 渲染器
    this._initLight(); // 灯光
    this._initControls(); // 控制器
    this._initRaycaster(); // 光线投射
    this._addEvent(); // 事件监听

    // 辅助线
    const axesHelper = new THREE.AxesHelper(50);
    this.scene.add(axesHelper);

    const animate = () => {
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    };
    animate();
  }

  // 场景
  _initScene() {
    this.scene = new THREE.Scene();
    // this.scene.background = new THREE.Color(0xeeeeee);
  }

  // 相机
  _initCamera() {
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 1000);
    const obj = {
      x: -0.12896254784542957,
      y: 0.9124674402223297,
      z: -2.972599208556769,
    };
    this.camera.position.x = obj.x;
    this.camera.position.y = obj.y;
    this.camera.position.z = obj.z;
    this.camera.lookAt(this.scene.position);
  }

  // 渲染器
  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true, // 抗锯齿
      // powerPreference: "high-performance", // 提高性能
      // precision: "highp", // 高精度渲染
    });
    this.renderer.outputEncoding = THREE.sRGBEncoding; // 设置输出编码
    this.renderer.setPixelRatio(window.devicePixelRatio); // 设置设备像素比
    this.renderer.setSize(this.width, this.height); // 设置渲染器的大小为窗口的内宽度，也就是内容区的宽度
    this.renderer.setClearColor(0xffffff, 0); // 背景颜色
    this.container.appendChild(this.renderer.domElement); // 将渲染器的dom元素添加到dom容器中
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
    this.raycaster = new Raycaster(this, fabric);
  }

  // 事件监听
  _addEvent() {
    window.addEventListener('resize', this._onWindowResize);
  }

  // 窗口大小改变
  _onWindowResize() {
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }
}
