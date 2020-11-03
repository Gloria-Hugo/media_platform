// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";

// import "@/uitls/element";
import "./style/global.less";
import "@/assets/icon-font/iconfont.css";
import "@/uitls/screen";
import md5 from "@/uitls/md5.js";
import has256 from "@/uitls/has256.js";
import utils from "@/uitls/util";
import uploader from "vue-simple-uploader";
Vue.use(uploader);
axios.defaults.baseURL = "/api";
import axios from "@/http/index";
// 配置请求的跟路径
// axios.defaults.baseURL = "http://119.3.229.105:18281/ietlMobile/";
// axios.defaults.baseURL = "http://192.168.0.112:8061/ietl.mobile.web";


Vue.prototype.$http = axios;
Vue.prototype.md5 = md5;
Vue.prototype.has256 = has256;
Vue.prototype.utils = utils; //放入全局
// 引入echarts
import echarts from "echarts";
Vue.prototype.$echarts = echarts;

//引入nprogress
import NProgress from "nprogress"; // 进度条
import "nprogress/nprogress.css"; //这个样式必须引入
NProgress.inc(0.2);
NProgress.configure({ easing: "ease", speed: 500, showSpinner: false });

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
});

router.afterEach(() => {
  NProgress.done();
});
// 全局判断用户是否登录
router.beforeEach((to, from, next) => {
  const type = to.meta.type;
  // 判断该路由是否需要登录权限
  if (type === "login") {
    if (window.sessionStorage.getItem("Token")) {
      next();
    } else {
      next("/");
    }
  } else {
    next(); // 确保一定要有next()被调用
  }
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
