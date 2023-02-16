<template>
  <div class="ModelsInDialog">
    <div class="modelsCon iot">
      <div class="title">物联感知</div>
      <div class="types">
        <div class="oneType" v-for="iot in iotModels">
          <div class="typeTitle">
            <div class="colorDot" :style="{ backgroundColor: iot.color }"></div>
            <div>{{ iot.label }}</div>
          </div>
          <div class="typeModels">
            <div class="typeModelCon" v-for="type in iot.types">
              <el-card
                shadow="hover"
                class="myCard"
                @click.native="switchToModel(0, type.index)"
              >
                {{ type.title }}
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modelsCon social">
      <div class="title">互联感知</div>
      <div class="types">
        <div class="oneType" v-for="iot in socialModels">
          <div class="typeTitle">
            <div class="colorDot" :style="{ backgroundColor: iot.color }"></div>
            <div>{{ iot.label }}</div>
          </div>
          <div class="typeModels">
            <div class="typeModelCon" v-for="type in iot.types">
              <el-card
                shadow="hover"
                class="myCard"
                @click.native="switchToModel(1, type.index)"
              >
                {{ type.title }}
              </el-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "../../assets/configs/config";
var { IoTs, IOTModels, iotColors, socials, socialsModel, socialsColors } =
  utils;
export default {
  name: "EasyConfigurationModelsInDialog",
  props:{
    currentMode:String
  },
  data() {
    var iotModels = [];
    for (var i = 0; i < IoTs.length; i++) {
      let models = iotModels[i];
      iotModels.push({
        label: IoTs[i],
        color: iotColors[i],
        types: IOTModels[i].map((item) => {
          return {
            title: item.title,
            index: item.index,
          };
        }),
      });
    }

    var socialModels = [];
    for (var i = 0; i < socials.length; i++) {
      let models = socialsModel[i];
      socialModels.push({
        label: socials[i],
        color: socialsColors[i],
        types: socialsModel[i].map((item) => {
          return {
            title: item.title,
            index: item.index,
          };
        }),
      });
    }

    return {
      socialModels,
      iotModels,
    };
  },

  mounted() {
  },

  methods: {
    switchToModel(woh, index) {
      var routeName = '';
      if(this.currentMode == 'intro'){
        routeName = 'ModelIntro';
      }else if(this.currentMode == 'dataset'){
        routeName = 'MyDataset';
      }else if(this.currentMode == 'model'){
        routeName = 'MyModel';
      }
      this.$router.push({
        name: routeName,
        params: {
          modelIndex: index,
          type: woh,
        },
      });
    },

  },
};
</script>

<style scoped>
.ModelsInDialog {
  width: 100%;
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.modelsCon {
  height: 29vh;
  width: 100%;
}
.iot {
  /* background-color: cadetblue; */
}
.social {
  /* background-color: yellowgreen; */
}
.title {
  height: 4vh;
  display: flex;
  padding-left: 0.4vw;
  align-items: center;
  color: black;
  font-weight: bolder;
}
.types {
  height: 25vh;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.oneType {
  height: 25vh;
  width: 23%;
  /* background-color: red; */
}
.typeTitle {
  color: black;
  font-size: 5px;
  display: flex;
  width: 100%;
  /* justify-content: space-around; */
  align-items: center;
  height: 2vh;
}
.colorDot {
  border-radius: 50%;
  /* border: solid black 2px; */
  height: 0.5vw;
  width: 0.5vw;
  margin-right: 0.5vw;
  opacity: 60%;
}
.typeModels {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 22vh;
}
.typeModelCon {
  margin-top: 1.8vh;
}
.myCard {
  height: 5vh;
  display: flex;
  width: 90%;
  /* text-align: center; */
  justify-content: center;
  align-items: center;
  background-color: rgba(1, 1, 1, 0.02);
  font-weight: 500;
}
.myCard:hover {
  cursor: pointer;
}
</style>
