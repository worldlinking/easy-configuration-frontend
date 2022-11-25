<template>
  <div class="useMyModel">
    <el-form ref="form" :model="form" label-width="500">
      <el-form-item label="选择我的模型">
        <el-select
          placeholder="请选择模型"
          v-model="form.modelId"
          @change="modelChange"
        >
          <el-option
            v-for="(model, i) in modelsInType"
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
        <el-select placeholder="请选择权重" v-model="form.weightName">
          <el-option
            v-for="(weightName, i) in currentWeightName"
            :key="i"
            :label="weightName"
            :value="weightName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上传预测文件">
        <el-upload
          v-show="this.type === 0"
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
          <i v-if="!predictType" class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="预测结果">
        <img
          :src="predictImgLink"
          width="500"
          height="300"
          v-if="predictType == 'image' && predictImgLink != ''"
          @error="imgOnError"
        />
        <div v-show="predictType == 'zip' && this.type === 0">
          {{ myPredictZipSrc }}
        </div>
      </el-form-item>

      <el-form-item label="预测与下载">
        <el-button type="primary" @click="toPredict">预测</el-button>
        <el-button @click="downPredict">下载</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "EasyConfigurationUseMyModel",

  data() {
    return {
      form: {
        modelId: "",
        weightName: "",
      },
      predictType: "",
      currentFile: null,
      imageUrl: "",
      uploadImgBase64: "",
      error: false,
    };
  },

  mounted() {
    this.getAllModel(this);
  },

  methods: {
    ...mapMutations([
      "getAllModel",
      "getWeightName",
      "myReUpload",
      "useMyModelToPredict",
    ]),
    modelChange(index) {
      this.getWeightName({ model_id: index, cp: this });
    },
    beforeUpload(file) {
      if (file.type == "image/jpeg" || file.type == "image/png") {
        this.predictType = "image";
        this.toBase64(file);
        this.currentFile = file;
        this.myReUpload();
      } else if (file.type == "application/x-zip-compressed") {
        this.predictType = "zip";
        this.currentFile = file;
        this.myReUpload();
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
    toPredict() {
      if (this.myPredictStatus == 1) {
        this.$message({
          type: "error",
          message: "预测中,请勿重复点击!",
        });
        return;
      } else if (this.myPredictStatus == 2) {
        this.$message({
          type: "warning",
          message: "已预测完成，请勿重复预测!",
        });
        return;
      }
      var predictForm = {
        model_id: this.form.modelId,
        weight_name: this.form.weightName,
        predict_file: this.currentFile,
      };
      this.useMyModelToPredict({
        predictForm,
        cp: this,
        predictType: this.predictType,
      });
    },
    imgOnError() {
      this.error = true;
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
        a.href = this.myPredictZipSrc.replace("\\", "/");
        a.dispatchEvent(event);
      } else if (this.predictType == "text") {
        fetch(this.txtResult.replace("\\", "/") + ".txt").then((res) => {
          res.blob().then((blob) => {
            const blobUrl = window.URL.createObjectURL(blob);
            const filename = "predict.txt";
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          });
        });
      }
    },
  },
  computed: {
    ...mapState([
      "models",
      "modelType",
      "currentWeightName",
      "type",
      "myPredictImgSrc",
      "myPredictZipSrc",
      "myPredictStatus",
    ]),
    modelsInType() {
      return this.models.filter((value) => {
        return value.standModel__type == this.modelType;
      });
    },
    predictImgLink() {
      if (this.myPredictStatus != 2) return this.myPredictImgSrc;
      if (!this.error) {
        return this.myPredictImgSrc + ".png";
      } else {
        return this.myPredictImgSrc + ".jpg";
      }
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
  padding-right: 1vw;
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
