<template>
  <div class="uploadPublicDataset">
    <el-form
      :model="modelForm"
      ref="modelForm"
      label-width="100px"
      label-position="top"
      :rules="rules"
    >
      <el-form-item label="数据集名称" prop="name">
        <el-input style="width: 30%" v-model="modelForm.name"></el-input>
      </el-form-item>
      <el-form-item label="服务类型" prop="model_type">
        <el-select
          v-model="modelForm.model_type"
          placeholder="请选择"
          style="width: 30%"
        >
          <el-option
            v-for="(modelName, i) in allModelName"
            :key="i"
            :label="modelName"
            :value="i"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据集类型" prop="type">
        <el-select
          v-model="modelForm.type"
          placeholder="请选择"
          style="width: 30%"
        >
          <el-option
            v-for="(datasetType, i) in datasetTypeName"
            :key="datasetType.value"
            :label="datasetType.label"
            :value="datasetType.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="对应的标准数据集" prop="standDataset_id">
        <el-select
          v-model="modelForm.standDataset_id"
          placeholder="请选择"
          style="width: 30%"
        >
          <el-option
            v-for="(sd, i) in standDataset"
            :key="sd.id"
            :label="sd.data_type"
            :value="sd.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传">
        <div class="datasetNameBtn" v-if="currentFile">
          {{ currentFile.name }}
        </div>
        <div class="uploadDataBtn">
          <el-button size="default" @click="uploadDataset"
            >上传数据(仅支持zip格式)</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="创建">
        <div class="uploadDataBtn">
          <el-button type="primary" size="default" @click="uploadClick"
            >开始创建</el-button
          >
        </div>
      </el-form-item>
    </el-form>

    <el-upload
      ref="upload"
      v-show="false"
      :show-file-list="false"
      action=""
      :before-upload="beforeUpload"
    >
    </el-upload>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import config from "../../assets/configs/config";
let { ip, nginxStandWeightIp } = config;
export default {
  name: "EasyConfigurationUploadPublicDataset",

  data() {
    return {
      modelForm: {
        name: "",
        model_type: "",
        type: "",
        standDataset_id: "",
      },
      currentFile: null,
      datasetTypeName: [
        {
          label: "训练集+验证集",
          value: 0,
        },
        {
          label: "测试集",
          value: 1,
        },
        {
          label: "训练集+测试集+验证集",
          value: 4,
        },
      ],
      rules: {
        name: [
          {
            required: true,
            message: "标准模型名称不得为空！",
            trigger: "blur",
          },
        ],
        model_type: [
          {
            required: true,
            message: "标准模型名称不得为空！",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "标准模型名称不得为空！",
            trigger: "blur",
          },
        ],
        standDataset_id: [
          {
            required: true,
            message: "标准模型名称不得为空！",
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {
    this.getAllModelName();
    this.getStandDataset();
  },

  methods: {
    ...mapMutations(["getAllModelName", "getStandDataset"]),
    uploadDataset() {
      this.$refs.upload.$children[0].handleClick();
    },
    beforeUpload(file) {
      if (file.type == "application/x-zip-compressed") {
        this.currentFile = file;
      } else {
        this.$message({
          message: "文件格式有误！",
          type: "error",
        });
      }
      return false;
    },
    uploadClick() {
      if (!this.currentFile) {
        this.$message({
          message: "请上传数据集后再试",
          type: "warning",
        });
        return;
      }

      this.$refs["modelForm"].validate(async (valid) => {
        if (valid) {
          let data = new FormData();
          data.append("name", this.modelForm.name);
          data.append("user_id", this.user_id);
          data.append("standDataset_id", this.modelForm.standDataset_id);
          data.append("type", this.modelForm.type);
          data.append("model_type", this.modelForm.model_type);
          data.append("dataset", this.currentFile);

          let res = await axios.post(`${ip}/uploadPublicDataset`, data);
          if (res.data.code == 200) {
            this.$message({
              message: "官方数据集上传成功！",
              type: "success",
            });
          } else {
            this.$message({
              message: "官方数据集上传失败！可能是该数据集名称已经被使用！",
              type: "error",
            });
          }
        } else {
          this.$message({
            message: "请将数据集信息填写完整后再试",
            type: "warning",
          });
        }
      });
    },
  },

  computed: {
    ...mapState(["allModelName", "standDataset", "user_id"]),
  },
};
</script>

<style scoped>
.uploadPublicDataset {
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
.uploadDataBtn {
  width: 30vw;
  display: flex;
  justify-content: center;
}
.datasetNameBtn {
  width: 30vw;
  display: flex;
  justify-content: center;
  font-size: 20px;
  color: #25b0f3;
}
</style>
