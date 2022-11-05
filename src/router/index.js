import Vue from "vue";
import VueRouter from "vue-router";
import User from "../views/User.vue";
import Index from "../views/Index.vue";
import Admin from "../views/Admin.vue";
import Navigation from "../views/User/Navigation.vue";

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
    children: [{ path: "navigation", component: Navigation,name:"Navigation"}],
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
