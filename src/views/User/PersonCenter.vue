<template>
  <div class="personCenter">
    <div class="header">
      <div class="inner-header flex"></div>
      <div>
        <svg
          class="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shape-rendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g class="parallax">
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="0"
              fill="rgba(255,255,255,0.7"
            />
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="3"
              fill="rgba(255,255,255,0.5)"
            />
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="5"
              fill="rgba(255,255,255,0.3)"
            />
            <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>
    </div>
    <div class="personInfoCon">
      <div class="infoCon">
        <div class="singleCon">
          <div class="label">
            <div class="oneInfo">账户</div>
          </div>
          <div class="info">
            <div class="userInfo">
              {{ info.account }}
            </div>
          </div>
        </div>

        <div class="singleCon">
          <div class="label">
            <div class="oneInfo">密码</div>
          </div>
          <div class="info">
            <div class="userInfo">
              {{ info.pwd }}
            </div>
          </div>
        </div>

        <div class="singleCon">
          <div class="label">
            <div class="oneInfo">邮箱</div>
          </div>
          <div class="info">
            <div class="userInfo">
              {{ info.email }}
            </div>
          </div>
        </div>

        <div class="singleCon">
          <div class="label">
            <div class="oneInfo">用户类型</div>
          </div>
          <div class="info">
            <div class="userInfo">
              {{ info.type == 1 ? "普通用户" : "管理员" }}
            </div>
          </div>
        </div>

        <div class="btnCon">
          <el-button
            type="primary"
            size="mini"
            @click="dialogShow = true"
            class="myBtn"
            >修改密码</el-button
          >
        </div>
      </div>
    </div>

    <el-dialog title="输入密码" :visible.sync="dialogShow">
      <!-- 数据集信息 -->
      <el-form :model="form">
        <el-form-item label="新密码">
          <el-input
            v-model="form.pwd1"
            autocomplete="off"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label="重复密码">
          <el-input
            v-model="form.pwd2"
            autocomplete="off"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">关闭</el-button>
        <el-button type="primary" @click="submitPwd">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../assets/configs/config";
import { mapState, mapMutations } from "vuex";
let { ip } = config;
export default {
  name: "EasyConfigurationPersonCenter",

  data() {
    return {
      info: {},
      dialogShow: false,
      form: {
        pwd1: "",
        pwd2: "",
      },
    };
  },

  mounted() {
    console.log(this.user_id);
    
    this.getUserInfo();
  },

  methods: {
    async getUserInfo() {
      let res = await axios.get(`${ip}/getUserInfoById?id=${this.user_id}`);
      if (res.data.code == 200) {
        this.info = res.data.data;
        console.log(this.info);
        
      } else {
        this.$message({
          type: "error",
          message: "加载失败，稍后再试！",
        });
      }
    },
    async submitPwd() {
      if (this.form.pwd1 != this.form.pwd2) {
        this.$message({
          type: "error",
          message: "两次密码输入不一致！",
        });
        return;
      } else if (!this.form.pwd1) {
        this.$message({
          type: "error",
          message: "请输入密码",
        });
        return;
      }
      let res = await axios.get(
        `${ip}/changePwd?id=${this.info.id}&pwd=${this.form.pwd1}`
      );
      if (res.data.code == 200) {
        this.$message({
          type: "success",
          message: "修改成功!",
        });
        this.getUserInfo();
        this.dialogShow = false;
      } else {
        this.$message({
          type: "error",
          message: "修改失败!",
        });
      }
    },
  },
  computed: {
    ...mapState(["user_id"]),
  },
};
</script>

<style scoped>
.personCenter {
  width: 100%;
  height: 100%;
  position: relative;
}
. body {
  margin: 0;
}

h1 {
  font-family: "Lato", sans-serif;
  font-weight: 300;
  letter-spacing: 2px;
  font-size: 48px;
}

p {
  font-family: "Lato", sans-serif;
  letter-spacing: 1px;
  font-size: 14px;
  color: #333333;
}

.header {
  position: relative;
  text-align: center;
  background: linear-gradient(
    60deg,
    rgba(84, 58, 183, 1) 0%,
    rgba(0, 172, 193, 1) 100%
  );
  color: white;
}

.logo {
  width: 50px;
  fill: white;
  padding-right: 15px;
  display: inline-block;
  vertical-align: middle;
}

.inner-header {
  height: 65vh;
  width: 100%;
  margin: 0;
  padding: 0;
}

.flex {
  /*Flexbox for containers*/
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.waves {
  position: relative;
  width: 100%;
  height: 15vh;
  margin-bottom: -7px;
  /*Fix for safari gap*/
  min-height: 100px;
  max-height: 150px;
}

.content {
  position: relative;
  height: 20vh;
  text-align: center;
  background-color: white;
}

/* Animation */

.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}

.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}

.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}

.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}

.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}

@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }

  100% {
    transform: translate3d(85px, 0, 0);
  }
}

/*Shrinking for mobile*/
@media (max-width: 768px) {
  .waves {
    height: 40px;
    min-height: 40px;
  }

  .content {
    height: 30vh;
  }

  h1 {
    font-size: 24px;
  }
}

.personInfoCon {
  position: absolute;
  width: 25%;
  height: 60%;
  left: 37.5%;
  top: 10%;
}
.infoCon {
  width: 100%;
  height: 100%;
  border: 1px solid black;
  border-radius: 5%;
  background-color: rgba(255, 255, 255, 0.8);

  /* display: flex;
  flex-direction: row;
  justify-content: space-around;
  border: 1px solid black;
  height: 100%; */
}
.singleCon {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height: 20%;
}
.label {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.oneInfo:hover {
  background-color: rgba(66, 165, 245, 1);
}
.oneInfo {
  height: 30%;
  width: 100%;
  text-align: center;
  font-weight: bolder;
  background-color: rgba(66, 165, 245, 0.5);
  border-radius: 5%;
}
.oneInfo:hover {
  cursor: pointer;
}
.info {
  width: 30%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.userInfo {
  height: 30%;
  width: 100%;
  text-align: center;
}
.userInfo:hover {
  cursor: pointer;
  text-decoration-line: underline;
}
.btnCon {
  height: 30%;
  width: 100%;
  display: flex;
  justify-content: center;
}
.myBtn {
  width: 20%;
  height: 35%;
}
</style>
