<template>
  <!-- 主页 -->
  <div class="home">
    <div class="homeContainer">
      <!-- 主页标题 -->
      <div class="header">
        <!-- 标题 -->
        <div class="homeTitle">Easy Configuration</div>
        <!-- 登录按钮 -->
        <div class="logBtnC">
        <el-button type="primary" size="small">登录/注册</el-button>
        </div>
      </div>

      <!-- 主页主体 -->
      <div> 我是主体 </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      
    };
  },
  created(){
    //验证cookie
    // let cookie = 
  }
  
};
</script>

<style scoped>
.homeContainer{
  height: 100vh;
  width:100vw;
}
.header {
  height: 8vh;
  background-color: rgb(41,42,43);
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
}
.logBtnC{
  position: absolute;
  height: 8vh;
  right: 1vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
