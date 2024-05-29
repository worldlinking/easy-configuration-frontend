<template>
  <div class="indexContainer">
    <div class="main">
      <div class="container a-container is-txl" id="a-container">
        <form class="form" id="a-form" method="" action="">
          <h2 class="form_title title">物联互联智能感知引擎</h2>
          <h2 class="form_title smallTitle">Easy Configuration</h2>
          <el-input
            class="form__input"
            type="text"
            placeholder="账号"
            autocomplete="off"
            v-model="account"
          />
          <el-input
            class="form__input"
            type="password"
            placeholder="密码"
            autocomplete="off"
            v-model="pwd"
          /><a class="form__link">忘记密码?</a>
          <button class="form__button button submit" @click="login">
            登录
          </button>
        </form>
      </div>

      <div class="container b-container is-txl" id="b-container">
        <el-form
          class="form"
          id="b-form"
          method=""
          action=""
          :rules="rules"
          :model="form"
          ref="form"
        >
          <h2 class="form_title title">账号注册</h2>
          <el-form-item prop="account">
            <el-input
              v-model="form.account"
              class="form__input input2"
              type="text"
              placeholder="账号"
              autocomplete="off"
              v-show="!hasZc"
            />
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="form.email"
              class="form__input input2"
              type="text"
              placeholder="邮箱"
              autocomplete="off"
              v-show="!hasZc"
            />
          </el-form-item>

          <el-form-item prop="pwd1">
            <el-input
              v-model="form.pwd1"
              class="form__input input2"
              type="password"
              placeholder="密码"
              autocomplete="off"
              v-show="!hasZc"
            />
          </el-form-item>

          <el-form-item prop="pwd2">
            <el-input
              v-model="form.pwd2"
              class="form__input input2"
              type="password"
              placeholder="重复密码"
              autocomplete="off"
              v-show="!hasZc"
            />
          </el-form-item>

          <el-form-item>
            <el-input
              v-model="yzm"
              class="form__input input2"
              type="text"
              placeholder="请输入邮箱收到的验证码(2分钟内有效)"
              autocomplete="off"
              v-show="hasZc"
            />
          </el-form-item>

          <button
            class="form__button button submit"
            @click="startSign"
            v-show="!hasZc"
          >
            注册
          </button>

          <button
            class="form__button button submit"
            @click="submit"
            v-show="hasZc"
          >
            确定
          </button>
        </el-form>
      </div>

      <div class="switch is-txr" id="switch-cnt">
        <div class="switch__circle"></div>
        <div class="switch__circle switch__circle--t"></div>

        <div class="switch__container is-hidden" id="switch-c2">
          <h2 class="switch__title title">已有账号 ？</h2>
          <p class="switch__description description">
            输入用户名和密码登录我们的网站
          </p>
          <button class="switch__button button switch-btn">去登录</button>
        </div>

        <div class="switch__container" id="switch-c1">
          <h2 class="switch__title title">暂无账号 ？</h2>
          <p class="switch__description description">
            注册一个您的专属账号获取服务
          </p>
          <button class="switch__button button switch-btn">去注册</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../assets/configs/config";
import {mapMutations} from "vuex";
let { ip } = config;

