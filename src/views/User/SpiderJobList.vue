<template>
  <div class="spiderJobList">
    <el-button type="primary" @click="$router.push('/user/Model/SpiderRequest')" style="margin-bottom: 1rem">创建爬虫任务</el-button>
    <el-table
        v-loading="loadingShow"
        element-loading-text="数据正在加载中..."
        :data="jobList"
        border
        style="width: 100%">
      <el-table-column
          prop="id"
          label="id"
          width="150">
      </el-table-column>
      <el-table-column
          prop="taskName"
          label="任务名称"
          width="120">
      </el-table-column>
      <el-table-column
          prop="siteName"
          label="目标网站名称"
          width="120">
      </el-table-column>
      <el-table-column
          prop="keyword"
          label="检索关键词"
          width="120">
      </el-table-column>
      <el-table-column
          prop="status"
          label="爬虫状态"
          width="150">
      </el-table-column>
      <el-table-column
          prop="statTime"
          label="开始时间"
          width="200">
      </el-table-column>
      <el-table-column
          prop="runtime"
          label="运行时间"
          width="200">
      </el-table-column>
      <el-table-column
          prop="endTime"
          label="结束时间"
          width="200">
      </el-table-column>
      <el-table-column
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button @click="checkJob(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="cancelJob(scope.row)" type="text" size="small">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../assets/configs/config";

let { ip } = config;
export default {
  name: "SpiderJobList",
  async mounted() {
    let res = await axios.get(`${ip}/spider/taskJobList/`);
    this.jobList=res.data.data
    this.loadingShow=false
  },
  methods: {
    checkJob(row) {
      let id=row.id
      let siteName=row.siteName
      this.$router.push({name: "SpiderItemList",params:{id:id}})
    },
    async cancelJob(row){
      let id=row.id
      let taskName=row.taskName
      let status=row.status
      if(status==='finished'){
        this.$message({
          type: "success",
          message: `${taskName}爬虫任务已完成，无法取消`,
        });
      }
      else{
        let res = await axios.get(`${ip}/spider/cancelJob/?id=${id}`);
        if (res.data.code===200){
          this.$message({
            type: "success",
            message: `成功中断爬虫给任务——!${taskName}`,
          });
        }
      }
    }
  },

  data() {
    return {
      jobList: [],
      loadingShow:true,
    }
  }
}
</script>

<style scoped>
.spiderJobList{
  padding-top: 3vh;
  padding-left: 1vw;
  padding-right: 1vw;
}
</style>
