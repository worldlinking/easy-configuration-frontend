<template>
  <div class="NavigationAbove">
    <div class="navAboveHead">
      <div class="nahTitle">物联互联智能感知引擎</div>
      <div class="nahBtnC">
        <el-button
          type="primary"
          size="medium"
          @click="selectModel"
          class="nabBtn btn1"
          style="
            backgroundColor: rgb(2, 111, 228);
            border: 0;
            border-radius: 0;
            width: 6vw;
          "
          >立即使用</el-button
        >
        <el-button
          type="primary"
          size="medium"
          @click=""
          class="nabBtn btn2"
          style="
            backgroundColor: #fff;
            border: 0;
            color: black;
            border-radius: 0;
            width: 6vw;
          "
          >使用文档</el-button
        >
      </div>
    </div>
    <div class="navAboveBelow">
      <div class="nabLeft">
        <div class="navTitle">
          零算法基础
          <br />
          定制物联互联AI模型
        </div>
        <div class="navChooses">
          <div class="navChoose">
            <i class="el-icon-s-order"></i>
            使用文档
          </div>
          <div class="navChoose">
            <i class="el-icon-s-promotion"></i>
            应用案例
          </div>
        </div>
      </div>
      <div class="nabRight"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EasyConfigurationNavigationAbove",
  props:{
    makeDialogShow:Function
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    selectModel(){
      this.makeDialogShow('intro');
    }
  },
};
</script>

<style scoped>
.NavigationAbove {
  width: 50vw;
  height: 40vh;
}
.navAboveHead {
  position: relative;
  height: 12vh;
}
.navAboveBelow {
  height: 28vh;
  display: flex;
  background-color: white;
  box-shadow: 0 0  5px 0 gray;
}
.nahTitle {
  display: flex;
  position: absolute;
  height: 12vh;
  font-size: 1.5vw;
  justify-content: center;
  align-items: center;
  left: 1vw;
  font-weight: bolder;
  letter-spacing: 0.2vw;
}
.nahBtnC {
  position: absolute;
  top: 0;
  right: 0;
  width: 15vw;
  height: 12vh;
  display: flex;
  justify-content: right;
  align-items: center;
}
.nabLeft {
  width: 15vw;
  height: 28vh;
  /* background-color: rebeccapurple; */
}
.nabRight {
  width: 35vw;
  height: 28vh;
  /* background-color: green; */
  display: flex;
  flex-direction: column;
  background: url(/images/navBack.png);
}
.navTitle {
  height: 7vh;
  /* background-color: brown; */
  /* text-align: center; */
  line-height: 3.5vh;
  font-weight: 500;
  font-size: 1vw;
  padding-left: 2vw;
}
.navChoose {
  padding-left: 2vw;
  height: 7vh;
  line-height: 7vh;
  font-size: 0.8vw;
}
.navChoose:hover {
  cursor: pointer;
  opacity: 50%;
}
.btn1:hover{
  background-color: #0192e6 !important;
}
.btn2:hover{
  color: #23A8F2 !important;
  /* border: 2px solid black !important; */
}
</style>