export default {
  name: "Index",

  data() {
    var checkEmail = (rule, value, callback) => {
      const regEmail =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法的邮箱！"));
    };
    var checkPwd = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请再次输入密码!"));
        return;
      } else if (value != this.form.pwd1) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      account: "",
      pwd: "",
      hasZc: false,
      form: {
        account: "",
        email: "",
        pwd1: "",
        pwd2: "",
      },
      yzm: "",
      rules: {
        account: [
          {
            required: true,
            message: "请输入账号!",
            trigger: "blur",
          },
        ],
        pwd1: [
          {
            required: true,
            message: "请输入密码!",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        pwd2: [{ validator: checkPwd, trigger: "blur" }],
        yzm: [
          {
            required: true,
            message: "验证码不可为空!",
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {
    let switchCtn = document.querySelector("#switch-cnt");
    let switchC1 = document.querySelector("#switch-c1");
    let switchC2 = document.querySelector("#switch-c2");
    let switchCircle = document.querySelectorAll(".switch__circle");
    let switchBtn = document.querySelectorAll(".switch-btn");
    let aContainer = document.querySelector("#a-container");
    let bContainer = document.querySelector("#b-container");
    let allButtons = document.querySelectorAll(".submit");

    let getButtons = (e) => e.preventDefault();

    let changeForm = (e) => {
      switchCtn.classList.add("is-gx");
      setTimeout(function () {
        switchCtn.classList.remove("is-gx");
      }, 1500);
      this.changeForm = changeForm;

      switchCtn.classList.toggle("is-txr");
      switchCircle[0].classList.toggle("is-txr");
      switchCircle[1].classList.toggle("is-txr");

      switchC1.classList.toggle("is-hidden");
      switchC2.classList.toggle("is-hidden");

      aContainer.classList.toggle("is-txl");
      bContainer.classList.toggle("is-txl");
      bContainer.classList.toggle("is-z200");
    };

    let mainF = (e) => {
      for (var i = 0; i < allButtons.length; i++)
        allButtons[i].addEventListener("click", getButtons);
      for (var i = 0; i < switchBtn.length; i++)
        switchBtn[i].addEventListener("click", changeForm);
    };

    window.addEventListener("load", mainF);
  },

  methods: {
    ...mapMutations(['updateUserid']),

    async login() {
      //登录
      let res = await axios.post(`${ip}/login`, {
        account: this.account,
        pwd: this.pwd,
      });

      if (res.data.code == 200) {
        localStorage.setItem("token", res.data.data.token);

        let info = res.data.data;

        this.$message({
          message: "登录成功！",
          type: "success",
        });

        this.updateUserid(res.data.data.user_id);

        if (res.data.data.type == "user") {
          this.$router.replace({
            name: "Navigation",
            params: info,
          });
        } else {
          this.$router.replace({
            name: "CreateStandModel",
            params: info,
          });
        }
      } else {
        this.$message({
          message: "登录失败，请稍后再试！",
          type: "error",
        });
      }
    },
    async startSign() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          let res = await axios.post(`${ip}/sign`, {
            account: this.form.account,
            pwd: this.form.pwd1,
            email: this.form.email,
          });
          if (res.data.code == 200) {
            this.hasZc = true;
          } else {
            this.$message({
              type: "error",
              message: res.data.info,
            });
          }
        } else {
          return false;
        }
      });
    },
    async submit() {
      if (this.yzm == "") return;
      let res = await axios.post(`${ip}/compareYzm`, {
        account: this.form.account,
        yzm: this.yzm,
      });
      if (res.data.code == 200) {
        this.$message({
          type: "success",
          message: "注册成功！",
        });
        // 进入登录页面
        this.account = this.form.account;
        this.changeForm();
      } else if (res.data.code == 499) {
        this.$message({
          type: "error",
          message: "验证码已过期，请重新注册！",
        });
        this.hasZc = false;
      } else {
        this.$message({
          type: "error",
          message: "注册失败，请稍候再试！",
        });
      }
    },
  },
};
</script>

<style scoped>
*,
*::after,
*::before {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
}

/* Generic */
.indexContainer {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Montserrat", sans-serif;
  font-size: 12px;
  background-color: #ecf0f3;
  color: #a0a5a8;
}

/**/
.main {
  position: relative;
  width: 1000px;
  min-width: 1000px;
  min-height: 600px;
  height: 600px;
  padding: 25px;
  background-color: #ecf0f3;
  box-shadow: 10px 10px 10px #d1d9e6, -10px -10px 10px #f9f9f9;
  border-radius: 12px;
  overflow: hidden;
}
@media (max-width: 1200px) {
  .main {
    transform: scale(0.7);
  }
}
@media (max-width: 1000px) {
  .main {
    transform: scale(0.6);
  }
}
@media (max-width: 800px) {
  .main {
    transform: scale(0.5);
  }
}
@media (max-width: 600px) {
  .main {
    transform: scale(0.4);
  }
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  width: 600px;
  height: 100%;
  padding: 25px;
  background-color: #ecf0f3;
  transition: 1.25s;
}

.form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.form__icon {
  object-fit: contain;
  width: 30px;
  margin: 0 5px;
  opacity: 0.5;
  transition: 0.15s;
}
.form__icon:hover {
  opacity: 1;
  transition: 0.15s;
  cursor: pointer;
}
.form__input {
  width: 350px;
  height: 40px;
  margin: 4px 0;
  padding-left: 4px;
  font-size: 13px;
  letter-spacing: 0.15px;
  border: none;
  outline: none;
  font-family: "Montserrat", sans-serif;
  background-color: #ecf0f3;
  transition: 0.25s ease;
  border-radius: 8px;
}

.input2 {
  padding-left: 0px;
}
.el-input >>> .el-input__inner {
  width: 350px !important;
  height: 40px;
  box-shadow: inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #f9f9f9;
}
.form__input:focus {
  /* box-shadow: inset 4px 4px 4px #d1d9e6, inset -4px -4px 4px #f9f9f9; */
}
.form__span {
  margin-top: 30px;
  margin-bottom: 12px;
}
.form__link {
  color: #181818;
  font-size: 15px;
  margin-top: 25px;
  border-bottom: 1px solid #a0a5a8;
  line-height: 2;
}

.title {
  font-size: 34px;
  font-weight: 700;
  line-height: 3;
  color: #181818;
}

.smallTitle {
  font-size: 20px;
  font-weight: bolder;
  line-height: 1;
  color: rgb(79, 125, 164);
  margin-bottom: 2vh;
}

.description {
  font-size: 14px;
  letter-spacing: 0.25px;
  text-align: center;
  line-height: 1.6;
}

.button {
  width: 180px;
  height: 50px;
  border-radius: 25px;
  margin-top: 50px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 1.15px;
  background-color: #4b70e2;
  color: #f9f9f9;
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #f9f9f9;
  border: none;
  outline: none;
}

/**/
.a-container {
  z-index: 100;
  left: calc(100% - 600px);
}

.b-container {
  left: calc(100% - 600px);
  z-index: 0;
}

.switch {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 400px;
  padding: 50px;
  z-index: 200;
  transition: 1.25s;
  background-color: #ecf0f3;
  overflow: hidden;
  box-shadow: 4px 4px 10px #d1d9e6, -4px -4px 10px #f9f9f9;
}
.switch__circle {
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background-color: #ecf0f3;
  box-shadow: inset 8px 8px 12px #d1d9e6, inset -8px -8px 12px #f9f9f9;
  bottom: -60%;
  left: -60%;
  transition: 1.25s;
}
.switch__circle--t {
  top: -30%;
  left: 60%;
  width: 300px;
  height: 300px;
}
.switch__container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  width: 400px;
  padding: 50px 55px;
  transition: 1.25s;
}
.switch__button {
  cursor: pointer;
}
.switch__button:hover {
  box-shadow: 6px 6px 10px #d1d9e6, -6px -6px 10px #f9f9f9;
  transform: scale(0.985);
  transition: 0.25s;
}
.switch__button:active,
.switch__button:focus {
  box-shadow: 2px 2px 6px #d1d9e6, -2px -2px 6px #f9f9f9;
  transform: scale(0.97);
  transition: 0.25s;
}

/**/
.is-txr {
  left: calc(100% - 400px);
  transition: 1.25s;
  transform-origin: left;
}

.is-txl {
  left: 0;
  transition: 1.25s;
  transform-origin: right;
}

.is-z200 {
  z-index: 200;
  transition: 1.25s;
}

.is-hidden {
  visibility: hidden;
  opacity: 0;
  position: absolute;
  transition: 1.25s;
}

.is-gx {
  animation: is-gx 1.25s;
}

@keyframes is-gx {
  0%,
  10%,
  100% {
    width: 400px;
  }
  30%,
  50% {
    width: 500px;
  }
}

.submit:hover {
  cursor: pointer;
}
</style>
