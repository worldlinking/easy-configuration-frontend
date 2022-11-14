<template>
  <div class="useMyModel">
    <el-form ref="form" :model="form" label-width="500">
      <el-form-item label="标准模型">
        <el-select
          v-model="form.standModel"
          placeholder="请选择标准模型"
          @change="smChange"
        >
          <el-option
            v-for="(sm, index) in currentStandModel"
            :key="index"
            :label="sm.name"
            :value="sm.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="训练权重">
        <el-select v-model="form.standModelWeight" placeholder="请选择训练权重">
          <el-option
            v-for="(sm, index) in currentWeight"
            :key="index"
            :label="
              sm.fields.weight_path + '  ---' + sm.fields.dataset + '数据集'
            "
            :value="sm.pk"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="上传待预测样本">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              action=""
              :before-upload="beforeUpload"
            >
              <img
                v-if="predictType == 'image'"
                :src="imageUrl"
                class="avatar"
                width="500"
                height="300"
              />
              <div v-if="predictType == 'zip'">{{ currentFile.name }}</div>
              <i
                v-if="!predictType"
                class="el-icon-plus avatar-uploader-icon"
              ></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预测结果">
            <img
              :src="predictImgLink"
              width="500"
              height="300"
              v-if="predictType == 'image' && predictImgLink != ''"
              @error="imgOnError"
            />
            <div v-show="predictType == 'zip'">{{ predictZipSrc }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="预测与下载">
        <el-button type="primary" @click="predictS">预测</el-button>
        <el-button @click="downPredict">下载</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../assets/configs/config";
import { mapState, mapMutations } from "vuex";
let { ip, nginxIp } = config;
export default {
  name: "WorkspaceJsonUseMyModel",

  data() {
    return {
      form: {
        standModel: "",
        standModelWeight: "",
      },
      imageUrl: "",
      uploadImgBase64: "",
      currentFile: null,
      predictType: "",
      error: false,
    };
  },
  computed: {
    ...mapState([
      "currentStandModel",
      "currentWeight",
      "predictImgSrc",
      "predictZipSrc",
      "predictStatus",
    ]),
    predictImgLink() {
      if (this.predictStatus != 2) return this.predictImgSrc;
      if (!this.error) {
        return this.predictImgSrc + ".png";
      } else {
        return this.predictImgSrc + ".jpg";
      }
    },
  },
  async created() {
    await this.getStandModel();
  },
  mounted() {},

  methods: {
    ...mapMutations([
      "getStandModel",
      "initModelParams",
      "updateCurrentWeight",
      "predict",
      "reUpload",
    ]),
    beforeUpload(file) {
      if (file.type == "image/jpeg" || file.type == "image/png") {
        this.predictType = "image";
        this.toBase64(file);
        this.currentFile = file;
        this.reUpload();
      } else if (file.type == "application/x-zip-compressed") {
        this.predictType = "zip";
        this.currentFile = file;
        this.reUpload();
      } else {
        this.$message({
          type: "error",
          message: "只接受.png,.jpg或者zip文件",
        });
      }
      return false;
    },
    toBase64(file) {
      const self = this;
      let reader = new FileReader();
      reader.onloadend = function () {
        self.uploadImgBase64 = reader.result;
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    },
    async predictS() {
      if (this.predictStatus == 1) {
        this.$message({
          type: "error",
          message: "预测中,请勿重复点击!",
        });
        return;
      } else if (this.predictStatus == 2) {
        this.$message({
          type: "warning",
          message: "已预测完成，请勿重复预测!",
        });
        return;
      }
      this.predict({
        current_file: this.currentFile,
        weight_id: this.form.standModelWeight,
        standModel_id: this.form.standModel,
        cp: this,
        predictType: this.predictType,
      });
    },
    downPredict() {
      if (this.predictType == "image") {
        let img = new Image();
        img.setAttribute("crossOrigin", "Anonymous");
        img.onload = function () {
          let canvas = document.createElement("canvas");
          let context = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0, img.width, img.height);
          let url = canvas.toDataURL("images/png");
          let a = document.createElement("a");
          let event = new MouseEvent("click");
          a.download = "predict.png" || "default.png";
          a.href = url;
          a.dispatchEvent(event);
        };
        img.src = this.predictImgLink + "?v=" + Date.now();
      } else if (this.predictType == "zip") {
        let a = document.createElement("a");
        let event = new MouseEvent("click");
        a.download = "predict.zip";
        a.href = this.predictZipSrc.replace("\\", "/");
        a.dispatchEvent(event);
      }
    },
    smChange(newSm) {
      this.updateCurrentWeight(newSm);
    },
    imgOnError() {
      this.error = true;
    },
  },
  watch: {
    uploadImgBase64(newBase) {
      this.imageUrl = newBase;
    },
  },
};
</script>

<style scoped>
.useMyModel {
  padding-top: 3vh;
  padding-left: 1vw;
}
.avatar-uploader >>> .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
</style>
