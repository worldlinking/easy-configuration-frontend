import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { VueJsonp } from 'vue-jsonp'
Vue.use(VueJsonp)


import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

Vue.config.productionTip = false;

var cesium = require('cesium/Cesium');
var widgets= require('cesium/Widgets/widgets.css');

new Vue({
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this;
  },
  render: (h) => h(App),
}).$mount("#app");
