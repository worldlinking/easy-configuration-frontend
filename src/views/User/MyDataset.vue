<template>
  <div class="myDataset">
    <!-- 创建数据集按钮容器 -->
    <div class="datasetHeader">
      <div class="createBtnCon">
        <el-button
          type="primary"
          size="default"
          style="backgroundcolor: rgb(2, 111, 228); border: 0; border-radius: 0"
          @click="makeFormShow"
          >创建数据集</el-button
        >
      </div>
    </div>
    <!-- 表格容器 -->
    <div class="datasetTableCon">
      <el-table
        :data="datasetsInType"
        style="width: 100%"
        @row-click="tableClick"
        :border="true"
      >
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="model_type_name" label="模型类型">
        </el-table-column>
        <el-table-column prop="type" label="数据集类型">
          <template slot-scope="scope">
            {{ datasetTypeName[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="total_num" label="样本总数">
          <template slot-scope="scope">
            {{ scope.row.total_num ? scope.row.total_num : "暂无数据" }}
          </template>
        </el-table-column>
        <el-table-column prop="label_num" label="标签总数">
          <template slot-scope="scope">
            {{ scope.row.label_num ? scope.row.label_num : "暂无数据" }}
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小">
          <template slot-scope="scope">
            {{
              scope.row.size
                ? parseFloat(scope.row.size / 1024).toFixed(3) + "(MB)"
                : "暂无数据"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="standDataset__data_type" label="标准格式">
        </el-table-column>
        <el-table-column prop="limit" label="权限">
          <template slot-scope="scope">
            {{ scope.row.limit == 0 ? "公共" : "私有" }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="doBtnCon" style="display: flex">
              <el-dropdown trigger="click" @command="importData">
                <span class="el-dropdown-link">
                  导入<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="zip">zip导入</el-dropdown-item>
                  <el-dropdown-item command="spiderJob">爬虫资源导入</el-dropdown-item>
                  <el-dropdown-item command="url">从接口导入</el-dropdown-item>
                  <el-dropdown-item command="txt"  v-if="type != 0">txt导入</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <div  @click="runDuplicateRemove" v-if="type != 0">去重</div>

              <div @click="seeDataset">查看</div>

              <div @click="deleteDataset">删除</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 创建数据集表单 -->
    <el-dialog
      :title="'创建新的*' + modelName + '*数据集'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" :rules="rules" ref="datasetForm">
        <el-form-item label="数据集名称" prop="name">
          <el-input
            v-model="form.name"
            autocomplete="off"
            style="width: 80%"
          ></el-input>
        </el-form-item>

        <el-form-item label="数据集类型">
          <el-select
            v-model="form.type"
            placeholder="请选择"
            style="width: 80%"
          >
            <el-option
              v-for="(item, index) in datasetType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="数据集格式" prop="standDataset_id">
          <el-select
            v-model="form.standDataset_id"
            placeholder="请选择"
            style="width: 80%"
          >
            <el-option
              v-for="(item, index) in standDataset"
              :key="item.id"
              :label="item.data_type"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="数据集权限">
          <el-select
            v-model="form.limit"
            placeholder="请选择"
            style="width: 80%"
          >
            <el-option
              v-for="(item, index) in limits"
              :key="item"
              :label="item"
              :value="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelCreateForm">取 消</el-button>
        <el-button type="primary" @click="createDataset">确 定</el-button>
      </div>
    </el-dialog>

    <el-upload
      ref="upload"
      v-show="false"
      :show-file-list="false"
      action=""
      :before-upload="beforeUpload"
    >
    </el-upload>

    <!-- 选择爬虫任务表单   -->
    <el-dialog
        title="导入已完成的爬虫任务数据"
        :visible.sync="dialogSpiderFormVisible"
        width="30%"
        center
        class="spiderFormDialog">
      <div class="formItem">
        <span style="margin:0.5rem">选择爬虫任务</span>
        <el-select v-model="spiderJob"  placeholder="请选择爬虫任务" size="small">
          <el-option
              v-for="(item, index) in finishedSpiderJob"
              :key="index"
              :label="item.taskName"
              :value="item.id"
          ></el-option>
        </el-select>
      </div>
<!--      <div class="formItem">-->
<!--        <span style="margin:0.5rem ">是否数据去重</span>-->
<!--        <el-radio-group v-model="duplicateRemove">-->
<!--          <el-radio :label="0">中文去重</el-radio>-->
<!--          <el-radio :label="1">英文去重</el-radio>-->
<!--          <el-radio :label="2">不去重</el-radio>-->
<!--        </el-radio-group>-->
<!--      </div>-->
      <span slot="footer" class="dialog-footer">
            <el-button @click="dialogSpiderFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="uploadSpiderJob">确 定</el-button>
          </span>
    </el-dialog>

<!--    &lt;!&ndash; txt文件去重对话框   &ndash;&gt;-->
<!--    <el-dialog-->
<!--        title="选择去重操作"-->
<!--        :visible.sync="dialogTextFormVisible"-->
<!--        width="30%"-->
<!--        center-->
<!--        class="textFormDialog">-->
<!--      <div class="formItem">-->
<!--        <el-radio-group v-model="duplicateRemove">-->
<!--          <el-radio :label="0">中文去重</el-radio>-->
<!--          <el-radio :label="1">英文去重</el-radio>-->
<!--          <el-radio :label="2">不去重</el-radio>-->
<!--        </el-radio-group>-->
<!--      </div>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--            <el-button @click="uploadText(0)">取 消</el-button>-->
<!--            <el-button type="primary" @click="uploadText(1)">确 定</el-button>-->
<!--          </span>-->
<!--    </el-dialog>-->


    <el-dialog title="从url导入数据" :visible.sync="urlImportShow">
      <el-form>
        <el-form-item label="填写url">
          <el-input v-model="url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="格式">
          <el-select
            v-model="format"
            placeholder="请选择数据集格式"
            style="width: 100%"
          >
            <el-option
              label="zip"
              value="zip"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="urlImportShow = false">取 消</el-button>
        <el-button type="primary" @click="urlImport">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";
import config from "../../assets/configs/config";
let { ip, nginxIp } = config;
export default {
  name: "EasyConfigurationMyDataset",

  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入数据集名称"));
      }
      for (var i = 0; i < this.datasets.length; i++) {
        if (value == this.datasets[i].name) {
          callback(new Error("数据集名称重复！"));
          break;
        }
      }
      callback();
    };
    return {
      dataset: [],
      IoTModelName: [],
      socialModelName: [],
      datasetTypeName: [
        "训练集",
        "测试集",
        "验证集",
        "训练集和验证集",
        "训练集,验证集和测试集",
      ],
      urlImportShow: false,
      datasetType: [
        {
          label: "训练集",
          value: 0,
        },
        {
          label: "测试集",
          value: 1,
        },
        {
          label: "完整数据集",
          value: 4,
        },
      ],
      limits: ["公共", "私有"],
      dialogFormVisible: false,
      dialogTextFormVisible: false,
      textFile: null,
      form: {
        name: "",
        type: 0,
        limit: 0,
        standDataset_id: "",
      },
      rules: {
        name: [{ validator: validatePass, trigger: "change" }],
        standDataset_id: [
          {
            required: true,
            message: "请选择数据集对应的标准数据集格式",
            trigger: "blur",
          },
        ],
      },
      currentDataset:{},
      dialogSpiderFormVisible:false,
      duplicateRemove:'',
      spiderJob:null,
      url: "",
      format: "",
    };
  },

  created() {},
  async mounted() {
    await this.getAllDataset(this);
    await this.getStandDataset();
  },

  methods: {
    ...mapMutations(["deleteADataset","getAllDataset", "getStandDataset", "createADataset","importAtData",'getAllSpiderJobs','duplicate',"importFormUrl"]),

    makeFormShow() {
      this.dialogFormVisible = true;
    },
    cancelCreateForm() {
      this.form = {
        name: "",
        type: 0,
        limit: 0,
        standDataset_id: "",
      };
      this.dialogFormVisible = false;
    },

    async createDataset() {
      this.$refs["datasetForm"].validate((valid) => {
        if (valid) {
          //表单合法则提交
          this.createADataset({ form: this.form, cp: this });
        } else {
          return false;
        }
      });
    },
    async importData(index) {
      switch (index) {
        case "zip":
          //打开上传文件对话框
          this.$refs.upload.$children[0].handleClick();
          break;
        case "spiderJob":
          this.dialogSpiderFormVisible=true
          if(!this.spiderJobs.length){
            await this.getAllSpiderJobs(this)
          }
          break;
        case "url":
          this.urlImportShow = true;
          break;
        case 'txt':
          this.$refs.upload.$children[0].handleClick();
          break;
      }
    },
    beforeUpload(file) {
      if (file.type == "application/x-zip-compressed") {
        //zip文件
        this.importAtData({
          dataset_id: this.currentDataset.id,
          dataset: file,
          cp: this,
        });
      }
      else if(file.type == "text/plain" ) {
        this.textFile=file
        this.importAtData({
          dataset_id: this.currentDataset.id,
          dataset: this.textFile,
          cp: this,
          type:'text',
          deleteDuplicate:'2'
        });
      }
      return false;
    },
    tableClick(row) {
      this.currentDataset = row;
    },
    deleteDataset() {
      //删除数据集
      this.$confirm("此操作将永久删除数据集文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteADataset({ dataset_id: this.currentDataset.id, cp: this });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    uploadSpiderJob(){
      this.importAtData({dataset_id:this.currentDataset.id,dataset:this.spiderJob,cp:this,type:'spiderJob',deleteDuplicate:'2'});
      this.dialogSpiderFormVisible = false
    },
    uploadText(value){
      if(value){
        this.importAtData({
          dataset_id: this.currentDataset.id,
          dataset: this.textFile,
          cp: this,
          type:'text',
          deleteDuplicate:'2'
        });
      }
      // this.dialogTextFormVisible=false
    },
    //进行去重
    runDuplicateRemove(){
      console.log(this.currentDataset)
      this.duplicate({
        dataset_id: this.currentDataset.id,
        cp: this,
      })
    },
    urlImport() {
      this.importFormUrl({ cp: this, url: this.url,format:this.format,dataset_id:this.currentDataset.id });
    },
    closeImportShow(){
      this.urlImportShow = false;
      this.url = '';
      this.format = '';
    },
    seeDataset(){
      console.log(this.type);
    }
  },
  computed: {
    ...mapState([
      "datasets",
      "type",
      "modelIndex",
      "modelName",
      "standDataset",
      "modelType",
      "spiderJobs",
    ]),
    datasetsInType() {
      return this.datasets.filter((value) => {
        return value.model_type == this.modelType;
      });
    },
    finishedSpiderJob(){
      return this.spiderJobs.filter((value)=>{
        return value.status = 'finished'
      })
    }
  },
};
</script>

<style scoped>
.datasetHeader {
  height: 12vh;
  width: 100%;
  position: relative;
}
.datasetTableCon {
  height: 80vh;
  margin-left: 1vw;
}
.createBtnCon {
  position: absolute;
  left: 1vw;
  height: 12vh;
  display: flex;
  align-items: center;
}
.doBtnCon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #409eff;
}
.doBtnCon div:nth-child(2):hover {
  cursor: pointer;
  text-decoration-line: underline;
}
.doBtnCon div:nth-child(3):hover {
  cursor: pointer;
  text-decoration-line: underline;
}

.doBtnCon div:nth-child(4) {
  color: red;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}

.spiderFormDialog .formItem{
  margin-bottom: 1rem;
}

.textFormDialog .formItem{
  margin-bottom: 1rem;
}
</style>
