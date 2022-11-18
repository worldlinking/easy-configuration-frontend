import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";
import config from "../assets/configs/config";
let { ip, nginxIp, modelsName } = config;

Vue.use(Vuex);

const options = {
  state: {
    user_id: 2,
    modelIndex: 0,
    type: 0,
    modelName: "目标检测",
    modelType: 0,
    currentStandModel: [],
    currentWeight: [],
    predictImgSrc:
      "https://img.tukuppt.com/png_preview/00/04/81/SYZxWQlAr9.jpg!/fw/780",
    predictZipSrc: "暂无结果",
    txtResult: "暂无结果",
    predictStatus: 0,
    datasets: [],
    standDataset: [],
  },
  actions: {},
  mutations: {
    initModelParams(state, { modelIndex, type, modelName }) {
      state.modelIndex = modelIndex;
      state.type = type;
      state.modelName = modelName;

      for (var i = 0; i < modelsName.length; i++) {
        if (state.modelName == modelsName[i]) {
          state.modelType = i;
        }
      }
    },
    async getStandModel(state) {
      //根据模型种类获取所有的标准模型
      if (state.type === 0) {
        //物联感知模型
        let res = await axios.get(
          `${ip}/getAllStandModelByType?type=${state.modelIndex}`
        );
        state.currentStandModel = res.data.data;
      } else {
        let type = state.modelIndex + 3;
        let res = await axios.get(`${ip}/getAllStandModelByType?type=${type}`);
        state.currentStandModel = res.data.data;
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
    async predict(
      state,
      { current_file, weight_id, standModel_id, cp, predictType, txtContent }
    ) {
      if (!current_file && !txtContent) {
        cp.$message({
          type: "error",
          message: "请先上传文件！",
        });
        return;
      }
      state.predictStatus = 1;
      if (predictType == "image") {
        //上传文件进行预测
        if (!current_file) {
          cp.$message({
            type: "error",
            message: "请先上传文件！",
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
          cp.$message({
            type: "success",
            message: "预测成功!",
          });

          state.predictImgSrc = nginxIp + "\\" + res.data.data;
          state.predictStatus = 2;
        } else {
          state.predictStatus = 3;
        }
      } else if (predictType == "zip") {
        if (!current_file) {
          cp.$message({
            type: "error",
            message: "请先上传文件！",
          });
          return;
        }

        let postUrl = `${ip}/useStandModelWeightZip`;
        const formData = new FormData();
        formData.append("weight_id", parseInt(weight_id));
        formData.append("standModel_id", parseInt(standModel_id));
        formData.append("predict_zip", current_file);
        formData.append("user_id", state.user_id);
        let res = await axios.post(postUrl, formData);
        if (res.data.code == 200) {
          cp.$message({
            type: "success",
            message: "预测成功!",
          });
          if (state.type === 0) {
            state.predictZipSrc = nginxIp + "\\" + res.data.data;
          } else {
            state.txtResult = nginxIp + "\\" + res.data.data;
          }

          state.predictStatus = 2;
        } else {
          state.predictStatus = 3;
        }
      } else if (predictType == "text") {
        if (!current_file) {
          cp.$message({
            type: "error",
            message: "请先上传文件！",
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
          cp.$message({
            type: "success",
            message: "预测成功!",
          });

          state.txtResult = nginxIp + "\\" + res.data.data;
          state.predictStatus = 2;
        } else {
          state.predictStatus = 3;
        }
      } else if (predictType == "txt") {
        let postUrl = `${ip}/useStandModelWeightText`;
        const formData = new FormData();
        formData.append("weight_id", parseInt(weight_id));
        formData.append("standModel_id", parseInt(standModel_id));
        formData.append("content", txtContent);
        formData.append("user_id", state.user_id);
        let res = await axios.post(postUrl, formData);

        if (res.data.code == 200) {
          cp.$message({
            type: "success",
            message: "预测成功!",
          });
          state.txtResult = res.data.data;
          state.predictStatus = 2;
        } else {
          state.predictStatus = 3;
        }
      }
    },
    reUpload(state) {
      state.predictImgSrc =
        "https://img.tukuppt.com/png_preview/00/04/81/SYZxWQlAr9.jpg!/fw/780";
      state.predictZipSrc = "暂无结果";
      state.predictStatus = 0;
    },
    async getAllDataset(state, cp) {
      //查询关联的数据集
      const loading = cp.$loading({
        lock: true,
        text: "数据加载中......,请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let res = await axios.get(
        `${ip}/selectAllDataset?user_id=${state.user_id}`
      );

      if (res.data.code != 200) {
        cp.$message({
          message: "加载失败！请检查网络后重试！",
          type: "error",
        });
        return;
      }

      loading.close();
      state.datasets = res.data.data;
      state.datasets.forEach((value) => {
        value.model_type_name = modelsName[value.model_type];
      });
    },
    async getStandDataset(state) {
      let res = await axios.get(`${ip}/selectAllStandDataset`);
      state.standDataset = JSON.parse(res.data.data);
      state.standDataset = state.standDataset.map((value) => {
        var obj = value.fields;
        obj.id = value.pk;
        return obj;
      });
    },
    async createADataset(state, { form: form, cp: cp }) {
      form.user_id = state.user_id;
      form.model_type = state.modelType;
      console.log(form);

      let res = await axios.post(`${ip}/createDataset`, form);
      if (res.data.code == 200) {
        cp.$message({
          message: "创建数据集成功！",
          type: "success",
        });
        cp.dialogFormVisible = false;
        cp.form = {
          name: "",
          type: 0,
          limit: 0,
          standDataset_id: "",
        };
        cp.getAllDataset(cp);
      }
    },
    async importAtData(state, { dataset_id, dataset, cp }) {
      const formData = new FormData();

      formData.append("user_id", state.user_id);
      formData.append("dataset_id", dataset_id);
      formData.append("dataset", dataset);

      let res = await axios.post(`${ip}/importData?formatType=zip`, formData);
      if (res.data.code == 200) {
        cp.$message({
          type: "success",
          message: "数据导入成功",
        });
        cp.getAllDataset(cp);
      } else {
        cp.$message({
          type: "error",
          message: "数据导入失败",
        });
      }
    },
  },
};

export default new Vuex.Store(options);
