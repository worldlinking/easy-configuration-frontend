<template>
  <div class="publicDataset">
    <el-table :data="publicDatasets" style="width: 100%" :border="true">
      <el-table-column prop="name" label="数据集名称" align="center">
      </el-table-column>
      <el-table-column prop="user__account" label="贡献人" align="center">
      </el-table-column>
      <el-table-column
        prop="standDataset__data_type"
        label="数据集格式"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="type" label="数据集类型" align="center">
        <template slot-scope="scope">
          {{ dataset_type_name[scope.row.type + ""] }}
        </template>
      </el-table-column>
      <el-table-column prop="size" label="数据集大小" align="center">
        <template slot-scope="scope">
          {{ (scope.row.size / 1024).toFixed(2) + "/kb" }}
        </template>
      </el-table-column>
      <el-table-column prop="size" label="操作" align="center">
        <template slot-scope="scope">
          <div class="btnCon">
            <el-button
              type="primary"
              size="mini"
              @click="importDataset(scope.row)"
              >导入</el-button
            >
            <el-button
              type="primary"
              size="mini"
              @click="seeDatasetDetail(scope.row)"
              >浏览</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="选择要导入的数据集" :visible.sync="dialogShow">
      <el-form :rules="rules" ref="datasetForm" :model="form">
        <el-form-item label="数据集名称" prop="name">
          <el-select
            v-model="form.name"
            placeholder="请选择"
            style="width: 80%"
          >
            <el-option
              :key="dataset.name"
              :label="dataset.name"
              :value="dataset.id"
              v-for="(dataset, i) in datasetsInType"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmLink">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import config from "../../assets/configs/config";
let { ip, nginxStandWeightIp } = config;
export default {
  name: "EasyConfigurationPublicDataset",

  data() {
    return {
      dialogShow: false,
      currentPublicDataset: null,
      form: {
        name: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请选择数据集对应的标准数据集格式",
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {
    this.getPublicDatasets(this);
    this.getAllDataset(this);
  },

  methods: {
    ...mapMutations(["getPublicDatasets", "getAllModelName", "getAllDataset"]),
    importDataset(dataset) {
      //导入数据集
      this.dialogShow = true;
      this.currentPublicDataset = dataset;
    },
    confirmLink() {
      this.$refs["datasetForm"].validate(async (valid) => {
        if (valid) {
          //表单合法则提交
          let res = await axios.get(
            `${ip}/linkPublicDataset?link_id=${this.currentPublicDataset.id}&dataset_id=${this.form.name}`
          );
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "导入成功",
            });
            this.dialogShow = false;
          } else {
            this.$message({
              type: "error",
              message: "导入失败！请稍后再试",
            });
          }
        } else {
          return false;
        }
      });
    },
    seeDatasetDetail(dataset) {
      //物联感知
      if (this.modelIndex == 0) {
        this.$router.replace(
          {
            name: "IOTDatasetDetail",
            params:dataset
          },
        );
      } else if (this.modelIndex == 1) {
        //互联感知
      }
    },
  },
  computed: {
    ...mapState([
      "publicDatasets",
      "dataset_type_name",
      "datasets",
      "modelType",
      "modelIndex",
    ]),
    datasetsInType() {
      if (this.datasets) {
        return this.datasets.filter(
          (item) => item.model_type == this.modelType
        );
      }
      return [];
    },
  },
};
</script>

<style scoped>
.publicDataset {
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
.btnCon {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
