<template>
  <div>
    <!-- 模型种类 -->
    <div class="modelsCon">
      <div class="model" v-for="model in models" @click="modelShow(model.index)">
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
import utils from "../../assets/configs/config";
var { socialsModel } = utils;
export default {
  name: "EasyConfigurationSocialPerceptionBelow",

  data() {
    var models = socialsModel[0];
    return {
      models
    };
  },

  mounted() {},

  methods: {
    modelShow(index) {
      this.$router.push({
        name: "ModelIntro",
        params: {
          modelIndex: index,
          type: 1,
        },
      });
    },
  },
};
</script>

<style scoped>
.modelsCon {
  width: 80vw;
  height: 42vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.model {
  width: 15vw;
  height: 32vh;
  /* background: #bfa; */
  box-shadow: 0 0 5px gray;
}
.model:hover {
  cursor: pointer;
}
.model:hover .modelUse {
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
