<template>
  <div class="useMyModel">
    <el-form ref="form" :model="form" label-width="500">
      <el-form-item label="标准模型">
        <el-select v-model="form.standModel" placeholder="请选择标准模型" @change="smChange">
          <el-option v-for="sm,index in currentStandModel" :key="index" :label="sm.name" :value="sm.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="训练权重">
        <el-select v-model="form.standModelWeight" placeholder="请选择训练权重">
          <el-option v-for="sm,index in currentWeight" :key="index" :label="sm.fields.weight_path" :value="sm.pk"></el-option>
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
        <el-button type="primary" @click="predictS">预测</el-button>
        <el-button type="downPredict">下载</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../assets/configs/config";
import {mapState,mapMutations} from 'vuex'
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
      currentFile: null,
    };
  },
  computed:{
    ...mapState(["currentStandModel","currentWeight","predictImgSrc"]),
  },
  async created(){
    await this.getStandModel();
  },
  mounted() {},

  methods: {
    ...mapMutations(["getStandModel","initModelParams","updateCurrentWeight","predict"]),
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
    async predictS() {
      this.predict({current_file:this.currentFile,weight_id:this.form.standModelWeight,standModel_id:this.form.standModel,cp:this});
    },
    downPredict(){

    },
    smChange(newSm){
      this.updateCurrentWeight(newSm);
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
