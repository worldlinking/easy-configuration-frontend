import Vue from "vue";
import VueRouter from "vue-router";
import User from "../views/User.vue";
import Index from "../views/Index.vue";
import Admin from "../views/Admin.vue";
import Navigation from "../views/User/Navigation.vue";
import IoTPerception from "../views/User/IoTPerception.vue";
import SocialPerception from "../views/User/SocialPerception.vue";
import Model from "../views/User/Model.vue";
import UsePublicModel from '../views/User/UsePublicModel.vue'
import SpiderJobList from "../views/User/SpiderJobList";
import SpiderRequest from "../views/User/SpiderRequest";
import SpiderItemList from "../views/User/SpiderItemList";
import MyModel from "../views/User/MyModel";
import CreateModel from "../views/User/CreateModel";
import TrainModel from "../views/User/TrainModel";
import VerifyModel from "../views/User/VerifyModel";

import MyDataset from '../views/User/MyDataset.vue'

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject);
  }
  return originalReplace.call(this, location).catch((err) => {
    if (VueRouter.isNavigationFailure(err)) {
      return err;
    }
    return Promise.reject(err);
  });
};

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
  },
  {
    path: "/user",
    name: "User",
    component: User,
    children: [
      { path: "navigation", component: Navigation, name: "Navigation" },
      {
        path: "IoTPerception",
        component: IoTPerception,
        name: "IoTPerception",
      },
      {
        path: "SocialPerception",
        component: SocialPerception,
        name: "SocialPerception",
      },
      {
        path: "Model",
        component: Model,
        name: "Model",
        children:[
          {
            path: "UsePublicModel",
            component: UsePublicModel,
            name: "UsePublicModel",
          },
          {
            path:"MyDataset",
            component:MyDataset,
            name:"MyDataset"
          },
          {
            path: "SpiderJobList",
            component: SpiderJobList,
            name: "SpiderJobList",
          },
          {
            path: "SpiderRequest",
            component: SpiderRequest,
            name: "SpiderRequest",
          },
          {
            path: "SpiderItemList/:id",
            component: SpiderItemList,
            name: "SpiderItemList",
          },{
            path: "MyModel",
            component: MyModel,
            name: "MyModel",
          },{
            path: "CreateModel",
            component: CreateModel,
            name: "CreateModel",
          },{
            path: "TrainModel",
            component: TrainModel,
            name: "TrainModel",
          },{
            path: "VerifyModel",
            component: VerifyModel,
            name: "VerifyModel",
          },
        ]
      },
    ],
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach((to, form, next) => {
  if (to.name === "Index") {
    //通过cookie免除登录
    let cookie = localStorage.getItem("cookie");
    //通过cookie获取账户信息
    let info = {
      account: "1",
      pwd: "1",
      type: "user",
    };
    if (info.type == "user") {
      next({
        name: "Navigation",
        params: info,
      });
    } else if ((info.type = "admin")) {
      next({
        name: "Admin",
        params: info,
      });
    }
  } else {
    next();
  }
});

export default router;
