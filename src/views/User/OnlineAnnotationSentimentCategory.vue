<template>
  <div class="onlineAnnotationSentimentCategory">
    <el-form ref="form" :model="form" label-width="500" class="formCon">
      <el-form-item label="选择要标注的数据集">
        <el-select
            v-model="form.standDs"
            placeholder="请选择"
            @change="datasetChange"
        >
          <el-option
              v-for="item in datasetsInType"
              :key="item.id"
              :label="item.name"
              :value="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="currentDataset.standDataset__data_type?currentDataset.standDataset__data_type + '格式标注区':'标注区'"> </el-form-item>
    </el-form>

    <div class="annCon">
      <div class="leftCon">
        <div class="leftFun">
          <div>
            <el-button type="primary" size="default" @click="startAnn"
            >开始标注</el-button
            >
          </div>
          <div>
            <el-button type="primary" size="default" @click="lastText"
            >上一篇</el-button
            >
            <el-button type="primary" size="default" @click="nextText"
            >下一篇</el-button
            >
          </div>
          <div>
            <el-button size="default" type="primary" @click="clearAnn"
            >清除</el-button
            >
            <el-button type="primary" size="default" @click="saveAnn"
            >保存</el-button
            >
          </div>
        </div>

        <div class="labelCon">
          <div class="labelList">
            <div
                class="singleLabel"
                v-for="(label, index) in labelList"
                @click="changeCurrentLabel(label, index)"
                :id="'label' + index"
            >
              <div class="label">{{ label.name }}</div>
              <el-button type="danger" size="mini" @click="deleteLabel(index)"
              >删除</el-button
              >
            </div>
          </div>
          <div class="btnCon">
            <el-button type="primary" size="mini" @click="addLabel"
            >添加标签</el-button
            >
          </div>
        </div>
      </div>

      <div class="textAnnCon">
          <el-card class="canvasCon">
            <div class="textCon"><span>{{currentText}}</span></div>
            <el-divider content-position="left">标注结果</el-divider>
<!--            <div v-for="(label, index) in currentLabelResult"-->
<!--                 :key="index">-->
              <el-tag v-show="this.currentLabelResult"> {{currentLabelResult}} </el-tag>
<!--            </div>-->
          </el-card>
      </div>
      <div class="textListCon">
        <el-tree
            ref="tree"
            node-key="id"
            :data="textListData"
            :props="defaultProps"
            :highlight-current="true"
            @node-click="nodeClick"
            :default-expand-all="true"
            accordion
        ></el-tree>
      </div>
    </div>

  <el-dialog title="添加新标签" :visible.sync="dialogFormVisible">
      <el-form :model="labelForm">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="labelForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAddLabel">取 消</el-button>
        <el-button type="primary" @click="commitAddLabel">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";
