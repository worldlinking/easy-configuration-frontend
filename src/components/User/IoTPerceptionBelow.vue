<template>
  <div class="IoTPerceptionBelow">
    <!-- 切换按钮 -->
    <div class="modeChange">
      <div class="modeCon">
        <el-carousel
          arrow="always"
          trigger="click"
          height="8vh"
          :autoplay="false"
          @change="carouselChange"
        >
          <el-carousel-item v-for="item in IoTs" :key="item">
            <h3>{{ item }}</h3>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <!-- 模型种类 -->
    <div class="modelsCon">
      <div class="model" v-for="model in models[currentIndex]" @click="modelShow(model.index)">
        <div
          class="back"
          :style="{ backgroundImage: `url(${model.backPath})` }"
        ></div>
        <div class="modelBelow">
          <div class="modelTitle">{{ model.title }}</div>
          <div class="modelDesc">{{ model.smallTile }}</div>
          <div class="modelUse">在线使用</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from '../../assets/configs/config'
var {IoTs,IOTModels} = utils;
export default {
  name: "EasyConfigurationIoTPerceptionBelow",

  data() {
    var models = IOTModels;
    return {
      IoTs,
      currentIndex: 0,
      models
    };
  },

  mounted() {},

  methods: {
    carouselChange(index) {
      this.currentIndex = index;
    },
    modelShow(index){
      this.$router.push({
        name:"ModelIntro",
        params:{
          modelIndex:index,
          type:0
        }
      });
    }
  },
};
</script>

<style scoped>
.IoTPerceptionBelow {
  width: 100vw;
  height: 42vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.modeChange {
  width: 45vw;
  height: 8vh;
  /* background: #bfa; */
  display: flex;
  justify-content: center;
}
.modeCon {
  width: 30vw;
  /* background: red; */
  /* display: flex;
  justify-content: space-between; */
}
.el-carousel__item {
  width: 30vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.modelsCon {
  width: 60vw;
  height: 34vh;
  display: flex;
  justify-content: space-around;
  align-items: top;
}
.model {
  width: 15vw;
  height: 32vh;
  /* background: #bfa; */
  box-shadow: 0 0 5px gray;
}
.model:hover{
  cursor: pointer;
}
.model:hover .modelUse{
  text-decoration: underline;
}
.back {
  height: 15vh;
  background-size: 15vw 15vh;
}
.modelBelow {
  height: 15vh;
  width: 15vw;
  position: absolute;
}
.modelTitle {
  height: 5vh;
  padding-left: 1.5vw;
  font-weight: bolder;
  line-height: 5vh;
}
.modelDesc {
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  font-size: 0.5vw;
  color: #949494;
  height: 7vh;
}
.modelUse {
  height: 5vh;
  padding-left: 1.5vw;
  font-size: 0.5vw;
  line-height: 5vh;
  color: #549bef;
}
</style>
