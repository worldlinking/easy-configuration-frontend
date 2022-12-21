<template>
  <div class="manageModel">
    <el-table
      :key="num"
      :data="myStandModel"
      style="width: 100%"
      @row-click="tableClick"
      :border="true"
      height="88vh"
    >
      <el-table-column
        prop="name"
        label="名称"
        align="center"
      ></el-table-column>
      <el-table-column prop="type" label="类型" align="center">
        <template slot-scope="scope">
          <div>
            <div v-if="statusArr[scope.row.id] == 0">
              {{ allModelName[scope.row.type] }}
            </div>
            <div v-else>
              <el-select placeholder="请选择模型类型" v-model="currentType">
                <el-option
                  v-for="(modelName, i) in allModelName"
                  :key="i"
                  :label="modelName"
                  :value="i"
                ></el-option>
              </el-select>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="info" label="信息" align="center">
        <template slot-scope="scope">
          <div>
            <div v-if="statusArr[scope.row.id] == 0">
              {{ scope.row.info }}
            </div>
            <div v-else>
              <el-input
                v-model="currentInfo"
                placeholder=""
                size="normal"
              ></el-input>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="参数" align="center">
        <template slot-scope="scope">
          <div class="seeBtn">
            <el-button
              type="primary"
              size="default"
              @click="seeParamsClick(scope.row)"
              >查看</el-button
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="standDataset__data_type"
        label="对应数据集格式"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            <div v-if="statusArr[scope.row.id] == 0">
              {{ scope.row.standDataset__data_type }}
            </div>
            <div v-else>
              <el-select placeholder="请选择模型类型" v-model="currentSd">
                <el-option
                  v-for="(sd, i) in allStandDataSet"
                  :key="sd.id"
                  :label="sd.data_type"
                  :value="sd.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <div class="btnsCon">
            <el-button
              type="primary"
              size="mini"
              @click="updateClick(scope.row)"
              >更新</el-button
            >
            <el-button type="primary" size="mini" @click="saveClick(scope.row)"
              >保存</el-button
            >
            <el-button type="" size="mini" @click="cancelClick(scope.row, true)"
              >取消</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="标准模型参数" :visible.sync="dialogTableVisible">
      <el-table
        :data="
          currentStandModel.params ? JSON.parse(currentStandModel.params) : []
        "
      >
        <el-table-column
          property="name"
          label="参数名"
          width="150"
        ></el-table-column>
        <el-table-column
          property="alias"
          label="中文名"
          width="150"
        ></el-table-column>
        <el-table-column
          property="default"
          label="默认值"
          width="150"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import config from "../../assets/configs/config";
let { ip, nginxStandWeightIp } = config;

export default {
  name: "EasyConfigurationManageModel",

  data() {
    return {
      infoInputObj: {},
      typeInputObj: {},
      currentInfo: "",
      currentType: "",
      currentSd: "",
      statusArr: {},
      currentStandModel: {},
      num: 0,
      dialogTableVisible: false,
      updating: false,
    };
  },

  mounted() {
    this.getStandModelById({ cp: this });
    this.getAllModelName();
    this.getAllStandDataSet();
  },

  methods: {
    ...mapMutations([
      "getStandModelById",
      "getAllModelName",
      "getAllStandDataSet",
    ]),
    tableClick() {},
    updateClick(sm) {
      if (sm.id == this.currentStandModel.id) return;
      this.currentStandModel = sm;
      this.updating = true;
      //打开更新
      this.currentInfo = sm.info;
      this.currentType = sm.type;
      this.currentSd = sm.standDataset_id;
      this.statusArr[sm.id] = 1;
      this.num++;
    },
    cancelClick(sm, needMessage) {
      if (!this.updating) return;
      if (sm.id != this.currentStandModel.id) return;
      this.statusArr[sm.id] = 0;
      this.num++;
      this.currentStandModel = {};
      this.currentInfo = "";
      this.currentType = "";
      this.currentSd = "";
      this.updating = false;
      if (needMessage) {
        this.$message({
          message: "取消更新",
        });
      }
    },
    seeParamsClick(sm) {
      this.cancelClick(this.currentStandModel, false);
      this.currentStandModel = sm;
      this.dialogTableVisible = true;
    },
    saveClick(sm) {
      if (!this.updating) return;
      if (sm.id != this.currentStandModel.id) return;
      this.updateStandModel();
    },
    async updateStandModel() {
      // console.log(this.currentStandModel.id);
      
      let data = {
        id: this.currentStandModel.id,
        info: this.currentInfo,
        type: this.currentType,
        standDataset_id: this.currentSd,
      };
      
      let res = await axios.post(`${ip}/updateStandModel`, data);
      if (res.data.code == 200) {
        this.$message({
          message: "更新成功！",
          type: "success",
        });
        this.getStandModelById({cp:this});
      } else {
        this.$message({
          message: "更新失败！",
          type: "error",
        });
      }
    },
  },

  computed: {
    ...mapState(["myStandModel", "allModelName", "allStandDataSet"]),
    // infoInputObj() {
    //   var obj = {};
    //   for (var sm of this.myStandModel) {
    //     obj[sm.id] = sm.info;
    //   }
    //   return obj;
    // },
    // typeInputObj() {
    //   var obj = {};
    //   for (var sm of this.myStandModel) {
    //     obj[sm.id] = sm.type;
    //   }
    //   return obj;
    // },
  },
  watch: {
    myStandModel(newValue) {
      for (var sm of newValue) {
        this.statusArr[sm.id.toString()] = 0;
      }
    },
  },
};
</script>

<style>
.manageModel {
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
.seeBtn {
  width: 100%;
  display: flex;
  justify-content: center;
}
.btnsCon {
  display: flex;
  justify-content: center;
}
</style>
