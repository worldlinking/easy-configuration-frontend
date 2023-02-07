<template>
  <div class="userDatasetManage">
    <el-table :data="pageData">
      <el-table-column
        prop="id"
        label="数据集id"
        min-width="200"
        align="center"
      >
      </el-table-column>

      <el-table-column
        prop="name"
        label="数据集名称"
        min-width="200"
        align="center"
      >
      </el-table-column>

      <el-table-column
        prop="type"
        label="数据集类型"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          {{ dataset_type_name[scope.row.type] }}
        </template>
      </el-table-column>

      <el-table-column
        prop="model_type"
        label="适用模型类型"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          {{ allModelName[scope.row.model_type] }}
        </template>
      </el-table-column>

      <el-table-column
        prop="size"
        label="数据集大小"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          {{ (scope.row.size / 1024).toFixed(2) }}
        </template>
      </el-table-column>

      <el-table-column
        prop="total_num"
        label="样本总数"
        min-width="200"
        align="center"
      >
      </el-table-column>

      <el-table-column
        prop="label_num"
        label="标签总数"
        min-width="200"
        align="center"
      >
      </el-table-column>

      <el-table-column
        prop="limit"
        label="数据集权限"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          {{ scope.row.limit == 0 ? "公开" : "私有" }}
        </template>
      </el-table-column>

      <el-table-column
        prop="user"
        label="所属用户"
        min-width="200"
        align="center"
      >
      </el-table-column>

      <el-table-column label="操作" min-width="200" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            @click="deleteUserDataset(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="pageCon">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="this.allUserDatasets.length"
        :page-size="this.pageSize"
        @current-change="pageChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";
import config from "../../assets/configs/config";
let { ip, nginxStandWeightIp } = config;
export default {
  name: "EasyConfigurationUserDatasetManage",

  data() {
    return {
      pageSize: 10,
      currentPage: 1,
    };
  },

  mounted() {
    this.getAllUserDatasets(this);
    this.getAllModelName();
  },

  methods: {
    ...mapMutations(["getAllUserDatasets", "getAllModelName"]),
    pageChange(page) {
      this.currentPage = page;
    },
    deleteUserDataset(id) {
      this.$confirm("删除后无法恢复，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(async () => {
          var res = await axios.get(`${ip}/deleteUserDataset?id=${id}`);

          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getAllUserDatasets();
          } else {
            this.$message({
              type: "error",
              message: "删除失败!请稍后再试",
            });
            this.get;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  computed: {
    ...mapState(["allUserDatasets", "dataset_type_name", "allModelName"]),
    pageData() {
      if (this.allUserDatasets.length < this.pageSize)
        return this.allUserDatasets;
      var tempData = [];
      for (
        var i = this.pageSize * (this.currentPage - 1);
        i < this.pageSize * (this.currentPage - 1) + this.pageSize;
        i++
      ) {
        if (i < this.allUserDatasets.length) {
          tempData.push(this.allUserDatasets[i]);
        } else {
          break;
        }
      }
      return tempData;
    },
  },
};
</script>

<style scoped>
.userDatasetManage {
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
.pageCon {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
