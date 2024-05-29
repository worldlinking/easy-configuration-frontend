<template>
  <div class="usePublicModel">
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

      <el-form-item label="选择上传待预测样本方式" v-show="this.type===1">
        <el-select v-model="form.uploadType" placeholder="选择上传待预测样本方式">
          <el-option label="输入单条文本方式" value='0'></el-option>
          <el-option label="本地上传" value='1'></el-option>
          <el-option label="爬虫数据" value='2'></el-option>
        </el-select>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="上传待预测样本">
            <el-input v-show="form.uploadType==='0'" @change="txtChanged" style="width: 50%" v-model="form.txtContent"></el-input>
            <el-select v-show="form.uploadType==='2'" @change="reUpload" v-model="selectedSpiderJob"  placeholder="请选择爬虫任务" size="small">
              <el-option
                  v-for="(item, index) in spiderJobs"
                  :key="index"
                  :label="item.taskName"
                  :value="item.id"
              ></el-option>
            </el-select>
            <el-upload
              v-show="this.type===0"
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
            <el-upload
                v-show="form.uploadType==='1'"
                class="avatar-uploader"
                :show-file-list="false"
                action=""
                :before-upload="beforeSocialUpload"
            >
              <div v-if="predictType == 'zip' || predictType == 'text' ">{{ currentFile.name }}</div>
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
            <div v-show="predictType == 'zip' && this.type===0">{{ predictZipSrc }}</div>
            <div v-show="this.type===1 ">{{ txtResult }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="预测与下载">
        <el-button type="primary" @click="predictS">预测</el-button>
        <el-button @click="downPredict">下载</el-button>
      </el-form-item>
    </el-form>

    <!--  分析结果展示    -->
    <div v-show="resultVisible" style="display: flex" class="dataCheckBox">
      <div class="resultTableContainer">
        <el-table
            :data="predictResult"
            height="500"
            border
            style="width: 100%"
        >
          <el-table-column
              v-for="(item,index) in predictHeader"
              :key="index"
              :prop="item.prop"
              :label="item.label"

          />
        </el-table>
      </div>
      <div ref="chartContainer" class="chartContainer">
        <el-row style="margin-bottom: 1rem">
          <el-button type="primary" round @click="showCharts('time')" v-show="this.modelName!=='主题挖掘'">时序图</el-button>
          <el-button type="success" round @click="showCharts('location')" v-show="this.modelName!=='主题挖掘'">柱状图</el-button>
          <el-button type="primary" round @click="showCharts('topic')" v-show="this.modelName==='主题挖掘'">条形图</el-button>
        </el-row>
        <div id="resultChart" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../assets/configs/config";
import { mapState, mapMutations } from "vuex";
import * as echarts from "echarts";
let { ip, nginxIp } = config;
export default {
  name: "WorkspaceJsonUseMyModel",

  data() {
    return {
      selectedSpiderJob:'',
      form: {
        standModel: "",
        standModelWeight: "",
        txtContent:'',
        uploadType:'',
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
        'modelName',
      "spiderJobs",
      "currentStandModel",
      "currentWeight",
      "predictImgSrc",
      "predictZipSrc",
      "predictStatus",
        "type",
        'txtResult',
        'predictHeader',
        'predictResult',
    ]),
    resultVisible(){
      return this.predictResult.length > 0 && this.form.uploadType==='2'
    },
    predictImgLink() {
      if (this.predictStatus != 2) return this.predictImgSrc;
      if (!this.error) {
        return this.predictImgSrc + ".png";
      } else {
        return this.predictImgSrc + ".jpg";
      }
    },
    topicchartOption(){
      let resultList = this.predictResult.map(function (item) {
        return item['result'];
      });
      let protList = this.predictResult.map(function (item) {
        return item['pro'];
      });
      let wordList0 = resultList[0].split(",");
      let proList0 = protList[0].split(",").map(function (item) {
        return parseFloat(item);
      });
      console.log(proList0)
      let option = {
        title: {
          text: '条形图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            interval: 0
          },
          data: wordList0
        },
        series: [
          {
            type: 'bar',
            data: proList0
          },
        ]
      };
      return option
    },
    locationchartOption(){
      let locationList = this.predictResult.map(function (item) {
        return item['location'];
      });
      let time=[...new Set(locationList)]
      console.log(time)
      // let pos=this.countData(time,'积极','location')
      // let neg=this.countData(time,'消极','location')
      // let neu=this.countData(time,'中立','location')
      let pos=this.countData(time,'happy','location')
      let sad=this.countData(time,'sad','location')
      let angry=this.countData(time,'angry','location')
      let fear=this.countData(time,'fear','location')
      let surprise=this.countData(time,'surprise','location')
      let neu=this.countData(time,'neutral','location')
      // console.log(pos,neg)
      // let dataSeries=[
      //   {
      //     name:'postive',
      //     type:'bar',
      //     data:pos,
      //   },
      //   {
      //     name:'neutral',
      //     type:'bar',
      //     data:neu,
      //   },
      //   {
      //     name:'negtive',
      //     type:'bar',
      //     data:neg,
      //   }
      // ]
      let dataSeries=[
        {
          name:'happy',
          type:'bar',
          data:pos,
        },
        {
          name:'neutral',
          type:'bar',
          data:neu,
        },{
          name:'sad',
          type:'bar',
          data:sad,
        },{
          name:'angry',
          type:'bar',
          data:angry,
        },{
          name:'fear',
          type:'bar',
          data:fear,
        },
        {
          name:'surprise',
          type:'bar',
          data:surprise,
        }
      ]
      let option = {
        title: {
          text: '地区柱状图'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['happy','neutral','surprise','fear','angry','sad']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: time,
          // axisLabel: {
          //   interval: 2
          // },
        },
        yAxis: {
          type: 'value'
        },
        series: dataSeries
      };
      return option
    },
    timechartOption(){
      let timeList = this.predictResult.map(function (item) {
        return item['time'];
      });
      let time=[...new Set(timeList)]
      let pos=this.countData(time,'happy','time')
      let sad=this.countData(time,'sad','time')
      let angry=this.countData(time,'angry','time')
      let fear=this.countData(time,'fear','time')
      let surprise=this.countData(time,'surprise','time')
      let neu=this.countData(time,'neutral','time')
      let dataSeries=[
        {
          name:'happy',
          type:'line',
          data:pos,
        },
        {
          name:'neutral',
          type:'line',
          data:neu,
        },{
          name:'sad',
          type:'line',
          data:sad,
        },{
          name:'angry',
          type:'line',
          data:angry,
        },{
          name:'fear',
          type:'line',
          data:fear,
        },
        {
          name:'surprise',
          type:'line',
          data:surprise,
        }
      ]
      let option = {
        title: {
          text: '时序图'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['happy','neutral','surprise','fear','angry','sad']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            interval: 1
          },
          data: time
        },
        yAxis: {
          type: 'value'
        },
        series: dataSeries
      };
      return option
    }
  },
  async created() {
    await this.getStandModel();
    await this.getAllSpiderJobs(this);
  },
  mounted() {
    console.log('模型类型',this.type)
  },

  methods: {
    ...mapMutations([
      "getStandModel",
      "getAllSpiderJobs",
      "initModelParams",
      "updateCurrentWeight",
      "predict",
      "reUpload",
    ]),
    countData(list,type,attr){
      const res = new Map();
      let timeIndex={}
      for(let i=0;i<list.length;i++){
        timeIndex[list[i]]=i
      }
      let pos=list.map(function (item) {
        return {count:0};
      });
      this.predictResult.filter((item) => {
        // res收集第一次存在的元素，如果存在，查看存在的位置，对list中的count进行叠加
        if(res.has(item[attr])){
          for(let [key,value] of res){
            if(key===item[attr] && item.result===type){
              pos[timeIndex[key]].count += 1
            }
          }
        }
        return !res.has(item[attr]) &&  res.set(item[attr], 1) && item.result===type
      })
      pos=pos.map(function (item) {
        return item['count'];
      });
      return pos
    },
    initCharts(value){
      const myChart = echarts.init(document.getElementById('resultChart'))
      if (value==='time'){
        myChart.setOption(this.timechartOption);
      }else if (value==='location'){
        myChart.setOption(this.locationchartOption);
      }else if (value==='topic'){
        myChart.setOption(this.topicchartOption);
      }
      window.addEventListener('resize',function (){
        myChart.resize()
      })
    },
    showCharts(value){
      console.log(value)
      this.$nextTick( ()=> {
        this.initCharts(value)
      })
    },
    columnWidth(item) {
      let widthStr = ''
      if (item === 'text') {
        widthStr = '400'
      } else {
        widthStr = '100'
      }
      return widthStr
    },
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
    beforeSocialUpload(file){
      if (file.type == "text/plain" || file.type == "text/csv") {
        this.predictType = "text";
        this.currentFile = file;
        this.reUpload();
      } else if (file.type == "application/x-zip-compressed") {
        this.predictType = "zip";
        this.currentFile = file;
        this.reUpload();
      } else {
        this.$message({
          type: "error",
          message: "只接受.txt,.csv或者zip文件",
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
    txtChanged(content){
      this.reUpload();
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
      if(this.form.uploadType==='0'){
        this.predictType = "txt";
      }else if(this.form.uploadType==='2'){
        this.predictType = "spider";
      }
      this.predict({
        current_file: this.currentFile,
        weight_id: this.form.standModelWeight,
        standModel_id: this.form.standModel,
        cp: this,
        predictType: this.predictType,
        task_id:this.selectedSpiderJob,
        txtContent:this.form.txtContent
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
      }else if (this.predictType == "text" || this.predictType == "spider") {
        fetch(this.txtResult.replace("\\", "/")+'.txt').then((res) => {
          res.blob().then((blob) => {
            const blobUrl = window.URL.createObjectURL(blob);
            const filename = 'predict.txt';
            const a = document.createElement('a');
            a.href = blobUrl;
            console.log(blobUrl)
            a.download = filename;;
            a.click();
            window.URL.revokeObjectURL(blobUrl);
          });
        });
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
.usePublicModel {
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
.resultTableContainer{
  width: 45vw;
  margin-right: 2rem;
}

.chartContainer {
  width: 35vw;
  height: 50vh;
}

#resultChart{
  width: 100%;
  height: 25rem;
}
</style>
