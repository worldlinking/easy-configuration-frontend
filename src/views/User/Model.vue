<template>
  <div class="model">
    <div class="modelMenuContainer">
      <div class="modelNameContainer" v-if="type==0">{{ IoTModelName[modelIndex] }}模型</div>
      <div class="modelNameContainer" v-else>{{ socialModelName[modelIndex] }}模型</div>
      <ModelMenu></ModelMenu>
    </div>
    <div class="modelRouterContainer">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ModelMenu from "../../components/User/ModelMenu.vue";
import config from "../../assets/configs/config";
let { ip,nginxIp } = config;
import {mapMutations} from 'vuex'

export default {
  name: "EasyConfigurationModel",
  components: {
    ModelMenu: ModelMenu,
  },
  data() {
    return {
      IoTModelName: ["目标检测", "语义分割", "实例分割"],
      socialModelName:['单标签文本分类','多标签文本分类','情感分析'],
      standModel: [],
    };
  },
  async created() {
    this.paramsAnalysis();
    this.initModelParams({modelIndex:this.modelIndex,type:this.type,modelName:this.modelName});
  },
  mounted() {},

  methods: {
    /* 对路由切换参数进行解析，判断要创建的模型类型 */
    ...mapMutations(['initModelParams']),
    paramsAnalysis() {
      this.modelIndex = this.$route.params.modelIndex;
      this.type = this.$route.params.type;//0：物联感知，1：社会感知
      // this.modelIndex = 0;
      // this.type = 0;
      if(this.type == 0){
        this.modelName = this.IoTModelName[this.modelIndex];
      }else{
        this.modelName = this.socialModelName[this.modelIndex];
      }
    },
  },
};
</script>

<style scoped>
.model {
  width: 100vw;
  height: 92vh;
  display: flex;
}
.modelMenuContainer {
  width: 15vw;
  height: 92vh;
  background-color: rgb(245, 245, 245);
  box-shadow: 0 0 2px gray;
}
.modelNameContainer {
  height: 5vh;
  font-size: 1vw;
  font-weight: bolder;
  display: flex;
  align-items: center;
  padding-left: 1vw;
}
.modelRouterContainer {
  height: 92vh;
  width: 85vw;
  position: relative;
}
</style>
