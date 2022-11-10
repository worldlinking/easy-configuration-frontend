<template>
  <div class="useMyModel">
    <el-form ref="form" :model="form" label-width="500">
      <el-form-item label="标准模型">
        <el-select v-model="form.standModel" placeholder="请选择标准模型">
          <el-option label="deeplabv3" value="deeplabv3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="训练权重">
        <el-select v-model="form.standModel" placeholder="请选择训练权重">
          <el-option
            label="best_deeplabv3plus_mobilenet_cityscapes_os16.pth"
            value="best_deeplabv3plus_mobilenet_cityscapes_os16.pth"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="上传待预测文件">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              action=""
              :before-upload="beforeUpload"
            >
              <img
                v-if="imageUrl"
                :src="imageUrl"
                class="avatar"
                width="500"
                height="300"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预测结果">
            <img :src="predictImgSrc" width="500" height="300" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="预测与下载">
        <el-button type="primary" @click="predict">预测</el-button>
        <el-button type="downPredict">下载</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../assets/configs/config";
let { ip,nginxIp } = config;
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
      predictImgSrc:
        "https://img.tukuppt.com/png_preview/00/04/81/SYZxWQlAr9.jpg!/fw/780",
      currentFile: null,
    };
  },

  mounted() {},

  methods: {
    beforeUpload(file) {
      this.toBase64(file);
      this.currentFile = file;
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
    async predict() {
      //上传文件进行预测
      if (!this.currentFile) {
        this.$message({
          type: "error",
          message: "请先上传待预测文件!",
        });
        return;
      }

      let postUrl = `${ip}/useStandModelWeightImage`;
      const formData = new FormData();
      formData.append("weight_id", 3);
      formData.append("standModel_id", 14);
      formData.append("predict_file", this.currentFile);
      formData.append("user_id", 2);
      let res = await axios.post(postUrl, formData);

      if (res.data.code == 200) {
        this.$message({
          type: "success",
          message: "预测成功!",
        });

        this.predictImgSrc = nginxIp + '\\' + res.data.data;
        console.log(this.predictImgSrc);
      }
    },
    downPredict(){

    }
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
