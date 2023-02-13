<template>
  <div class="MyModelList">
    <el-row class="itemTab">
      <el-col :span="3">
        <el-button
          type="primary"
          @click="$router.push('/user/Model/CreateModel')"
          >创建模型</el-button
        >
      </el-col>
      <el-col :span="4">
        <el-input v-model="ModelName" placeholder="请输入模型名称">
          <i
            slot="suffix"
            class="el-input__icon el-icon-search"
            @click="searchModel"
            style="cursor: pointer"
          ></i>
        </el-input>
      </el-col>
    </el-row>

    <el-table
      :data="
        modelsInType.filter(
          (data) =>
            !ModelName ||
            data.name.toLowerCase().includes(ModelName.toLowerCase())
        )
      "
      border
      style="width: 100%"
      @row-click="changeCurrentModel"
    >
      <template slot="empty">
        <div class="table_empty">
          <div class="empty_tips">
            暂无可用模型，
            <el-button
              @click="$router.push('/user/Model/CreateModel')"
              type="text"
              size="small"
              style="font-size: 14px"
              >创建模型</el-button
            >
          </div>
        </div>
      </template>
      <el-table-column
        prop="name"
        label="模型名称"
        min-width="200"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="dataSet__name"
        label="关联训练集(点击名称查看数据集信息)"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          <div style="display: flex; justify-content: center">
            <div
              v-if="scope.row.dataSet__name"
              @click="seeDatasetInfo(scope.row)"
              class="datasetName"
            >
              {{ scope.row.dataSet__name }}
            </div>
            <el-button
              type="primary"
              size="mini"
              v-else
              @click="connectDatasetShow"
            >
              去关联
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="model_type_name"
        label="模型类型"
        min-width="200"
        align="center"
      >
      </el-table-column>
      <el-table-column label="LOSS变化" min-width="200" align="center">
        <template slot-scope="scope">
          <div
            :ref="'chart_' + scope.row.id"
            v-if="scope.row.status != 0"
            class="chartContainer"
            :id="'chart_' + scope.row.id"
          ></div>
          <div v-else>暂未开始训练</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="模型状态"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            {{ modelStatus[scope.row.status] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="standModel__name"
        label="标准模型"
        min-width="200"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="limit" label="权限" min-width="200" align="center">
        <template slot-scope="scope">
          {{ scope.row.limit == "0" ? "公有" : "私有" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="200" align="center">
        <template slot-scope="scope">
          <el-button
            @click="stopTrain"
            type="text"
            size="small"
            v-if="scope.row.status == 1"
            style="color: red"
            >终止</el-button
          >
          <el-button
            @click="trainModel"
            type="text"
            size="small"
            v-else-if="scope.row.status == 0"
            >训练</el-button
          >
          <el-button
            type="text"
            size="small"
            v-else
            style="color: blue"
            @click="trainModel"
            >重新训练</el-button
          >
          <el-button
            @click="cancelJob()"
            type="text"
            size="small"
            style="color: red"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 选择数据集 -->
    <el-dialog title="选择数据集" :visible.sync="centerDialogVisible">
      <div class="addDatasetDialog">
        <el-radio-group
          v-model="dataLimit"
          class="centerSet"
          @input="selectDataset = ''"
        >
          <el-radio :label="0">我的数据集</el-radio>
          <el-radio :label="1">公开数据集</el-radio>
        </el-radio-group>
        <br />
        <el-select
          placeholder="请选择训练数据"
          class="centerSet"
          v-model="selectDataset"
        >
          <el-option
            v-for="item in radioDataset"
            :key="item.id"
            :label="
              dataLimit == 0 ? item.name : item.name + '--创建人id:' + item.user
            "
            :value="item.id"
            :disabled="!item.size"
          >
          </el-option>
        </el-select>
      </div>

      <!-- 数据集信息 -->
      <div class="datasetInfoCon" v-show="selectDataset">
        <div>
          数据集大小：{{
            selectedDataset.length > 0
              ? (selectedDataset[0].size / 1024).toFixed(2) + "/MB"
              : "该数据集还未导入数据！"
          }}
        </div>
        <div>
          样本总数：{{
            selectedDataset.length > 0
              ? selectedDataset[0].total_num
              : "该数据集还未导入数据！"
          }}
        </div>
        <div>
          标注总数：{{
            selectedDataset.length > 0
              ? selectedDataset[0].label_num
              : "该数据集还未导入数据！"
          }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelConnect">取 消</el-button>
        <el-button type="primary" @click="submitConnectDataset"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 填写训练参数 -->
    <el-dialog title="填写训练参数" :visible.sync="paramsShow">
      <el-form :model="paramsForm">
        <el-form-item
          :label="param.alias"
          v-for="(param, i) in currentParams"
          :key="i"
        >
          <el-input
            v-model="paramsForm[param.name]"
            autocomplete="off"
            :placeholder="'填写格式:' + param.default"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="exitTrain">取 消</el-button>
        <el-button type="primary" @click="submitTrain">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 数据集信息与重新关联对话框 -->
    <el-dialog title="数据集信息" :visible.sync="datasetInfoShow">
      <!-- 数据集信息 -->
      <div class="datasetInfoCon">
        <div>
          数据集大小：{{
            clickDataset.length > 0
              ? (clickDataset[0].size / 1024).toFixed(2) + "/MB"
              : ""
          }}
        </div>
        <div>
          样本总数：{{
            clickDataset.length > 0 ? clickDataset[0].total_num : ""
          }}
        </div>
        <div>
          标注总数：{{
            clickDataset.length > 0 ? clickDataset[0].label_num : ""
          }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="datasetInfoShow = false">关闭对话框</el-button>
        <el-button type="primary" @click="reConnect">重新关联</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../assets/configs/config";
import { mapState, mapMutations } from "vuex";
import * as echarts from "echarts";

let { ip } = config;
export default {
  name: "MyModel",
  data() {
    return {
      ModelName: "",
      modelStatus: ["未开始训练", "训练中", "训练完成", "训练终止", "训练出错"],
      currentModel: {},
      dataLimit: 0,
      centerDialogVisible: false,
      selectDataset: "",
      paramsShow: false,
      paramsForm: {},
      col: "",
      currentParams: {},
      datasetInfoShow: false,
      clickDatasetId: "",
      initCharts: false,
      interId: 0,
      charts: {},
    };
  },
  created() {
    // this.getLossData();
  },
  beforeDestroy() {
    clearInterval(this.interId);
  },
  async mounted() {
    this.getAllModel(this);
    this.getConnectDataset();
    this.getLossData();

    this.interId = setInterval(() => {
      this.getLossData();
    }, 1000);
  },
  methods: {
    ...mapMutations([
      "getAllModel",
      "trainAModel",
      "stopATrain",
      "getConnectDataset",
      "connectToDataset",
      "getLossData",
      "deleteModel",
    ]),
    searchModel() {},
    changeCurrentModel(row) {
      this.currentModel = row;
      switch (this.col) {
        case "train":
          /* 判断是否关联数据集 */
          if (!this.currentModel.dataSet__name) {
            this.$message({
              message: "请先为模型关联数据集！",
              type: "warning",
            });
            return;
          }

          this.paramsForm = {};
          this.currentParams = JSON.parse(this.currentModel.standModel__params);
          this.paramsShow = true;
          break;
        case "stop":
          this.$confirm("确定停止?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.stopATrain({ model_id: this.currentModel.id, cp: this });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
          break;
        case "connect":
          break;
        case "clickName":
          this.clickDatasetId = this.currentModel.dataSet__id;
          break;
        case "delete":
          this.$confirm("此操作将永久删除该模型, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.deleteModel({ model_id: this.currentModel.id, cp: this });
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
    trainModel() {
      this.col = "train";
    },
    stopTrain() {
      this.col = "stop";
    },
    connectDatasetShow() {
      this.col = "connect";
      this.centerDialogVisible = true;
    },
    submitTrain() {
      let submitForm = {
        model_id: this.currentModel.id,
        params: this.paramsForm,
      };
      this.trainAModel({ form: submitForm, cp: this });
    },
    exitTrain() {
      this.paramsForm = {};
      this.paramsShow = false;
    },
    cancelConnect() {
      this.selectDataset = "";
      this.centerDialogVisible = false;
    },
    submitConnectDataset() {
      this.connectToDataset({
        model_id: this.currentModel.id,
        dataset_id: this.selectDataset,
        cp: this,
      });
    },
    seeDatasetInfo() {
      this.datasetInfoShow = true;
      this.col = "clickName";
    },
    reConnect() {
      this.datasetInfoShow = false;
      this.centerDialogVisible = true;
    },
    cancelJob() {
      this.col = "delete";
    },
  },
  computed: {
    ...mapState([
      "models",
      "modelType",
      "connectDataset",
      "user_id",
      "lossData",
    ]),
    modelsInType() {
      return this.models.filter((value) => {
        return value.standModel__type == this.modelType;
      });
    },
    connectDataset_mine() {
      return this.connectDataset.filter((cd) => cd.user == this.user_id);
    },
    connectDataset_others() {
      return this.connectDataset.filter((cd) => cd.user != this.user_id);
    },
    radioDataset() {
      if (this.dataLimit == 0) {
        return this.connectDataset_mine;
      } else {
        return this.connectDataset_others;
      }
    },
    selectedDataset() {
      var data = this.radioDataset.filter(
        (item) => item.id == this.selectDataset
      );
      return data;
    },
    clickDataset() {
      return this.connectDataset.filter((cd) => cd.id == this.clickDatasetId);
    },
    chartsData() {
      var data = {};
      for (var id in this.lossData) {
        var option = {
          xAxis: {
            type: "category",
            data: [],
          },
          yAxis: {
            type: "value",
            axisPointer: {
              show: true,
            },
          },
          series: [
            {
              data: [],
              type: "line",
            },
          ],
          tooltip: {
            show: true,
          },
        };
        for (let i = 0; i < this.lossData[id].length; i++) {
          option.xAxis.data.push(i + 1);
          option.series[0].data.push(this.lossData[id][i].toFixed(3));
        }
        data[id] = option;
      }
      return data;
    },
  },
  watch: {
    chartsData(newValue, oldValue) {
      for (var id in newValue) {
        var dom = document.getElementById(`chart_${id}`);

        let sta = 0;
        if (!dom) return;
        if (this.charts[id]) {
          //判断loss是否变化
          if (
            this.charts[id].series[0].data.length ==
            newValue[id].series[0].data.length
          ) {
            sta = 1;
          }
        }
        if (sta == 0) {
          var myChart = echarts.init(dom);
          this.charts[id] = newValue[id];
          myChart.setOption(newValue[id]);
        }
      }
    },
  },
};
</script>

<style scoped>
.MyModelList {
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
.itemTab {
  margin-bottom: 1rem;
}
.addDatasetDialog .centerSet {
  display: flex;
  justify-content: center;
  align-items: center;
}
.datasetInfoCon {
  width: 100%;
}
.datasetInfoCon div {
  height: 2vh;
  line-height: 2vh;
  font-weight: bolder;
}
.datasetName:hover {
  cursor: pointer;
  text-decoration: underline;
}
.chartContainer {
  width: 10vw;
  height: 20vh;
  /* background-color: bisque; */
}
</style>
