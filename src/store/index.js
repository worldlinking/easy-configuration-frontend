import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";
import config from "../assets/configs/config";
let { ip, nginxIp, modelsName } = config;

Vue.use(Vuex);

const options = {
  state: {
    user_id: 1,
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
    models: [],
    spiderJobs: [],
    connectDataset: [], //所有能关联的数据集：自己的+公有的
    currentWeightName: [],
    myPredictImgSrc:
      "https://img.tukuppt.com/png_preview/00/04/81/SYZxWQlAr9.jpg!/fw/780",
    myPredictZipSrc: "暂无结果",
    myPredictStatus: 0,
    publicOthersModels: [],
    lossData: [],
    allModelName: [],
    myStandModel: [],
    allStandDataSet: [],
  },
  actions: {},
  mutations: {
    async getAllModelName(state) {
      let res = await axios.get(`${ip}/getAllModelName`);
      state.allModelName = res.data.data;
      // console.log(state.allModelName);
    },
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
    async getAllSpiderJobs(state, cp) {
      //查询关联的模型
      const loading = cp.$loading({
        lock: true,
        text: "数据加载中......,请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let res = await axios.get(
        `${ip}/spider/taskJobList/?user_id=${state.user_id}`
      );

      if (res.data.code != 200) {
        cp.$message({
          message: "加载失败！请检查网络后重试！",
          type: "error",
        });
        return;
      }

      loading.close();
      state.spiderJobs = res.data.data;
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
    myReUpload(state) {
      state.myPredictImgSrc =
        "https://img.tukuppt.com/png_preview/00/04/81/SYZxWQlAr9.jpg!/fw/780";
      state.myPredictZipSrc = "暂无结果";
      state.myPredictStatus = 0;
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
    async getAllModel(state, cp) {
      //查询关联的模型
      const loading = cp.$loading({
        lock: true,
        text: "数据加载中......,请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let res = await axios.get(
        `${ip}/selectAllModel?user_id=${state.user_id}`
      );

      if (res.data.code != 200) {
        cp.$message({
          message: "加载失败！请检查网络后重试！",
          type: "error",
        });
        return;
      }

      loading.close();
      state.models = res.data.data;
      state.models.forEach((value) => {
        value.model_type_name = modelsName[value.standModel__type];
      });
    },
    async createAModel(state, { form: form, cp: cp }) {
      form.user_id = state.user_id;

      let res = await axios.post(`${ip}/createModel`, form);
      if (res.data.code == 200) {
        cp.$message({
          message: "创建模型成功！",
          type: "success",
        });
        cp.form = {
          name: "",
          standModel_id: "",
          limit: null,
        };
      }
    },
    async deleteADataset(state, { dataset_id, cp }) {
      let res = await axios.get(`${ip}/deleteDataset?dataset_id=${dataset_id}`);

      if (res.data.code == 200) {
        cp.$message({
          type: "success",
          message: "删除成功!",
        });
        cp.getAllDataset(cp);
      } else {
        cp.$message({
          type: "error",
          message: "删除失败!",
        });
      }
    },

    async trainAModel(state, { form, cp }) {
      let res = await axios.post(`${ip}/trainModel`, form);
      if (res.data.code == 200) {
        cp.$message({
          type: "success",
          message: "开始训练成功！",
        });
        cp.getAllModel(cp);
      } else {
        cp.$message({
          type: "error",
          message: "开始训练失败！",
        });
      }
      cp.exitTrain();
    },

    async stopATrain(state, { model_id, cp }) {
      let res = await axios.get(`${ip}/stopTrain?model_id=${model_id}`);
      if (res.data.code == 200) {
        cp.$message({
          type: "success",
          message: "终止成功！",
        });
        cp.getAllModel(cp);
      } else {
        cp.$message({
          type: "error",
          message: "终止失败！",
        });
      }
    },
    async getConnectDataset(state) {
      let res = await axios.get(
        `${ip}/selectConnectDataset?user_id=${state.user_id}&model_type=${state.modelType}`
      );
      if (res.data.code == 200) {
        var cds = JSON.parse(res.data.data);
        state.connectDataset = cds.map((cd) => {
          var obj = cd.fields;
          obj.id = cd.pk;
          return obj;
        });
      } else {
        cp.$message({
          type: "error",
          message: "数据集获取失败！",
        });
      }
    },
    async connectToDataset(state, { model_id, dataset_id, cp }) {
      let res = await axios.get(
        `${ip}/datasetToModel?model_id=${model_id}&dataset_id=${dataset_id}`
      );
      if (res.data.code == 200) {
        cp.$message({
          type: "success",
          message: "关联数据集成功！",
        });
        cp.getAllModel(cp);
        cp.cancelConnect();
      } else {
        cp.$message({
          type: "error",
          message: "关联数据集失败！",
        });
      }
    },
    async getWeightName(state, { model_id, cp }) {
      state.currentWeightName = [];
      let res = await axios.get(`${ip}/getWeightName?model_id=${model_id}`);
      if (res.data.code == 200) {
        state.currentWeightName = res.data.data;
      } else {
        cp.$message({
          type: "error",
          message: "权重获取失败",
        });
      }
    },
    async useMyModelToPredict(state, { predictForm, cp, predictType }) {
      if (!predictForm.predict_file) {
        cp.$message({
          type: "error",
          message: "请先上传文件！",
        });
        return;
      }

      state.myPredictStatus = 1;
      if (predictType == "image") {
        let postUrl = `${ip}/useTrainedModelToPredictImage`;
        const formData = new FormData();

        formData.append("model_id", parseInt(predictForm.model_id));
        formData.append("user_id", state.user_id);
        formData.append("predict_file", predictForm.predict_file);
        formData.append("weight_name", predictForm.weightName);
        const loading = cp.$loading({
          lock: true,
          text: "预测中......,请稍等",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        let res = await axios.post(postUrl, formData);
        loading.close();
        if (res.data.code == 200) {
          cp.$message({
            type: "success",
            message: "预测成功!",
          });

          state.myPredictImgSrc = nginxIp + "\\" + res.data.data;
          state.myPredictStatus = 2;
        } else {
          cp.$message({
            type: "success",
            message: "预测失败!",
          });
          state.myPredictStatus = 3;
        }
      } else if (predictType == "zip") {
        let postUrl = `${ip}/useTrainedModelToPredictZip`;
        const formData = new FormData();
        formData.append("model_id", parseInt(predictForm.model_id));
        formData.append("user_id", state.user_id);
        formData.append("predict_zip", predictForm.predict_file);
        formData.append("weight_name", predictForm.weight_name);
        const loading = cp.$loading({
          lock: true,
          text: "预测中......,请稍等",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        let res = await axios.post(postUrl, formData);
        loading.close();
        if (res.data.code == 200) {
          cp.$message({
            type: "success",
            message: "预测成功!",
          });
          if (state.type === 0) {
            state.myPredictZipSrc = nginxIp + "\\" + res.data.data;
          }
          state.myPredictStatus = 2;
        } else {
          state.myPredictStatus = 3;
        }
      }
    },
    async getAllPubicModel(state) {
      let res = await axios.get(
        `${ip}/getAllPubicModel?model_type=${state.modelType}&user_id=${state.user_id}`
      );

      var models = JSON.parse(res.data.data).map((item) => {
        var obj = item.fields;
        obj.id = item.pk;
        return obj;
      });
      state.publicOthersModels = models;
    },
    clearCurrentWeightName(state) {
      state.currentWeightName = [];
    },
    async getLossData(state) {
      let res = await axios.get(
        `${ip}/getLossData?user_id=${state.user_id}&model_type=${state.modelType}`
      );
      state.lossData = res.data.data;
    },
    async deleteModel(state, { model_id, cp }) {
      let res = await axios.get(
        `${ip}/deleteModel?user_id=${state.user_id}&model_id=${model_id}`
      );
      if (res.data.code == 200) {
        cp.$message({
          message: "删除成功！",
          type: "success",
        });
        cp.getAllModel(cp);
      } else {
        cp.$message({
          message: "删除失败！",
          type: "error",
        });
      }
    },
    async createAStandModel(state, { form, cp }) {
      let postUrl = `${ip}/uploadStandModel`;
      const formData = new FormData();
      formData.append("user_id", state.user_id);
      for (var key in form) {
        formData.append(key, form[key]);
      }
      const loading = cp.$loading({
        lock: true,
        text: "上传中......,请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let res = await axios.post(postUrl, formData);
      loading.close();
      if (res.data.code == 200) {
        cp.$message({
          type: "success",
          message: "上传成功!",
        });
      }
    },
    async importFormUrl(state, { url, format, cp, dataset_id }) {
      const loading = cp.$loading({
        lock: true,
        text: "上传中......请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      let res = await axios.post(`${ip}/importDataFromUrl`, {
        url,
        format,
        dataset_id,
        user_id: state.user_id,
      });

      loading.close();
      if (res.data.code == 200) {
        cp.$message({
          type: "success",
          message: "上传成功!",
        });
        cp.getAllDataset();
        cp.closeImportShow();
      } else {
        cp.$message({
          type: "error",
          message: "上传失败!",
        });
      }
    },
    async getStandModelById(state, { cp }) {
      //查询关联的标准模型
      const loading = cp.$loading({
        lock: true,
        text: "数据加载中......,请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      let res = await axios.get(
        `${ip}/getAllStandModelById?admin_id=${state.user_id}`
      );
      loading.close();

      state.myStandModel = res.data.data;
    },
    async getAllStandDataSet(state) {
      let res = await axios.get(`${ip}/getAllStandDataSet`);
      state.allStandDataSet = JSON.parse(res.data.data);
      state.allStandDataSet = state.allStandDataSet.map((value) => {
        var obj = value.fields;
        obj.id = value.pk;
        return obj;
      });
    },
  },
};

export default new Vuex.Store(options);
