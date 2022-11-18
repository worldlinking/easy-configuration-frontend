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
      <el-table :data="datasetsInType" stripe style="width: 100%" @row-click="tableClick"> 
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column prop="model_type_name" label="模型类型">
        </el-table-column>
        <el-table-column prop="type" label="数据集类型">
          <template slot-scope="scope">
            {{ datasetType[scope.row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="total_num" label="样本总数">
          <template slot-scope="scope">
            {{ scope.row.total_num ? scope.row.total_num : "暂无数据" }}
          </template>
        </el-table-column>
        <el-table-column prop="label_num" label="标签总数">
          <template slot-scope="scope">
            {{ scope.row.total_num ? scope.row.label_num : "暂无数据" }}
          </template>
        </el-table-column>
        <el-table-column prop="size" label="大小">
          <template slot-scope="scope">
            {{
              scope.row.size
                ? parseInt(scope.row.size / 1024) + "(MB)"
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
                  <el-dropdown-item command="url">url导入</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <div>查看</div>

              <div>删除</div>
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
              :key="item"
              :label="item"
              :value="index"
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
      datasetType: [
        "训练集",
        "测试集",
        "验证集",
        "训练集和验证集",
        "训练集,验证集和测试集",
      ],
      limits: ["公共", "私有"],
      dialogFormVisible: false,
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
      currentDataset:{}
    };
  },

  created() {},
  async mounted() {
    await this.getAllDataset(this);
    await this.getStandDataset();
  },

  methods: {
    ...mapMutations(["getAllDataset", "getStandDataset", "createADataset","importAtData"]),
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
    importData(index) {
      switch (index) {
        case "zip":
          //打开上传文件对话框
          this.$refs.upload.$children[0].handleClick();
          break;
      }
    },
    beforeUpload(file){
        if (file.type == "application/x-zip-compressed") {//zip文件
            this.importAtData({dataset_id:this.currentDataset.id,dataset:file,cp:this});
        }
        return false;
    },
    tableClick(row){
        this.currentDataset = row;
    }
  },
  computed: {
    ...mapState([
      "datasets",
      "type",
      "modelIndex",
      "modelName",
      "standDataset",
    ]),
    datasetsInType() {
      return this.datasets.filter((value) => {
        return value.type == this.type;
      });
    },
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

.doBtnCon div:nth-child(3) {
  color: red;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409eff;
}
</style>
