import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";
import config from "../assets/configs/config";
let { ip, nginxIp } = config;

Vue.use(Vuex);

const options = {
  state: {
    user_id: 2,
    modelIndex: -1,
    type: -1,
    currentStandModel: [],
    currentWeight: [],
    predictImgSrc:
      "https://img.tukuppt.com/png_preview/00/04/81/SYZxWQlAr9.jpg!/fw/780",
  },
  actions: {},
  mutations: {
    initModelParams(state, { modelIndex, type }) {
      state.modelIndex = modelIndex;
      state.type = type;
    },
    async getStandModel(state) {
      //根据模型种类获取所有的标准模型
      if (state.type == 0) {
        //物联感知模型
        let res = await axios.get(
          `${ip}/getAllStandModelByType?type=${state.modelIndex}`
        );
        state.currentStandModel = res.data.data;
      } else {
      }
    },
    async updateCurrentWeight(state, standModel_id) {
      let res = await axios.get(
        `${ip}/getStandModelWeight?standModel_id=${standModel_id}`
      );
      let smws = JSON.parse(res.data.data);
      smws.forEach((item, index) => {
        smws[index].fields.weight_path = item.fields.weight_path
          .split("/")
          .pop();
      });
      state.currentWeight = smws;
    },
    async predict(state, {current_file,weight_id,standModel_id,cp}) {
      //上传文件进行预测
      if (!current_file) {
        cp.$message({
            type:"error",
            message:"请先上传文件！"
        });
        return;
      }

      let postUrl = `${ip}/useStandModelWeightImage`;
      const formData = new FormData();
      
      formData.append("weight_id", parseInt(weight_id));
      formData.append("standModel_id", parseInt(standModel_id));
      formData.append("predict_file", current_file);
      formData.append("user_id", state.user_id);
      let res = await axios.post(postUrl, formData);
      if (res.data.code == 200) {
        this.$message({
          type: "success",
          message: "预测成功!",
        });

        state.predictImgSrc = nginxIp + "\\" + res.data.data;
      }
    },
  },
};

export default new Vuex.Store(options);
