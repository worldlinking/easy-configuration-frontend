<template>
  <div class="NavigationBelow">
    <!-- 物联感知导航 -->
    <div class="gzNav wl">
      <div class="gzHeader">
        <i class="el-icon-headset" style="color: blue"></i>
        物联感知>
      </div>
      <div class="gzData">
        <div class="gzSData">可见光传感器</div>
        <div class="gzSData">红外相机</div>
        <div class="gzSData">激光雷达</div>
        <div class="gzSData">其他传感器</div>
      </div>
      <div class="gzLine"></div>
      <div class="gzDesc">
        通过各种信息传感器、全球定位系统、红外感应器、射频识别技术、激光扫描等各种装置与技术，实时采集任何需要监控、
        连接、互动的物体或过程。通过各类可能的网络接入，实现物与物、物与人的泛连接，实现对事件的检测。
      </div>
    </div>
    <!-- 互联感知导航 -->
    <div class="gzNav hl">
      <div class="gzHeader">
        <i class="el-icon-mobile-phone" style="color: blue"></i>
        互联感知>
      </div>
      <div class="gzData">
        <div class="gzSData">推特数据</div>
        <div class="gzSData">微博数据</div>
        <div class="gzSData">微博数据</div>
      </div>
      <div class="gzLine"></div>
      <div class="gzDesc">
        通过获取网络各种社交平台的言论信息，对各种热点事件进行舆情分析。
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EasyConfigurationNavigationBelow",

  data() {
    return {};
  },

  mounted() {},

  methods: {},
};
</script>

<style scoped>
.NavigationBelow {
  width: 80vw;
  height: 46vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.gzNav {
  box-sizing: content-box;
  width: 35vw;
  height: 40vh;
  /* background-color: bisque; */
  background-color: rgb(250, 250, 252);
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 3px 0 gray;
}
.gzNav:hover {
  border: 2px rgb(2, 111, 228) solid;
  cursor: pointer;
}
.gzNav:hover .gzHeader {
  color: rgb(2, 111, 228);
}
.gzNav:hover .gzDesc {
  opacity: 100%;
}
.gzHeader {
  width: 35vw;
  height: 10vh;
  text-align: center;
  line-height: 10vh;
  font-size: 1.3vw;
  letter-spacing: 0.5vw;
}
.gzData {
  display: flex;
  height: 3vh;
  justify-content: space-around;
  align-items: center;
}
.gzSData {
  width: 7vw;
  background-color: rgb(245, 245, 245);
  text-align: center;
  font-weight: 500;
}
.gzDesc {
  padding: 2vw;
  font-size: 1vw;
  opacity: 75%;
}
.gzLine {
  border: 1px solid gray;
  opacity: 50%;
  width: 30vw;
  margin-left: 2.5vw;
  margin-top: 1vw;
}
</style>
