import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI, { size: 'small' });

// 自适应盒子
import boxAdaptive from '@/designApplication/components/boxAdaptive.vue';
Vue.component('boxAdaptive', boxAdaptive);

// canvas konva
import VueKonva from 'vue-konva';
Vue.use(VueKonva);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
