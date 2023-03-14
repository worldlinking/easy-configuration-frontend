<template>
  <!-- 主页标题 -->
  <div class="header">
    <!-- 标题 -->
    <!-- <div class="homeTitle">Easy Configuration</div> -->
    <!-- <div class="homeTitle">物联互联智能感知引擎</div> -->
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
          src="https://img.zcool.cn/community/01a6095f110b9fa8012066219b67d4.png@1280w_1l_2o_100sh.png"
          class="el-dropdown-link touX"
        ></el-avatar>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="center" @click.native="goCenter"
            >个人中心</el-dropdown-item
          >
          <el-dropdown-item command="myDataset" @click.native="myDataset"
            >我的数据集</el-dropdown-item
          >
          <el-dropdown-item command="myModel" @click.native="myModel"
            >我的模型</el-dropdown-item
          >
          <el-dropdown-item
            :divided="true"
            icon="el-icon-switch-button"
            command="zx"
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
        >创建模型</el-button
      >
    </div> -->

    <!-- 功能区 -->
    <div class="funcC">
      <div
        size="default"
        type="primary"
        v-for="(func, index) in fun"
        :key="index"
      >
        <span
          class="el-dropdown-link funcStyle"
          @click="doFunc(index)"
          v-if="func.children.length == 0"
        >
          {{ func.label }}
        </span>
        <el-dropdown placement="bottom" v-else @command="dropdownClick">
          <span class="el-dropdown-link funcStyle" @click="doFunc(index)">
            {{ func.label }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(child, index) in func.children"
              :key="index"
              :command="index"
              >{{ child }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../assets/configs/config";
let { ip } = config;
import { mapMutations } from "vuex";
export default {
  name: "EasyConfigurationHeader",

  data() {
    return {
      hasLogIn: false,
      fun: [
        {
          label: "首页",
          children: [],
        },
        {
          label: "产品介绍",
          children: ["物联感知", "互联感知"],
        },
        {
          label: "使用文档",
          children: [],
        },
      ],
    };
  },

  mounted() {
    this.verifyTokens();
  },
  methods: {
    ...mapMutations(["updateUserId"]),
    async verifyTokens() {
      //查看是否通过首页免密登录
      if (this.$route.params && "type" in this.$route.params) {
        //更新数据
        this.updateUserId(this.$route.params.uid);
        this.hasLogIn = true;
        return;
      }
      let token = localStorage.getItem("token");
      let res = await axios.post(`${ip}/verifyToken`, {
        token,
      });
      let info = res.data.data;
      if (info.type == "user") {
        this.updateUserId(info.uid);
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
    myDataset() {
      this.$bus.$emit("dialogShow", "dataset");
    },
    myModel() {
      this.$bus.$emit("dialogShow", "model");
    },
    goCenter() {
      this.$router.push({
        name: "PersonCenter",
      });
    },
    dropdownClick(command) {
      switch (command) {
        case 0:
          this.$router.push({
            name: "IoTPerception",
          });
          break;
        case 1:
          this.$router.push({
            name: "SocialPerception",
          });
          break;
        default:
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
  right: 1vw;
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
  width: 18vw;
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
