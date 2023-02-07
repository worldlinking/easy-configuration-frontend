<template>
  <div class="userInfoManage">
    <el-table :data="allUsers">
      <el-table-column
        prop="account"
        label="账户"
        min-width="200"
        align="center"
      >
      </el-table-column>
      <el-table-column prop="pwd" label="密码" min-width="200" align="center">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="200" align="center">
      </el-table-column>
      <el-table-column
        prop="activate"
        label="激活状态"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          <div
            v-if="scope.row.activate == 0"
            style="color: gray; fontweight: bolder"
          >
            未激活
          </div>
          <div v-else style="color: #2bdc70; fontweight: bolder">已激活</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="isseal"
        label="封禁状态"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          <div
            v-if="scope.row.isseal == 1"
            style="color: red; fontweight: bolder"
          >
            封禁
          </div>
          <div v-else style="color: black; fontweight: bolder">正常</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="isseal"
        label="操作"
        min-width="200"
        align="center"
      >
        <template slot-scope="scope">
          <el-button
            size="default"
            @click="sealAccount(scope.row.id)"
            v-if="scope.row.isseal == 0"
            >封禁</el-button
          >
          <el-button
            type="primary"
            size="default"
            @click="unSealAccount(scope.row.id)"
            v-else
            >解封</el-button
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
  name: "EasyConfigurationUserInfoManage",

  data() {
    return {};
  },

  mounted() {
    this.getAllUsers(this);
  },

  methods: {
    ...mapMutations(["getAllUsers"]),
    async sealAccount(id) {
      let res = await axios.get(`${ip}/sealUser?id=${id}`);
      if (res.data.code == 200) {
        this.$message({
          type: "success",
          message: "账户封禁成功！",
        });
        this.getAllUsers(this);
        // this.allUsers.splice(1,0);
      } else {
        this.$message({
          type: "error",
          message: "账户封禁失败！",
        });
      }
    },
    async unSealAccount(id) {
      let res = await axios.get(`${ip}/unSealUser?id=${id}`);
      if (res.data.code == 200) {
        this.$message({
          type: "success",
          message: "账户解除封禁成功！",
        });
        this.getAllUsers(this);
      } else {
        this.$message({
          type: "error",
          message: "账户解除封禁失败！",
        });
      }
    },
  },
  computed: {
    ...mapState(["allUsers"]),
  },
};
</script>

<style scoped>
.userInfoManage {
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
</style>
