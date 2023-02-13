<template>
  <div class="onlineAnnotationObjectDetection">
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
      <el-form-item label="coco格式标注区"> </el-form-item>
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
            <el-button type="primary" size="default" @click="lastImg"
              >上一张</el-button
            >
            <el-button type="primary" size="default" @click="nextImg"
              >下一张</el-button
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

      <div class="imgAnnCon">
        <div class="canvasCon">
          <canvas id="imgCanvas"></canvas>
        </div>
      </div>
      <div class="imgListCon">
        <el-tree
          ref="tree"
          node-key="label"
          :data="imgListData"
          :props="defaultProps"
          :highlight-current="true"
          @node-click="nodeClick"
          accordion
        ></el-tree>
      </div>
    </div>

    <el-dialog title="添加新标签" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" autocomplete="off"></el-input>
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
  name: "EasyConfigurationOnlineAnnotation",

  data() {
    let validatePass = (rule, value, callback) => {
      if (/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
        callback(new Error("标签名称不能包含中文！"));
      } else if (value == "") {
        callback(new Error("标签名称不能为空！"));
      }
      callback();
    };
    return {
      form: {
        standDs: "",
      },
      currentDataset: "",

      imgListData: [],
      defaultProps: {
        children: "children",
        label: "label",
        currentFolder: "",
      },
      ctx: {},
      myCanvasCon: {},
      myCanvas: {},
      paintStatus: 0,
      currentPointX: -1,
      currentPointY: -1,
      leftX: -1,
      topY: -1,
      currentImg: {},
      currentRects: [],
      currentWidth: -1,
      currentHeight: -1,
      currentImgStatus: -1,
      dialogFormVisible: false,
      form: {
        name: "",
      },
      currentLabelIndex: -1,
      labelList: [],
      currentLabelColor: "",
      rules: {
        name: [{ validator: validatePass, trigger: "change" }],
      },
      currentImgName: "",
      currentImgIndex: -1,
      hasClick: false,
    };
  },

  async mounted() {
    await this.getAllDataset(this);
    // await this.getStandDataset();

    var canvasCon = document.getElementsByClassName("canvasCon")[0];
    this.myCanvasCon = canvasCon;

    var myCanvas = document.getElementById("imgCanvas");
    this.myCanvas = myCanvas;
    this.ctx = myCanvas.getContext("2d");

    this.loadLocalLabelList();

    this.back();
  },
  methods: {
    ...mapMutations(["getAllDataset"]),
    async datasetChange(datasetName) {
      var selectDataset = this.datasetsInType.find(
        (item) => item.name == datasetName
      );
      this.currentDataset = selectDataset;
      this.getImageList();
    },
    async getImageList() {
      let res = await axios.get(
        `${ip}/getDatasetImageList?id=${this.currentDataset.id}`
      );
      if (res.data.code == 200) {
        var imageList = res.data.data;

        //生成文件夹结构
        var folders = Object.keys(imageList);
        this.imgListData = [];
        for (var folder of folders) {
          var children = [];
          for (var imgName of imageList[folder]) {
            var img = Object.keys(imgName)[0];
            var labelStatus = "未标注";
            if (imgName[img] == 1) {
              labelStatus = "已标注";
            }
            children.push({
              label: img + "-" + labelStatus,
            });
          }

          this.imgListData.push({
            label: folder,
            children,
          });
        }
      } else {
        this.$message({
          message: "数据请求失败,请稍后再试！",
          type: "error",
        });
      }
    },
    nodeClick(node) {
      if (node.children) {
        this.hasClick = false;
        this.currentFolder = node.label;
        return;
      }
      this.hasClick = true;
      var imgName = node.label;

      //获取当前索引
      let index1 = this.imgListData.findIndex(
        (item) => item.label == this.currentFolder
      );
      let index2 = this.imgListData[index1].children.findIndex(
        (item) => item.label == imgName
      );
      this.currentImgIndex = index2;

      var splitResult = imgName.split("-");
      imgName = splitResult[0];
      var labelStatus = splitResult[1];
      if (labelStatus == "已标注") {
        //加载标注和图片到标注区
        this.currentImgStatus = 1;
        var imgUrl = `${nginxDatasetsIp}/user${this.user_id}/${this.currentDataset.name}/images/${this.currentFolder}/${imgName}`;
        var img = new Image();
        img.src = imgUrl;
        img.onload = () => {
          this.currentImgName = imgName;
          this.currentImg = img;
          this.myCanvas.height = img.height;
          this.myCanvas.width = img.width;
          this.ctx.drawImage(img, 0, 0);
        };
      } else {
        var imgUrl = `${nginxDatasetsIp}/user${this.user_id}/${this.currentDataset.name}/images/${this.currentFolder}/${imgName}`;
        var img = new Image();
        img.src = imgUrl;
        img.onload = () => {
          this.currentImgName = imgName;
          this.currentImg = img;
          this.myCanvas.height = img.height;
          this.myCanvas.width = img.width;
          this.ctx.drawImage(img, 0, 0);
        };
        this.currentImgStatus = 0;
      }
    },
    deleteLabel(index) {
      if (this.currentLabelIndex == index && index > 0) {
        this.changeCurrentLabel(this.labelList[index - 1], index - 1);
      }
      this.labelList.splice(index, 1);
      if (this.labelList.length == 0) {
        this.currentLabelIndex = -1;
        this.paintStatus = -1;
      }
    },
    startAnn() {
      if (this.currentImgStatus == 1) {
        this.$message({
          type: "error",
          message: "图片已标注",
        });
        return;
      } else if (this.currentLabelIndex == -1) {
        this.$message({
          type: "error",
          message: "未选择标签！",
        });
        return;
      } else if ((this.paintStatus = 1)) {
        return;
      }
      this.paintStatus = 1;
    },
    draw() {
      this.ctx.clearRect(0, 0, this.currentImg.width, this.currentImg.height);
      // this.ctx.strokeStyle = this.currentLabelColor;
      this.ctx.lineWidth = 2; //进一步加粗线条

      this.ctx.font = "25px Arial";

      this.ctx.drawImage(this.currentImg, 0, 0);

      for (var rect of this.currentRects) {
        this.ctx.strokeStyle = rect.color;
        this.ctx.fillStyle = rect.color;
        this.ctx.strokeRect(rect.leftX, rect.topY, rect.width, rect.height);
        this.ctx.fillText(rect.label, rect.leftX + rect.width, rect.topY);
      }
    },
    back() {
      document.onkeydown = (oEvent) => {
        if (oEvent.keyCode == 90 && oEvent.ctrlKey) {
          if (this.paintStatus == 1) {
            this.currentRects.pop();
            this.draw();
          }
        }
      };
    },
    clearAnn() {
      if (this.paintStatus == 1) {
        this.currentRects = [];
        this.draw();
      }
    },
    addLabel() {
      this.dialogFormVisible = true;
    },
    cancelAddLabel() {
      this.form.name = "";
      this.dialogFormVisible = false;
    },
    commitAddLabel() {
      if (
        this.labelList.findIndex((item) => item.name == this.form.name) != -1
      ) {
        this.dialogFormVisible = false;

        this.$message({
          type: "error",
          message: "标签不可重复",
        });
        this.form.name = "";
        return;
      }
      this.dialogFormVisible = false;

      var randomColor = this.getRandomColor();
      this.labelList.push({ name: this.form.name, color: randomColor });
      this.form.name = "";
    },
    changeCurrentLabel(label, index) {
      this.currentLabelIndex = index;
      this.currentLabelColor = label.color;
      for (var i = 0; i < this.labelList.length; i++) {
        document.getElementById(`label${i}`).classList.remove("activate");
      }
      document.getElementById(`label${index}`).classList.add("activate");
    },
    getRandomColor() {
      return "#" + Math.floor(Math.random() * 16777215).toString(16);
    },
    loadLocalLabelList() {
      var ll = localStorage.getItem(this.currentDataset.name);
      if (ll) {
        this.labelList = JSON.parse(ll);
      } else {
        this.labelList = [];
      }
    },
    async saveAnn() {
      var id = this.currentDataset.id;
      var imgName = this.currentImgName;
      var imgSize = [this.currentImg.width, this.currentImg.height];
      var folder = this.currentFolder;
      var Anns = this.currentRects;

      var postData = {
        id,
        imgName,
        imgSize,
        folder,
        Anns,
      };

      let res = await axios.post(`${ip}/entryAnn`, postData);
      if (res.data.code == 200) {
        this.$message({
          message: "保存成功！",
          type: "success",
        });
        this.getImageList();
      } else {
        this.$message({
          message: "保存失败！",
          type: "error",
        });
      }
    },
    lastImg() {
      if (!this.hasClick) return;
      let index1 = this.imgListData.findIndex(
        (item) => item.label == this.currentFolder
      );
      var index = -1;
      if (this.currentImgIndex == 0)
        index = this.imgListData[index1].children.length - 1;
      else index = this.currentImgIndex - 1;
      this.currentImgIndex = index;
      let label = this.imgListData[index1].children[index].label;
      this.$refs["tree"].setCurrentKey(label);
      let node = {
        label,
      };
      this.nodeClick(node);
    },
    nextImg() {
      if (!this.hasClick) return;
      let index1 = this.imgListData.findIndex(
        (item) => item.label == this.currentFolder
      );
      var index = -1;
      if (this.currentImgIndex == (this.imgListData[index1].children.length - 1))
        index = 0;
      else index = this.currentImgIndex + 1;
      this.currentImgIndex = index;
      let label = this.imgListData[index1].children[index].label;
      this.$refs["tree"].setCurrentKey(label);
      let node = {
        label,
      };
      this.nodeClick(node);
    },
  },
  computed: {
    ...mapState(["datasets", "modelType", "user_id"]),
    datasetsInType() {
      return this.datasets.filter((el) => {
        return el.model_type == this.modelType;
      });
    },
  },
  watch: {
    paintStatus(status) {
      switch (status) {
        case 0:
          break;
        case 1:
          this.draw();
          this.myCanvas.onclick = (evt) => {
            var x = evt.clientX;
            var y = evt.clientY;
            var rect = this.myCanvas.getBoundingClientRect();
            x -= rect.left;
            y -= rect.top;
            this.currentPointX = x;
            this.currentPointY = y;
            this.paintStatus = 2;
          };
          break;
        case 2:
          this.myCanvas.onmousemove = (evt) => {
            this.draw();
            this.ctx.strokeStyle = this.currentLabelColor;

            var x = evt.clientX;
            var y = evt.clientY;
            var rect = this.myCanvas.getBoundingClientRect();
            x -= rect.left;
            y -= rect.top;
            var width = Math.abs(this.currentPointX - x);
            var height = Math.abs(this.currentPointY - y);

            //得到左上角坐标
            var leftX = x < this.currentPointX ? x : this.currentPointX;
            var topY = y < this.currentPointY ? y : this.currentPointY;
            this.leftX = leftX;
            this.topY = topY;
            this.currentWidth = width;
            this.currentHeight = height;
            this.ctx.strokeRect(leftX, topY, width, height);
          };
          this.myCanvas.onclick = (evt) => {
            if (this.leftX == -1) return;
            this.currentRects.push({
              leftX: this.leftX,
              topY: this.topY,
              width: this.currentWidth,
              height: this.currentHeight,
              color: this.currentLabelColor,
              label: this.labelList[this.currentLabelIndex].name,
              index: this.currentLabelIndex,
            });
            this.myCanvas.onmousemove = {};
            this.paintStatus = 1;
          };
          break;
        case -1:
          this.myCanvas.onclick = {};
          this.myCanvas.onmousemove = {};
          break;
      }
    },
    labelList() {
      localStorage.removeItem(this.currentDataset.name);
      localStorage.setItem(
        this.currentDataset.name,
        JSON.stringify(this.labelList)
      );
    },
    currentDataset: {
      //监视对象
      deep: true,
      handler() {
        this.loadLocalLabelList();
      },
    },
  },
};
</script>

<style scoped>
.onlineAnnotationObjectDetection {
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
.imgAnnCon {
  width: 53vw;
  height: 100%;
  display: flex;
  justify-content: center;
  /* background-color: black; */
}
.imgListCon {
  width: 15vw;
  height: 100%;
  overflow: auto;
}
.title {
  font-weight: bolder;
  font-size: 1vw;
}
.canvasCon {
  width: 95%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: aquamarine; */
}
</style>