import config from "../../assets/configs/config";
let { ip, nginxIp, nginxDatasetsIp } = config;
export default {
  name: "OnlineAnnotationSentimentCategory",
  data() {
    return {
      form:{
        standDs: "",
      },
      labelForm:{
        name:''
      },
      textList:[],
      textListData: [],
      defaultProps: {
        children: "children",
        label: "label",
        id:'id',
        currentFolder: "",
      },
      currentText:"",
      hasClick: false,
      currentTextIndex:-1,
      currentDataset: "",
      currentLabelIndex: -1,
      currentTextStatus: -1,
      currentLabelResult:"",
      labelList: [],
      currentLabelColor: "",
      dialogFormVisible: false,
    };
  },
  computed:{
    ...mapState(["datasets", "modelType", "user_id"]),

    datasetsInType() {
      return this.datasets.filter((el) => {
        return el.model_type == this.modelType;
      });
    },
  },
  async mounted(){
    await this.getAllDataset(this);
  },
  methods:{
    ...mapMutations(["getAllDataset"]),
    datasetChange(datasetName){
      let selectDataset = this.datasetsInType.find(
          (item) => item.name == datasetName
      );
      this.currentDataset = selectDataset;

      console.log(this.currentDataset);

      this.getTextList();
    },
    startAnn(){

    },
    lastText(){
      let index=this.currentTextIndex
      let resIndex=-1
      if(this.currentTextIndex===0){
        resIndex=this.textList.length-1
      }else {
        resIndex=index-1
      }
      this.currentTextIndex=resIndex
      let label=this.textListData[resIndex].label
      let id = this.textListData[resIndex].id
      this.$refs["tree"].setCurrentKey(id);
      let node={
        label,id
      }
      this.nodeClick(node)
    },
    nextText(){
      let index=this.currentTextIndex
      let resIndex=-1
      if(this.currentTextIndex===this.textList.length-1){
        resIndex=0
      }else {
        resIndex=index+1
      }
      this.currentTextIndex=resIndex
      let label=this.textListData[resIndex].label
      let id = this.textListData[resIndex].id
      this.$refs["tree"].setCurrentKey(id);
      let node={
        label,id
      }
      this.nodeClick(node)
    },
    clearAnn() {
      this.currentLabelResult=''
    },
    async saveAnn() {
      if (this.currentLabelIndex === -1 && this.currentLabelResult==='') {
        this.$message({
          type: "error",
          message: "未选择标签！",
        });
        return;
      }
      var id = this.currentDataset.id
      let index=this.currentTextIndex
      let ann=this.currentLabelResult
      let labelStatus=this.currentTextStatus

      let postData={
        id,index,ann,labelStatus
      }

      let res = await axios.post(`${ip}/entryTextAnn`, postData);
      if (res.data.code === 200) {
        this.$message({
          message: "保存成功！",
          type: "success",
        });
        this.getTextList();
      } else {
        this.$message({
          message: "保存失败！",
          type: "error",
        });
      }

    },
    changeCurrentLabel(label, index) {
      this.currentLabelIndex = index;
      this.currentLabelColor = label.color;
      this.currentLabelResult=label.name
      for (let i = 0; i < this.labelList.length; i++) {
        document.getElementById(`label${i}`).classList.remove("activate");
      }
      document.getElementById(`label${index}`).classList.add("activate");
    },
    deleteLabel(index) {
      if (this.currentLabelIndex === index && index > 0) {
        this.changeCurrentLabel(this.labelList[index - 1], index - 1);
      }
      this.labelList.splice(index, 1);
      if (this.labelList.length === 0) {
        this.currentLabelIndex = -1;
      }
    },
    addLabel() {
      this.dialogFormVisible = true;
    },
    cancelAddLabel() {
      this.labelForm.name = "";
      this.dialogFormVisible = false;
    },
    commitAddLabel() {
      if (
          this.labelList.findIndex((item) => item.name === this.labelForm.name) !== -1
      ) {
        this.dialogFormVisible = false;

        this.$message({
          type: "error",
          message: "标签不可重复",
        });
        this.labelForm.name = "";
        return;
      }
      this.dialogFormVisible = false;

      var randomColor = this.getRandomColor();
      this.labelList.push({ name: this.labelForm.name, color: randomColor });
      this.labelForm.name = "";
    },
    getRandomColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    },
    async getTextList() {
      let res = await axios.get(
          `${ip}/getDatasetTextList?id=${this.currentDataset.id}`
      );
      if (res.data.code === 200) {
        const textList = res.data.data;
        this.textList=textList
        //生成文件夹结构
        var folders = Object.keys(textList);
        this.textListData = [];
        for (var folder of folders) {
          var children = [];
          let textJson=textList[folder]
            let text=textJson["text"]
            let label=textJson["label"]
            var labelStatus = "未标注";
            if (label.length!==0) {
              labelStatus = "已标注";
            }
            // children.push({
            //   label: labelStatus + "-" + text,
            // });

          // this.textListData.push({
          //   label: folder,
          //   children,
          // });
          this.textListData.push({
            id:Number(folder),
            label: labelStatus + "-" + text,
          });
        }
      } else {
        this.$message({
          message: "数据请求失败,请稍后再试！",
          type: "error",
        });
      }
    },
    nodeClick(data) {
      if(data.children){
        this.hasClick=false
        this.defaultProps.currentFolder=data.label
        return;
      }
      this.hasClick=true
      this.currentTextIndex=data.id
      let textLabel=data.label

      let spiltResult=textLabel.split("-")
      let labelStatus=spiltResult[0]
      this.currentText=spiltResult[1]
      this.currentLabelResult=this.textList[this.currentTextIndex]["label"].length ? this.textList[this.currentTextIndex]["label"][0]:''

      if(labelStatus==='已标注'){
        this.currentTextStatus=1
      }else{
        this.currentTextStatus=0
      }
    }
  }
}
</script>

<style scoped>
.onlineAnnotationSentimentCategory {
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
  height: 82vh;
  overflow: auto;
}
.formCon {
  height: 14vh;
}
.annCon {
  height: 67vh;
  width: 100%;
  /* background-color: bisque; */
  display: flex;
  justify-content: space-between;
}
.leftCon {
  width: 15vw;
  height: 67vh;
  flex-direction: column;
  justify-content: space-between;
}
.leftFun {
  width: 15vw;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  border: 2px black solid;
}
.labelCon {
  padding-top: 2%;
  width: 15vw;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  /* background-color: black; */
}
.labelList {
  height: 80%;
  width: 100%;
  border: 2px black solid;
  overflow: auto;
}
.singleLabel {
  height: 15%;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.singleLabel:hover {
  cursor: pointer;
}
.activate {
  background-color: grey;
}
.btnCon {
  height: 15%;
  width: 100%;
  display: flex;
  justify-content: center;
}

.textAnnCon {
  width: 53vw;
  height: 100%;
  display: flex;
  justify-content: center;
  /*background-color: black;*/
}
.textListCon {
  width: 15vw;
  height: 100%;
  overflow: auto;
}

.canvasCon {
  width: 95%;
  height: 90%;
   /*background-color: aquamarine;*/
}

.textCon{
  margin-bottom: 5vh;
}
</style>
