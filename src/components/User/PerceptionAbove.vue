<template>
  <div class="perceptionAbove" :class="{ IoT: isIoT,social:!isIoT }">
    <!-- 标题 -->
    <div class="perTitle" v-if="isIoT">
      {{ Title }}
    </div>
    <div class="perTitle2" v-else>
      {{ Title }}
    </div>
    <!-- 小标题 -->
    <div class="smallTitle">
      <div v-if="isIoT">
        通过可见光传感器、红外传感器和激光雷达等传感器,
        <br>
        实现物与物、物与人的泛连接，实现对事件的检测。
      </div>
      <div v-if="!isIoT" class="socialST">
        借助于各类互联网大数据研究人类时空间行为特征，
        <br>
        并进而揭示社会经济现象的时空分布格局、联系以及演化过程
      </div>
    </div>

    <!-- 立即使用按钮 -->
    <!-- <div class="perBtns">
      <el-button type="primary" size="default" style="background:#036FE2;border-radius:0;">立即使用</el-button>
      <el-button type="primary" size="default" style="background:#036FE2;border-radius:0;">使用文档</el-button>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "EasyConfigurationPerceptionAbove",
  props: ["isIoT", "Title"],
  data() {
    return {
      backPath: "/images/IoTBack.png",
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
.perceptionAbove {
  position: relative;
  height: 50vh;
  width: 100vw;
}
.IoT {
  background: url(/images/IoTBack.png);
  background-size:cover;

}

.social {
  background: url(/images/socialBack.jpg);
  background-size:cover;
}
.perTitle {
  position: absolute;
  left: 10vw;
  top: 8vh;
  color: white;
  font-size: 2vw;
}
.perTitle2{
  position: absolute;
  left: 10vw;
  top: 8vh;
  color: black;
  font-size: 2vw;
}
.smallTitle {
  position: absolute;
  left: 10vw;
  top: 20vh;
  color: white;
  font-size: 1vw;
}
.perBtns{
  position: absolute;
  left: 18vw;
  top: 30vh;
}
.socialST{
  color: black;
  font-weight:bolder;
}
</style>
