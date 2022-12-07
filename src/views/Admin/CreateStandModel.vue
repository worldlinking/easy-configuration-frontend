<template>
  <div class="createStandModel">
    <div class="formCon">
      <el-form
        ref="datasetForm"
        :model="form"
        label-width="80px"
        label-position="top"
        :rules="rules"
      >
        <!-- 训练参数 -->
        <el-form-item label="标准模型名称" prop="name">
          <el-input v-model="form.name" style="width: 30vw">></el-input>
        </el-form-item>

        <!-- 训练参数 -->
        <el-form-item label="训练参数">
          <div class="paramList">
            <div class="singleParam" v-for="(param, i) in params">
              <div class="singleParamCon">
                <div class="paramTitle">名称</div>
                <el-input v-model="params[i].name"></el-input>
              </div>
              <div class="singleParamCon">
                <div class="paramTitle">默认值</div>
                <el-input v-model="params[i].default"></el-input>
              </div>
              <div class="singleParamCon">
                <div class="paramTitle">中文名</div>
                <el-input v-model="params[i].alias"></el-input>
              </div>
              <div class="singleParamCon">
                <el-button type="danger" size="default" @click="deleteParam(i)"
                  >删除</el-button
                >
              </div>
            </div>
            <div class="btnCon">
              <el-button
                type="primary"
                size="default"
                style="backgroundcolor: #0781d7"
                @click="toAddParam"
                >添加训练参数+</el-button
              >
            </div>
          </div>
        </el-form-item>

        <el-form-item label="模型类型" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择模型类型"
            style="width: 30vw"
          >
            <el-option
              v-for="(modelName, i) in allModelName"
              :key="i"
              :label="modelName"
              :value="i"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="数据集格式"
          label-width="auto"
          prop="stand_dataset_id"
        >
          <el-select
            v-model="form.stand_dataset_id"
            placeholder="请选择数据集格式"
            style="width: 30vw"
          >
            <el-option
              v-for="(sd, i) in standDataset"
              :key="i"
              :label="sd.data_type"
              :value="sd.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="其他模型信息" label-width="auto" prop="info">
          <el-input v-model="form.info" style="width: 30vw">></el-input>
        </el-form-item>

        <el-form-item label="上传模型" label-width="auto">
          <div class="fileNameCon" v-if="file">
            {{ file.name }}
          </div>
          <div class="uploadCon">
            <el-button
              type="primary"
              size="default"
              @click="uploadModel"
              v-if="!file"
              >点击上传（只支持zip格式）</el-button
            >
            <el-button type="primary" size="default" @click="uploadModel" v-else
              >重新上传（只支持zip格式）</el-button
            >
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="createStandModel"
            >立即创建</el-button
          >
          <el-button @click="clear">请空</el-button>
        </el-form-item>
      </el-form>
    </div>
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
export default {
  name: "EasyConfigurationCreateStandModel",

  data() {
    return {
      form: {
        name: "",
        type: "",
        stand_dataset_id: "",
        info: "",
      },
      params: [{ name: "epoch", default: 50, alias: "步数" }],
      file: null,
      rules: {
        name: [
          {
            required: true,
            message: "标准模型名称不得为空！",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择模型的类型！",
            trigger: "blur",
          },
        ],
        stand_dataset_id: [
          {
            required: true,
            message: "请选择数据集格式！",
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
    ...mapMutations([
      "getAllModelName",
      "getStandDataset",
      "createAStandModel",
    ]),
    toAddParam() {
      this.params.push({ name: "", default: "", alias: "" });
    },
    deleteParam(i) {
      if (this.params[i].name == "epoch") {
        this.$message({
          message: "必须包含该参数！",
          type: "error",
        });
        return;
      }
      this.params.splice(i, 1);
    },
    uploadModel() {
      this.$refs.upload.$children[0].handleClick();
    },
    beforeUpload(file) {
      if (file.type == "application/x-zip-compressed") {
        this.file = file;
      } else {
        this.$message({
          message: "文件格式有误！",
          type: "error",
        });
      }
      return false;
    },
    createStandModel() {
      this.$refs["datasetForm"].validate((valid) => {
        if (valid) {
          //表单合法则提交
          let params = JSON.stringify(this.params).replaceAll("\\", "");
          this.form.params = params;
          if (!this.file) {
            this.$message({
              message: "请上传标准模型文件后再试！",
              type: "error",
            });
            return;
          }
          this.form.net = this.file;
          this.createAStandModel({ cp: this, form: this.form });
        } else {
          return false;
        }
      });
    },
    clear(){
      this.form = {
        name: "",
        type: "",
        stand_dataset_id: "",
        info: "",
      };
      this.params = this.params.splice(0,1);
      this.file = null;
    }
  },
  computed: {
    ...mapState(["allModelName", "standDataset"]),
  },
};
</script>

<style scoped>
.createStandModel {
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
.formCon {
  width: 40vw;
}
.paramList {
  /* height: 20vh; */
  width: 45vw;
  /* background-color: bisque; */
  /* display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center; */
}
.singleParam {
  display: flex;
  justify-content: space-around;
  width: 45vw;
  height: 5vh;
  /* background-color: bisque; */
}
.singleParamCon {
  width: 10vw;
  height: 3vh;
  /* background-color: bisque; */
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.paramTitle {
  width: 3vw;
  font-weight: 500;
}
.btnCon {
  height: 5vh;
  width: 40vw;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: aquamarine; */
}
.fileNameCon {
  width: 30vw;
  display: flex;
  justify-content: center;
  font-size: 20px;
  color: #25b0f3;
}
.fileNameCon:hover {
  cursor: pointer;
  text-decoration: underline;
}
.uploadCon {
  width: 30vw;
  display: flex;
  justify-content: center;
}
</style>
