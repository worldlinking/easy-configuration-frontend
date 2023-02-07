<template>
  <!-- 主页标题 -->
  <div class="header">
    <!-- 标题 -->
    <div class="homeTitle">物联互联智能感知引擎管理员页面</div>
    <!-- 登录按钮 -->
    <div class="logBtnC" v-if="!hasLogIn">
      <el-button
        type="primary"
        size="small"
        style="background-color: rgb(26, 115, 232)"
        >登录/注册</el-button
      >
    </div>
    <!-- 头像 -->
    <div class="AvatarC" v-if="hasLogIn">
      <el-dropdown placement="bottom" @command="menuClick">
        <el-avatar
          src="https://ts1.cn.mm.bing.net/th/id/R-C.e48f1d71ef7dd60189d724c04d924a9d?rik=8UP7xylNW91hHw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f00%2f99%2f23%2f0756f36f5bb25d9.jpg&ehk=S49zFUKyssoH5jD%2f4uAOYeh0xIKDEx2dX4Tfjt53bC8%3d&risl=&pid=ImgRaw&r=0"
          class="el-dropdown-link touX"
        ></el-avatar>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item>我上传的数据集</el-dropdown-item>
          <el-dropdown-item>我上传的标准模型</el-dropdown-item>
          <el-dropdown-item :divided="true" icon="el-icon-switch-button" command='zx'
            >注销</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 创建模型按钮 -->
    <!-- <div class="createModelBtnC" v-if="hasLogIn">
      <el-button
        type="primary"
        size="small"
        class="createModelBtn"
        style="background-color: rgb(26, 115, 232); width: 5vw; height: 4vh"
        >上传标准模型</el-button
      >
    </div> -->

    <!-- 功能区 -->
    <!-- <div class="funcC">
      <div
        size="default"
        type="primary"
        v-for="(func, index) in funcs"
        :key="index"
      >
        <span class="el-dropdown-link funcStyle" @click="doFunc(index)">
          {{ func }}
        </span>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "EasyConfigurationHeader",

  data() {
    return {
      hasLogIn: false,
      funcs: ["首页", "产品介绍", "使用文档", "应用案例", "社区"],
    };
  },

  mounted() {
    this.verifyCookies();
  },
  methods: {
    verifyCookies() {
      //验证cookie
      //查看是否通过首页免密登录
      if (this.$route.params && "type" in this.$route.params) {
        this.hasLogIn = true;
        return;
      }
      //通过cookie免除登录
      let cookie = localStorage.getItem("cookie");
      //通过cookie获取账户信息
      let info = {
        account: "1",
        pwd: "1",
        type: "user",
      };
      if (info.type == "user") {
        this.hasLogIn = true;
      }
    },
    doFunc(index) {
      switch (index) {
        case 0:
          this.home();
          break;
      }
    },
    home() {
      this.$router.replace({
        name: "Navigation",
      });
    },
    menuClick(command) {
      switch (command) {
        case "zx":
          localStorage.removeItem("token");
          this.$message({
            type: "success",
            message: "注销成功！",
          });
          this.$router.replace("/");
          break;
      }
    },
  },
};
</script>

<style scoped>
.header {
  height: 8vh;
  background-color: rgb(2, 8, 88);
  display: flex;
  justify-content: center;
  position: relative;
}
.homeTitle {
  height: 8vh;
  text-align: center;
  line-height: 8vh;
  color: white;
  font-weight: bolder;
  font-size: 2rem;
  transition: all 0.5s;
}
.homeTitle:hover {
  cursor: pointer;
  color: cornflowerblue;
}
.logBtnC {
  position: absolute;
  height: 8vh;
  right: 1vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.AvatarC {
  position: absolute;
  height: 8vh;
  right: 2vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.touX {
  transition: all 0.5s;
  width: 3.5vw;
  height: 3.5vw;
}
.touX:hover {
  cursor: pointer;
  transform: scale(1.1);
}

.createModelBtnC {
  position: absolute;
  height: 8vh;
  right: 1vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.funcC {
  position: absolute;
  height: 8vh;
  left: 0vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 25vw;
}

.funcStyle {
  color: whitesmoke;
  font-weight: 500;
}
.funcStyle:hover {
  cursor: pointer;
  color: royalblue;
}
</style>
