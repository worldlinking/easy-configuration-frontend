<template>
  <div class="SpiderRequest">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="任务名称">
        <el-input v-model="form.taskName"></el-input>
      </el-form-item>
      <el-form-item label="目标网站">
        <el-select v-model="form.siteName" placeholder="请选择爬取目标网站">
          <el-option label="微博" value="微博"></el-option>
          <el-option label="推特" value="twitter"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检索关键词">
        <el-input v-model="form.keyword"></el-input>
      </el-form-item>
      <el-form-item label="搜索时间">
        <el-date-picker
            v-model="form.Date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="$router.push('/user/Model/SpiderJobList')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import config from "../../assets/configs/config";

let { ip } = config;
export default {
  name: "SpiderRequest",
  data() {
    return {
      form: {
        taskName: '',
        keyword:'',
        siteName: '',
        Date:'',
      }
    }
  },
  methods: {
    async onSubmit() {
      let postUrl = `${ip}/spider/spiderRequest/`;
      const formData = new FormData();
      formData.append("taskName", this.form.taskName);
      formData.append("siteName", this.form.siteName);
      formData.append("keyword", this.form.keyword);
      formData.append("startdate", this.form.Date[0]);
      formData.append("enddate", this.form.Date[1]);
      // formData.append("user_id", 2);
      let res = await axios.post(postUrl, formData);

      if (res.data.code === 200) {
        this.$message({
          type: "success",
          message: "爬虫任务创建成功!",
        });
      }
    }
  }
}
</script>

<style scoped>
.SpiderRequest{
  padding-top: 3vh;
  padding-left: 1vw;
  width: 60%;
}
</style>
