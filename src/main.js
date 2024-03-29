/*!

=========================================================
* Vue White Dashboard - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vue-white-dashboard
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/vue-white-dashboard/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from "vue";
import VueRouter from "vue-router";
import SocialSharing from "vue-social-sharing";
import VueGitHubButtons from "vue-github-buttons";
import "vue-github-buttons/dist/vue-github-buttons.css";

import '@/assets/scss/white-dashboard.scss';
import '@/assets/css/nucleo-icons.css';
import "@/assets/demo/demo.css";

import App from "./App.vue";
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import RTLPlugin from "./RTLPlugin";
import Notify from "@/components/NotificationPlugin";
import i18n from "./i18n"
import SideBar from "@/components/SidebarPlugin";
import VueAMap from 'vue-amap';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';


Vue.config.productionTip = false;

// router setup
import routes from "./router";

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: "active"
});

Vue.use(VueRouter);
Vue.use(SocialSharing);
Vue.use(VueGitHubButtons, { useCache: true });
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(RTLPlugin);
Vue.use(SideBar);
Vue.use(Notify);
Vue.use(VueAMap);
Vue.use(ElementUI);
VueAMap.initAMapApiLoader({
  key: '24eab6be67592f28a28b0df41307192f',
  plugin: [
	  'AMap.ControlBar', 'AMap.Scale','AMap.MapType','AMap.Object3D','AMap.DistrictSearch'
  ],
  uiVersion: '1.1',
  v: '1.4.15'
});

import axios from 'axios';
Vue.prototype.axios = axios;

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount("#app");
