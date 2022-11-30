<template>
  <div class="downLoadModel">
    <el-form ref="form" :model="form" label-width="500">
      <el-form-item label="选择我模型权限">
        <el-radio-group v-model="radio" @input="radioChange">
          <el-radio :label="1">我的模型</el-radio>
          <el-radio :label="2">公共模型</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="选择模型">
        <el-select
          placeholder="请选择模型"
          v-model="form.modelId"
          @change="modelChange"
        >
          <el-option
            v-for="(model, i) in radioModels"
            :label="
              model.name +
              (model.status == 2 ? '--------训练完成' : '--------训练未完成')
            "
            :value="model.id"
            :key="model.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="选择模型权重">
        <el-select placeholder="请选择权重" v-model="form.weightName" multiple>
          <el-option
            v-for="(weightName, i) in currentWeightName"
            :key="i"
            :label="weightName"
            :value="weightName"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="权重下载">
        <el-button
          @click="downloadWeights"
          type="primary"
          style="borderradius: 0"
          >点击下载</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import config from "../../assets/configs/config";
let { nginxWeightIp } = config;
export default {
  name: "EasyConfigurationDownLoadModel",

  data() {
    return {
      radio: 1,
      form: {
        weightName: [],
        modelId: "",
      },
    };
  },

  mounted() {
    this.getAllModel(this);
    this.getAllPubicModel();
  },

  methods: {
    ...mapMutations([
      "getAllModel",
      "getWeightName",
      "getAllPubicModel",
      "clearCurrentWeightName",
    ]),
    modelChange(index) {
      this.getWeightName({ model_id: index, cp: this });
    },
    radioChange(index) {
      this.form = {
        weightName: [],
        modelId: "",
      };
      this.clearCurrentWeightName();
    },
    downloadWeights() {
      for (var weight of this.form.weightName) {
        //查找模型名称
        var model = this.radioModels.filter(
          (item) => item.id == this.form.modelId
        );
        name = model[0].name;
        var path = `${nginxWeightIp}/user${this.user_id}/${name}/${this.form.weightName}`;
        let a = document.createElement("a");
        let event = new MouseEvent("click");
        a.download = name;
        a.href = path.replace("\\", "/");
        a.dispatchEvent(event);
      }
    },
  },
  computed: {
    ...mapState([
      "models",
      "modelType",
      "currentWeightName",
      "publicOthersModels",
      "user_id",
    ]),
    modelsInType() {
      return this.models.filter((value) => {
        return value.standModel__type == this.modelType;
      });
    },
    radioModels() {
      if (this.radio == 1) {
        return this.modelsInType;
      } else if (this.radio == 2) {
        return this.publicOthersModels;
      }
    },
  },
};
</script>

<style scoped>
.downLoadModel {
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
</style>
