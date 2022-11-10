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
export default {
  name: "EasyConfigurationIoTPerceptionBelow",

  data() {
    return {
      IoTs: ["可见光传感器", "红外传感器", "激光雷达传感器", "声光气液传感器"],
      currentIndex: 0,
      models: [
        [
          {
            backPath: "/images/od.jpg",
            title: "目标检测",
            smallTile: "目标检测的任务是找出图像中感兴趣的目标",
            index:0,
          },
          {
            backPath: "/images/yf.jpg",
            title: "语义分割",
            smallTile: "将原始数据转换为感兴趣区域的掩模",
            index:1
          },
          {
            backPath: "/images/is.png",
            title: "实例分割",
            smallTile: "将原始数据转换为感兴趣区域的掩模",
            index:2
          },
        ],
        [
          {
            backPath: "",
            title: "模型1",
            smallTile: "模型1描述",
            index:3,
          },
          {
            backPath: "",
            title: "模型2",
            smallTile: "模型2描述",
            index:4
          },
          {
            backPath: "",
            title: "模型3",
            smallTile: "模型3描述",
            index:5
          },
        ],
        [
          {
            backPath: "",
            title: "模型1",
            smallTile: "模型1描述",
            index:6
          },
          {
            backPath: "",
            title: "模型2",
            smallTile: "模型2描述",
            index:7
          },
          {
            backPath: "",
            title: "模型3",
            smallTile: "模型3描述",
            index:8
          },
        ],
        [
          {
            backPath: "",
            title: "模型1",
            smallTile: "模型1描述",
            index:9
          },
          {
            backPath: "",
            title: "模型2",
            smallTile: "模型2描述",
            index:10
          },
          {
            backPath: "",
            title: "模型3",
            smallTile: "模型3描述",
            index:11
          },
        ],
      ],
    };
  },

  mounted() {},

  methods: {
    carouselChange(index) {
      this.currentIndex = index;
    },
    modelShow(index){
      this.$router.push({
        name:"Model",
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
