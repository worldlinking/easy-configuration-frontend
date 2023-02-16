import Vue from "vue";
import VueRouter from "vue-router";
import User from "../views/User.vue";
import Index from "../views/Index.vue";
import Admin from "../views/Admin.vue";
import Navigation from "../views/User/Navigation.vue";
import IoTPerception from "../views/User/IoTPerception.vue";
import SocialPerception from "../views/User/SocialPerception.vue";
import Model from "../views/User/Model.vue";
import UsePublicModel from "../views/User/UsePublicModel.vue";
import PublicDataset from "../views/User/PublicDataset.vue";
import SpiderJobList from "../views/User/SpiderJobList";
import SpiderRequest from "../views/User/SpiderRequest";
import SpiderItemList from "../views/User/SpiderItemList";
import MyModel from "../views/User/MyModel";
import CreateModel from "../views/User/CreateModel";
import TrainModel from "../views/User/TrainModel";
import VerifyModel from "../views/User/VerifyModel";
import UseMyModel from "../views/User/UseMyModel";
import DownLoadModel from "../views/User/DownLoadModel";
import CreateStandModel from "../views/Admin/CreateStandModel";
import UploadStandModelWeight from "../views/Admin/UploadStandModelWeight.vue";
import ManageModel from "../views/Admin/ManageModel.vue";
import UploadPublicDataset from "../views/Admin/UploadPublicDataset.vue";
import CreatePublicDataset from "../views/Admin/CreatePublicDataset.vue";
import PublicModel from "../views/User/PublicModel.vue";
import MyDataset from "../views/User/MyDataset.vue";
import UserModelManage from "../views/Admin/UserModelManage.vue";
import UserInfoManage from "../views/Admin/UserInfoManage.vue";
import UserDatasetManage from "../views/Admin/UserDatasetManage.vue";
import OnlineAnnotationObjectDetection from "../views/User/OnlineAnnotationObjectDetection.vue";

// import MyDataset from '../views/User/MyDataset.vue'
import ModelIntro from "../views/User/ModelIntro";
import axios from "axios";
import config from "../assets/configs/config";
let { ip } = config;

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
        children: [
          {
            path: "ModelIntro",
            component: ModelIntro,
            name: "ModelIntro",
          },
          {
            path: "UsePublicModel",
            component: UsePublicModel,
            name: "UsePublicModel",
          },
          {
            path: "MyDataset",
            component: MyDataset,
            name: "MyDataset",
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
          },
          {
            path: "MyModel",
            component: MyModel,
            name: "MyModel",
          },
          {
            path: "CreateModel",
            component: CreateModel,
            name: "CreateModel",
          },
          {
            path: "TrainModel",
            component: TrainModel,
            name: "TrainModel",
          },
          {
            path: "VerifyModel",
            component: VerifyModel,
            name: "VerifyModel",
          },
          {
            path: "UseMyModel",
            component: UseMyModel,
            name: "UseMyModel",
          },
          {
            path: "DownLoadModel",
            component: DownLoadModel,
            name: "DownLoadModel",
          },
          {
            path: "PublicModel",
            component: PublicModel,
            name: "PublicModel",
          },
          {
            path: "PublicDataset",
            component: PublicDataset,
            name: "PublicDataset",
          },
          {
            path: "OnlineAnnotationObjectDetection",
            component: OnlineAnnotationObjectDetection,
            name: "OnlineAnnotationObjectDetection"
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    name: "Admin",
    component: Admin,
    children: [
      {
        path: "CreateStandModel",
        component: CreateStandModel,
        name: "CreateStandModel",
      },
      {
        path: "UploadStandModelWeight",
        component: UploadStandModelWeight,
        name: "UploadStandModelWeight",
      },
      {
        path: "ManageModel",
        component: ManageModel,
        name: "ManageModel",
      },
      {
        path: "UploadPublicDataset",
        component: UploadPublicDataset,
        name: "UploadPublicDataset",
      },
      {
        path: "CreatePublicDataset",
        component: CreatePublicDataset,
        name: "CreatePublicDataset",
      },
      {
        path: "UserModelManage",
        component: UserModelManage,
        name: "UserModelManage",
      },
      {
        path: "UserInfoManage",
        component: UserInfoManage,
        name: "UserInfoManage",
      },
      {
        path: "UserDatasetManage",
        component: UserDatasetManage,
        name: "UserDatasetManage",
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach(async (to, form, next) => {
  if (to.name === "Index") {
    //通过cookie免除登录
    let token = localStorage.getItem("token");
    if (!token) {
      next();
      return;
    }
    //通过token获取账户信息
    let res = await axios.post(`${ip}/verifyToken`, {
      token,
    });
    let info = res.data.data;
    if (info.type == "user") {
      next({
        name: "Navigation",
        params: info,
      });
    } else if (info.type == "admin") {
      next({
        name: "CreateStandModel",
        params: info,
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
