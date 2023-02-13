<template>
  <div class="uploadStandModelWeight">
    <el-form
      ref="datasetForm"
      :model="form"
      label-width="80px"
      label-position="top"
      :rules="rules"
    >
      <el-form-item label="选择标准模型" prop="name">
        <el-select
          @change="smChange"
          clearable
          v-model="form.name"
          placeholder="请选择标准模型"
          style="width: 30vw"
        >
          <el-option
            v-for="(sm, index) in myStandModel"
            :label="sm.name"
            :value="index"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="标准模型信息">
        <div v-if="!currentSm" class="noChoose">暂未选择标准模型</div>
        <div class="smType" v-if="currentSm">
          <span class="smallTitle">作用领域:</span>
          <span class="smJJ">
            {{ allModelName[currentSm.type] }}
          </span>
        </div>
        <div class="smInfo" v-if="currentSm">
          <span class="smallTitle">其他信息:</span>
          <span class="smJJ">
            {{ currentSm.info }}
          </span>
        </div>
      </el-form-item>

      <el-form-item label="已上传权重">
        <div v-if="currentSmWeights" class="">
          <el-table
            :data="currentSmWeights"
            class="tableCon"
            @row-click="clickTable"
          >
            <el-table-column
              prop="weight"
              label="模型名称"
              min-width="200"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="dataset"
              label="训练数据信息"
              min-width="200"
              align="center"
            >
            </el-table-column>

            <el-table-column label="操作" min-width="200" align="center">
              <template>
                <div>
                  <el-button type="primary" size="mini" @click="downSmWeight"
                    >下载</el-button
                  >
                  <el-button type="danger" size="mini" @click="deleteSmWeight"
                    >删除</el-button
                  >
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div v-else class="noChoose">暂未选择标准模型</div>
      </el-form-item>

      <el-form-item
        label="上传标准模型权重"
        prop="dataset"
        class="datasetFormItem"
      >
        <div v-if="currentFile" class="fileName">
          {{ currentFile.name }}
        </div>
        <div class="uploadBtnCon">
          <el-button
            type="primary"
            size="default"
            @click="uploadStandModelWeight"
            >上传标准模型权重</el-button
          >
        </div>
        <div class="datasetInfoCon">
          <span>填写训练数据信息：</span>
          <el-input v-model="form.dataset" style="width: 30vw">></el-input>
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
  name: "EasyConfigurationUploadStandModelWeight",

  data() {
    return {
      form: {
        name: "",
        dataset: "",
      },
      currentSm: null,
      currentSmWeights: null,
      status: "",
      currentSmw: {},
      rules: {
        dataset: {
          required: true,
          message: "请选择标准模型！",
          trigger: "blur",
        },
        name: {
          required: true,
          message: "请填写数据集信息！",
          trigger: "blur",
        },
      },
      currentFile: null,
    };
  },

  mounted() {
    this.getAllModelName();
    this.getStandModelById({ cp: this });
  },

  methods: {
    ...mapMutations(["getStandModelById", "getAllModelName"]),
    async smChange(index) {
      this.currentSm = this.myStandModel[index];
      //获得所有的权重信息
      var standmodel_id = this.currentSm.id;
      let res = await axios.get(
        `${ip}/getStandModelWeightById?standmodel_id=${standmodel_id}`
      );
      this.currentSmWeights = res.data.data.map((item) => {
        let obj = item.fields;
        let paths = item.fields.weight_path.split("/");
        obj.weight = paths[paths.length - 1];
        obj.id = item.pk;
        return obj;
      });
    },
    downSmWeight() {
      this.status = "download";
    },
    clickTable(smw) {
      this.currentSmw = smw;
      switch (this.status) {
        case "download":
          var type = this.currentSmw.weight_path.split("/")[2];
          var path = `${nginxStandWeightIp}/${type}/admin${this.user_id}/${this.currentSmw.weight}`;
          let a = document.createElement("a");
          let event = new MouseEvent("click");
          a.download = name;
          a.href = path.replace("\\", "/");
          a.dispatchEvent(event);
          break;
        case "delete":
          this.$confirm("此操作将永久删除模型权重, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(async () => {
              let res = await axios.get(
                `${ip}/deleteStandModelWeightById?weight_id=${this.currentSmw.id}`
              );
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                //获得所有的权重信息
                var standmodel_id = this.currentSm.id;
                let res = await axios.get(
                  `${ip}/getStandModelWeightById?standmodel_id=${standmodel_id}`
                );
                this.currentSmWeights = res.data.data.map((item) => {
                  let obj = item.fields;
                  let paths = item.fields.weight_path.split("/");
                  obj.weight = paths[paths.length - 1];
                  obj.id = item.pk;
                  return obj;
                });
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败!",
                });
              }
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除",
              });
            });
          break;
      }
    },
    deleteSmWeight() {
      this.status = "delete";
    },
    uploadStandModelWeight() {
      this.$refs["datasetForm"].validate((valid) => {
        if (valid) {
          //表单合法则打开提交页面
          this.$refs.upload.$children[0].handleClick();
        } else {
          this.$message({
            message: "请填写训练数据信息",
            type: "warning",
          });
          return false;
        }
      });
    },
    async beforeUpload(file) {
      this.currentFile = file;
      //上传数据
      const loading = this.$loading({
        lock: true,
        text: "权重上传中......,请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      const formData = new FormData();

      formData.append("standModel_id", this.currentSm.id);
      formData.append("user_id", this.user_id);
      formData.append("standModelWeight", this.currentFile);
      formData.append("dataset", this.form.dataset);

      let res = await axios.post(`${ip}/uploadStandModelWeight`, formData);

      loading.close();

      if (res.data.code == 200) {
        this.$message({
          message: "权重上传成功！",
          type: "success",
        });
        //获得所有的权重信息
        var standmodel_id = this.currentSm.id;
        let res = await axios.get(
          `${ip}/getStandModelWeightById?standmodel_id=${standmodel_id}`
        );
        this.currentSmWeights = res.data.data.map((item) => {
          let obj = item.fields;
          let paths = item.fields.weight_path.split("/");
          obj.weight = paths[paths.length - 1];
          obj.id = item.pk;
          return obj;
        });
      } else {
        this.$message({
          message: "权重上传失败！",
          type: "error",
        });
      }

      return false;
    },
  },
  computed: {
    ...mapState(["myStandModel", "allModelName", "user_id"]),
  },
};
</script>

<style scoped>
.uploadStandModelWeight {
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
.infoCon {
  left: 5vw;
}
.noChoose {
  font-weight: bolder;
  margin-left: 2vw;
  color: red;
}
.smallTitle {
  font-weight: bolder;
  margin-left: 2vw;
}
.smJJ {
  color: #0089d2;
}
.tableCon {
  width: 50vw;
}
.uploadBtnCon {
  width: 40vw;
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.submitBtnCon {
  width: 40vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fileName {
  width: 40vw;
  display: flex;
  justify-content: center;
  font-size: 20px;
  color: #25b0f3;
}
</style>
