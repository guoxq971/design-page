import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import HomeView2 from '../views/HomeView2.vue';
import HomeView4 from '../views/HomeView4.vue';
import HomeView5 from '../views/HomeView5.vue';
import HomeView6 from '../views/HomeView6.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    // component: HomeView6, // 快捷键录制
    // component: HomeView5, // konva rect 平铺
    // component: HomeView4, // 3d材质测试
    // component: HomeView2, // exceljs测试
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   component: () => import('../views/AboutView.vue'),
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
