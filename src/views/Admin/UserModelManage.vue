<template>
  <div class="userModelManage">
    <el-table
      :data="allModels"
      style="width: 100%"
      :border="true"
      height="88vh"
    >
      <el-table-column
        prop="name"
        label="名称"
        align="center"
      ></el-table-column>
      <el-table-column
        :filters="allUser"
        :filter-method="filterHandler"
        prop="user__account"
        label="所属用户"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="standModel__type"
        label="模型类别"
        align="center"
        :filters="allModelType"
        :filter-method="filterHandler2"
      >
        <template slot-scope="scope">
          {{ allModelName[scope.row.standModel__type] }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          <div :style="{ color: colors[scope.row.status] }">
            {{ modelStatus[scope.row.status] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="dataSet__name"
        label="对应数据集"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="standModel__name"
        label="对应模型"
        align="center"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            @click="deleteModelById(scope.row)"
            >删除</el-button
          >
          <el-button
            size="mini"
            @click="stopTrainById(scope.row)"
            :disabled="scope.row.status != 1"
            >终止</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import config from "../../assets/configs/config";
let { ip, nginxStandWeightIp } = config;
export default {
  name: "EasyConfigurationUserModelManage",

  data() {
    return {
      colors: ["black", "#FFCA28", "#41B883", "#A0A0C5", "red"],
    };
  },

  mounted() {
    this.getAllModels(this);
    this.getAllModelName();
  },

  methods: {
    ...mapMutations(["getAllModels", "getAllModelName"]),
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    filterHandler2(value, row, column) {
      const property = column["property"];
      let index;
      for (var i = 0; i < this.allModelName.length; i++) {
        if (this.allModelName[i] == value) {
          index = i;
          break;
        }
      }
      return row[property] === index;
    },
    async deleteModelById(model) {
      model_id = model.id;
      const loading = this.$loading({
        lock: true,
        text: "模型删除中......,请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let res = axios.get(`${ip}/deleteModelById?model_id=${model_id}`);
      if (res.data.code == 200) {
        this.$message({
          message: "删除成功！",
          type: "success",
        });
      } else {
        this.$message({
          message: "删除失败！",
          type: "error",
        });
      }
    },
    async stopTrainById(model) {
      model_id = model.id;
      const loading = this.$loading({
        lock: true,
        text: "训练终止中......,请稍等",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let res = axios.get(`${ip}/stopTrainById?model_id=${model_id}`);
      if (res.data.code == 200) {
        this.$message({
          message: "终止成功！",
          type: "success",
        });
      } else {
        this.$message({
          message: "终止失败！",
          type: "error",
        });
      }
    },
  },
  computed: {
    ...mapState(["allModels", "allModelName", "modelStatus"]),
    allUser() {
      const set = new Set(this.allModels.map((item) => item.user__account));
      return [...set].map((item) => {
        return {
          text: item,
          value: item,
        };
      });
    },
    allModelType() {
      return this.allModelName.map((item) => {
        return {
          text: item,
          value: item,
        };
      });
    },
  },
};
</script>

<style scoped>
.userModelManage {
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
</style>
